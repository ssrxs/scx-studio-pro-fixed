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
        where: { id, userId },
        data: {
          name: name || "İsimsiz Karakter",
          age, gender, skinTone, bodyType, hairStyle, facialFeatures, height,
          faceImages: typeof faceImages === 'string' ? faceImages : JSON.stringify(faceImages),
          isMainCharacter: !!isMainCharacter
        }
      });
    } else {
      character = await prisma.characterDNA.create({
        data: {
          userId,
          name: name || "Yeni Karakter",
          age, gender, skinTone, bodyType, hairStyle, facialFeatures, height,
          faceImages: typeof faceImages === 'string' ? faceImages : JSON.stringify(faceImages),
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
