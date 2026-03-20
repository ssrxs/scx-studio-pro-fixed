import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';
import type { CharacterDNA, StudioApiResponse, FacialFeatures } from '@/types/project';

export async function GET(): Promise<NextResponse<StudioApiResponse>> {
  try {
    const session = await auth();
    const userId = session?.user?.id || "guest-user";

    const characters = await prisma.characterDNA.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ 
      success: true, 
      characters: characters as CharacterDNA[] 
    } as StudioApiResponse);
  } catch (error) {
    console.error("Studio GET Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Karakterler getirilemedi." 
    }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse<StudioApiResponse>> {
  try {
    const session = await auth();
    const userId = session?.user?.id || "guest-user";

    const body = await request.json();
    const { 
      id, 
      name, 
      age, 
      gender, 
      skinToneID, 
      bodyType, 
      hairStyleID, 
      faceImages, 
      isMainCharacter, 
      height,
      weight,
      eyeShape,
      eyeColor,
      noseShape,
      lipShape,
      beardDensity,
      beardLength,
      hairTypeID,
      hairColorID,
      fullBodyImage,
      view360Image,
      noBgImage
    } = body;

    // Validate required fields
    if (!name || !gender || !skinToneID) {
      return NextResponse.json({ 
        success: false, 
        error: "Gerekli alanlar eksik." 
      }, { status: 400 });
    }

    // If setting as main character, unset others
    if (isMainCharacter) {
      await prisma.characterDNA.updateMany({
        where: { userId },
        data: { isMainCharacter: false }
      });
    }

    // Build facial features object
    const facialFeaturesData: FacialFeatures = {
      eyeShape: eyeShape || 'almond',
      eyeColor: eyeColor || 'obsidian',
      noseShape: noseShape || 'natural',
      lipShape: lipShape || 'natural',
      beardDensity: beardDensity || 'none',
      beardLength: beardLength || 'clean',
      hairTypeID: hairTypeID || '1A',
      hairColorID: hairColorID || 'jet_black'
    };

    // Parse face images
    const faceImagesArray: string[] = Array.isArray(faceImages) 
      ? faceImages 
      : typeof faceImages === 'string' 
        ? JSON.parse(faceImages) 
        : [];

    let character: CharacterDNA | null = null;
    
    if (id) {
      // Update existing character
      character = await prisma.characterDNA.update({
        where: { id },
        data: {
          name: name || "İsimsiz Karakter",
          age: String(age), 
          gender, 
          skinTone: skinToneID, 
          bodyType, 
          hairStyle: hairStyleID, 
          facialFeatures: JSON.stringify(facialFeaturesData),
          height: String(height),
          weight: String(weight),
          faceImages: JSON.stringify(faceImagesArray),
          poseReference: fullBodyImage || null,
          view360Image: view360Image || null,
          noBgImage: noBgImage || null,
          isMainCharacter: !!isMainCharacter
        }
      }) as CharacterDNA;
    } else {
      // Create new character
      character = await prisma.characterDNA.create({
        data: {
          userId,
          name: name || "Yeni Karakter",
          age: String(age), 
          gender, 
          skinTone: skinToneID, 
          bodyType, 
          hairStyle: hairStyleID, 
          facialFeatures: JSON.stringify(facialFeaturesData),
          height: String(height),
          weight: String(weight),
          faceImages: JSON.stringify(faceImagesArray),
          poseReference: fullBodyImage || null,
          view360Image: view360Image || null,
          noBgImage: noBgImage || null,
          isMainCharacter: !!isMainCharacter
        }
      }) as CharacterDNA;
    }

    return NextResponse.json({ 
      success: true, 
      character 
    } as StudioApiResponse);
  } catch (error) {
    console.error("Studio API POST Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Karakter kaydedilemedi." 
    }, { status: 500 });
  }
}

export async function DELETE(request: Request): Promise<NextResponse<StudioApiResponse>> {
  try {
    const session = await auth();
    const userId = session?.user?.id || "guest-user";
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Geçersiz istek." 
      }, { status: 400 });
    }

    // Verify ownership before deleting
    const character = await prisma.characterDNA.findFirst({
      where: { id, userId }
    });

    if (!character) {
      return NextResponse.json({ 
        success: false, 
        error: "Karakter bulunamadı." 
      }, { status: 404 });
    }

    await prisma.characterDNA.delete({
      where: { id }
    });

    return NextResponse.json({ 
      success: true 
    } as StudioApiResponse);
  } catch (error) {
    console.error("Studio API DELETE Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Karakter silinemedi." 
    }, { status: 500 });
  }
}
