import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';
import { generationManager } from '@/lib/services/generation';
import type { CalibrateApiResponse } from '@/types/project';

/**
 * 🛠️ Calibration API: Eksik DNA karelerini AI ile tamamlar.
 * POST /api/studio/calibrate
 */
export async function POST(request: Request): Promise<NextResponse<CalibrateApiResponse>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ 
        success: false, 
        error: "Unauthorized" 
      }, { status: 401 });
    }

    const { characterId, missingTypes } = await request.json();

    // Validate inputs
    if (!characterId || !Array.isArray(missingTypes) || missingTypes.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid request parameters" 
      }, { status: 400 });
    }

    // Fetch character with ownership verification
    const character = await prisma.characterDNA.findFirst({
      where: { id: characterId, userId: session.user.id }
    });

    if (!character) {
      return NextResponse.json({ 
        success: false, 
        error: "Character not found" 
      }, { status: 404 });
    }

    const results: Array<{ type: string; url: string }> = [];
    
    for (const type of missingTypes) {
      try {
        // Build instruction prompt for specific missing view
        const instruction = `Generate a reference image for a character named ${character.name}. 
        View type: ${type}. 
        Ensure absolute biometric consistency with the face reference.
        Character details: ${character.age} years old, ${character.gender}, ${character.skinTone} skin tone.`;

        const res = await generationManager.generate({
          prompt: instruction,
          userId: session.user.id,
          characterDNA: character,
          quality: 'high'
        });

        if (res.success && res.url) {
          // Update character in DB with new reference
          const updateData: Record<string, string | null> = {};
          
          if (type === 'body') updateData.poseReference = res.url;
          if (type === '360') updateData.view360Image = res.url;
          if (type === 'nobg') updateData.noBgImage = res.url;

          if (Object.keys(updateData).length > 0) {
            await prisma.characterDNA.update({
              where: { id: characterId },
              data: updateData
            });

            results.push({ type, url: res.url });
          }
        }
      } catch (typeError) {
        console.error(`Error generating ${type}:`, typeError);
        // Continue with next type instead of failing entire request
      }
    }

    return NextResponse.json({ 
      success: true, 
      results 
} as CalibrateApiResponse);
  } catch (error) {
    console.error("Calibration API Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Calibration failed" 
    }, { status: 500 });
  }
}
