import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';
import { buildFinalPrompt } from '@/lib/utils/ai-rules';
import { vaultAgent } from '@/lib/shared/scx-vault';

/**
 * SCX SMART GENERATOR
 * Üretim zinciri: FAL.AI (Yüz enjeksiyonlu) â†’ Together.ai (ücretsiz FLUX) â†’ Pollinations.ai (ücretsiz, key yok)
 */

// â”€â”€â”€ Pollinations.ai â€” Tamamen ücretsiz, key gerekmez â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function generateWithPollinations(prompt: string): Promise<string> {
  const encoded = encodeURIComponent(prompt);
  const seed = Math.floor(Math.random() * 999999);
  // Pollinations URL'si kalıcı â€” direkt Görsel URL olarak kullanılabilir
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=768&height=1024&seed=${seed}&model=flux&nologo=true&enhance=false`;

  // URL erişilebilirliğini test et (timeout 60s â€” flux biraz yavaş olabilir)
  const resp = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(60_000) });
  if (!resp.ok) throw new Error(`Pollinations HTTP ${resp.status}`);
  return url; // Görsel URL'si doğrudan döndürülür
}

// â”€â”€â”€ Together.ai â€” Ücretsiz FLUX.1-schnell-Free â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function generateWithTogether(prompt: string, apiKey: string): Promise<string> {
  const resp = await fetch('https://api.together.xyz/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'black-forest-labs/FLUX.1-schnell-Free',
      prompt,
      width: 768,
      height: 1024,
      steps: 4,
      n: 1,
    }),
    signal: AbortSignal.timeout(90_000),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Together.ai: ${err}`);
  }

  const data = await resp.json();
  const imgUrl = data?.data?.[0]?.url;
  if (!imgUrl) throw new Error('Together.ai boş yanıt döndürdü.');
  return imgUrl;
}

// â”€â”€â”€ Fal.ai â€” FAL_KEY ile, Yüz enjeksiyonlu FLUX PuLID â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function generateWithFal(
  prompt: string,
  falKey: string,
  referenceImages: { image_url: string }[]
): Promise<string> {
  const resp = await fetch('https://queue.fal.run/fal-ai/flux-pulid', {
    method: 'POST',
    headers: { Authorization: `Key ${falKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      reference_images: referenceImages,
      image_size: 'portrait_4_3',
      num_inference_steps: 25,
      guidance_scale: 3.5,
      sync_mode: true,
    }),
    signal: AbortSignal.timeout(120_000),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(`Fal.ai: ${err.detail || resp.status}`);
  }

  const result = await resp.json();
  const url = result?.images?.[0]?.url;
  if (!url) throw new Error('Fal.ai boş yanıt döndürdü.');
  return url;
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id || 'guest-user';

    const body = await request.json();
    const { prompt, useMyFace, tempFaceImage, mixerSettings, characterId } = body;

    if (!prompt) return NextResponse.json({ error: 'Prompt boş olamaz.' }, { status: 400 });

    // â”€â”€â”€ Karakter / referans Görseller â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    let referenceImages: { image_url: string }[] = [];
    let characterDNA: any = null;

    if (useMyFace && session?.user) {
      if (tempFaceImage) {
        referenceImages = [{ image_url: tempFaceImage }];
      } else {
        const character = await prisma.characterDNA.findFirst({
          where: { userId, id: characterId || undefined, isMainCharacter: characterId ? undefined : true },
        });
        if (character) {
          characterDNA = character;
          try {
            const parsed = typeof character.faceImages === 'string'
              ? JSON.parse(character.faceImages)
              : character.faceImages;
            const images = Array.isArray(parsed) ? parsed : [parsed];
            referenceImages = images.filter(Boolean).map((url: string) => ({ image_url: url }));
          } catch {
            if (character.faceImages) referenceImages = [{ image_url: character.faceImages as string }];
          }
          if (character.poseReference) referenceImages.push({ image_url: character.poseReference as string });
        }
      }
    }

    // â”€â”€â”€ SCX Prompt optimizasyonu â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const optimizedPrompt = buildFinalPrompt(prompt, characterDNA);

    // â”€â”€â”€ Generator zinciri â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const falKey = vaultAgent.getKey('FAL_KEY');
    const togetherKey = process.env.TOGETHER_API_KEY;

    let imageUrl = '';
    let engineUsed = '';

    if (falKey && referenceImages.length > 0) {
      // Yüz enjeksiyonlu â€” en kaliteli
      imageUrl = await generateWithFal(optimizedPrompt, falKey, referenceImages);
      engineUsed = 'fal_ai_flux_pulid';
    } else if (falKey) {
      // FAL_KEY var ama referans yok â€” sade FLUX
      imageUrl = await generateWithFal(optimizedPrompt, falKey, []);
      engineUsed = 'fal_ai_flux';
    } else if (togetherKey) {
      // Ücretsiz Together.ai FLUX
      imageUrl = await generateWithTogether(optimizedPrompt, togetherKey);
      engineUsed = 'together_flux_free';
    } else {
      // Tamamen ücretsiz Pollinations.ai
      imageUrl = await generateWithPollinations(optimizedPrompt);
      engineUsed = 'pollinations_flux_free';
    }

    // â”€â”€â”€ Veritabanına kaydet â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    let savedImage: any = null;
    if (session?.user) {
      savedImage = await prisma.generatedImage.create({
        data: {
          userId,
          promptUsed: prompt,
          imageUrl,
          engineUsed,
          mixerSettings: JSON.stringify(mixerSettings || {}),
        },
      }).catch((e) => { console.error('DB save error:', e); return null; });
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      id: savedImage?.id || null,
      engine: engineUsed,
      hasFaceInjection: engineUsed === 'fal_ai_flux_pulid',
    });

  } catch (error: any) {
    console.error('Generate Error:', error);
    return NextResponse.json({ error: error.message || 'Görsel üretilemedi.' }, { status: 500 });
  }
}

