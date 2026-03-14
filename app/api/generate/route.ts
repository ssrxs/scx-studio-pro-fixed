import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { buildFinalPrompt } from '@/lib/ai-rules';

/**
 * Üretim API'si: Fal.ai üzerinden yüksek kaliteli görsel üretir.
 */
export async function POST(request: Request) {
  try {
    // 1. Kimlik Doğrulama
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Üretim yapmak için Google ile giriş yapmalısınız." }, { status: 401 });
    }

    // 2. İstek Verilerini Al
    const body = await request.json();
    const { prompt, useMyFace, tempFaceImage, mixerSettings } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt içeriği boş olamaz." }, { status: 400 });
    }

    // 3. API Anahtarı Kontrolü
    const falKey = process.env.FAL_KEY;
    if (!falKey) {
      return NextResponse.json({ 
        error: "Sistem yapılandırma hatası: FAL_KEY eksik." 
      }, { status: 500 });
    }

    // 4. Referans Görsel Belirleme
    let referenceImageUrl = "";
    let characterDNA = null;

    if (useMyFace) {
      // Hızlı yükleme önceliklidir
      if (tempFaceImage) {
        referenceImageUrl = tempFaceImage;
      } else {
        // Stüdyo profilinden ana karakteri al
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          include: { characters: { where: { isMainCharacter: true } } }
        });
        
        const mainChar = user?.characters?.[0];
        characterDNA = mainChar;

        if (mainChar?.faceImages) {
          try {
            const parsed = JSON.parse(mainChar.faceImages);
            referenceImageUrl = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : parsed;
          } catch(e) {
            referenceImageUrl = mainChar.faceImages;
          }
        }
      }

      if (!referenceImageUrl) {
        return NextResponse.json({ error: "Karakter yüzünüz bulunamadı. Lütfen Studio'dan profil oluşturun veya hızlı yükleme yapın." }, { status: 400 });
      }
    }

    // 5. SCX Optimizasyonu
    const optimizedPrompt = buildFinalPrompt(prompt, characterDNA);

    // 6. Fal.ai API Çağrısı
    const falResponse = await fetch("https://queue.fal.run/fal-ai/flux-pulid", {
      method: "POST",
      headers: {
        "Authorization": `Key ${falKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: optimizedPrompt,
        reference_images: referenceImageUrl ? [{ image_url: referenceImageUrl }] : [], 
        image_size: "portrait_4_3",
        num_inference_steps: 20,
        guidance_scale: 3.5,
        sync_mode: true
      })
    });

    if (!falResponse.ok) {
      return NextResponse.json({ error: "Yapay zeka motoru şu an meşgul, lütfen az sonra tekrar deneyin." }, { status: 500 });
    }

    const result = await falResponse.json();
    const generatedImageUrl = result.images[0].url;

    // 7. Veritabanına Kaydet (SCX Kara Kutusu)
    const savedImage = await prisma.generatedImage.create({
      data: {
        userId: session.user.id as string,
        promptUsed: prompt,
        imageUrl: generatedImageUrl,
        engineUsed: "fal_ai_flux_pulid",
        mixerSettings: JSON.stringify(mixerSettings || {})
      }
    });

    return NextResponse.json({ success: true, imageUrl: generatedImageUrl, id: savedImage.id });

  } catch (error) {
    console.error("Critical Error in /api/generate:", error);
    return NextResponse.json({ error: "Sunucu tarafında teknik bir hata oluştu." }, { status: 500 });
  }
}
