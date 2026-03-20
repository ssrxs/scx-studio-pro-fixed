import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id || "guest-user"; // Demo Mode

    const characters = await prisma.characterDNA.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ characters });
  } catch (error) {
    return NextResponse.json({ error: "Karakterler getirilemedi." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id || "guest-user"; // Demo Mode

    const body = await request.json();
    const { 
      id, name, age, gender, skinTone, bodyType, 
      hairStyle, facialFeatures, faceImages, isMainCharacter, height
    } = body;

    if (isMainCharacter) {
      await prisma.characterDNA.updateMany({
        where: { userId },
        data: { isMainCharacter: false }
      });
    }

    let character;
    if (id) {
      character = await prisma.characterDNA.update({
        where: { id },
        data: {
          name: name || "İsimsiz Karakter",
          age: String(age), 
          gender, 
          skinTone: body.skinToneID || skinTone, 
          bodyType, 
          hairStyle: body.hairStyleID || hairStyle, 
          facialFeatures: JSON.stringify({
            eyeShape: body.eyeShape,
            eyeColor: body.eyeColor,
            noseShape: body.noseShape,
            lipShape: body.lipShape,
            beardDensity: body.beardDensity,
            beardLength: body.beardLength,
            hairTypeID: body.hairTypeID,
            hairColorID: body.hairColorID
          }),
          height: String(height),
          weight: String(body.weight),
          faceImages: typeof faceImages === 'string' ? faceImages : JSON.stringify(faceImages),
          poseReference: body.fullBodyImage,
          view360Image: body.view360Image,
          noBgImage: body.noBgImage,
          isMainCharacter: !!isMainCharacter
        }
      });
    } else {
      character = await prisma.characterDNA.create({
        data: {
          userId,
          name: name || "Yeni Karakter",
          age: String(age), 
          gender, 
          skinTone: body.skinToneID || skinTone, 
          bodyType, 
          hairStyle: body.hairStyleID || hairStyle, 
          facialFeatures: JSON.stringify({
            eyeShape: body.eyeShape,
            eyeColor: body.eyeColor,
            noseShape: body.noseShape,
            lipShape: body.lipShape,
            beardDensity: body.beardDensity,
            beardLength: body.beardLength,
            hairTypeID: body.hairTypeID,
            hairColorID: body.hairColorID
          }),
          height: String(height),
          weight: String(body.weight),
          faceImages: typeof faceImages === 'string' ? faceImages : JSON.stringify(faceImages),
          poseReference: body.fullBodyImage,
          view360Image: body.view360Image,
          noBgImage: body.noBgImage,
          isMainCharacter: !!isMainCharacter
        }
      });
    }

    return NextResponse.json({ success: true, character });
  } catch (error) {
    console.error("Studio API POST Error:", error);
    return NextResponse.json({ error: "Karakter kaydedilemedi." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id || "guest-user";
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });

    await prisma.characterDNA.delete({
      where: { id, userId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Karakter silinemedi." }, { status: 500 });
  }
}
