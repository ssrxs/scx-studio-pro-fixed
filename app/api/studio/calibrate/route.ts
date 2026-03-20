import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';
import { generationManager } from '@/lib/services/generation';

/**
 * 🛠️ Calibration API: Eksik DNA karelerini AI ile tamamlar.
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { characterId, missingTypes } = await request.json(); // e.g., ['body', '360']

    const character = await prisma.characterDNA.findUnique({
      where: { id: characterId, userId: session.user.id }
    });

    if (!character) return NextResponse.json({ error: "Character not found" }, { status: 404 });

    const results = [];
    
    for (const type of missingTypes) {
      // PromptOrchestrator can handle the "instruction" for the specific missing view
      const instruction = `Generate a reference image for a character named ${character.name}. 
      View type: ${type}. 
      Ensure absolute biometric consistency with the face reference.`;

      const res = await generationManager.generate({
        prompt: instruction,
        userId: session.user.id,
        characterDNA: character as any, // Full DNA passed for consistency
        quality: 'high'
      });

      if (res.success && res.url) {
        // Update character in DB with new reference
        const updateData: any = {};
        if (type === 'body') updateData.poseReference = res.url;
        if (type === '360') updateData.view360Image = res.url;
        if (type === 'nobg') updateData.noBgImage = res.url;

        await prisma.characterDNA.update({
          where: { id: characterId },
          data: updateData
        });

        results.push({ type, url: res.url });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    return NextResponse.json({ error: "Calibration failed" }, { status: 500 });
  }
}
