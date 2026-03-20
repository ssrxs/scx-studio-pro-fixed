import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';
import { buildFinalPrompt } from '@/lib/utils/ai-rules';
import { vaultAgent } from '@/lib/shared/scx-vault';
import type { GenerationRequest, GenerationResponse, MixerSettings } from '@/types/project';

/**
 * SCX SMART GENERATOR
 * Üretim zinciri: FAL.AI (Yüz enjeksiyonlu) → Together.ai (ücretsiz FLUX) → Pollinations.ai (ücretsiz, key yok)
 */

// ─── Pollinations.ai – Tamamen ücretsiz, key gerekmez ───────────────────────
async function generateWithPollinations(prompt: string): Promise<string> {
  const encoded = encodeURIComponent(prompt);
  const seed = Math.floor(Math.random() * 999999);
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=768&height=1024&seed=${seed}&model=flux&nologo=true&enhance=false`;

  const resp = await fetch(url, { 
    method: 'HEAD', 
    signal: AbortSignal.timeout(60_000) 
  });
  
  if (!resp.ok) throw new Error(`Pollinations HTTP ${resp.status}`);
  return url;
}

// ─── Together.ai – Ücretsiz FLUX.1-schnell-Free ───────────────────────────
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

// ─── Fal.ai – FAL_KEY ile, Yüz enjeksiyonlu FLUX PuLID ──────────────────
async function generateWithFal(
  prompt: string,
  falKey: string,
  referenceImages: { image_url: string }[]
): Promise<string> {
  const resp = await fetch('https://queue.fal.run/fal-ai/flux-pulid', {
    method: 'POST',
    headers: { 
      Authorization: `Key ${falKey}`, 
      'Content-Type': 'application/json' 
    },
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

export async function POST(request: Request): Promise<NextResponse<GenerationResponse>> {
  try {
    const session = await auth();
    const userId = session?.user?.id || 'guest-user';

    const body = await request.json() as GenerationRequest;
    const { prompt, useMyFace, tempFaceImage, mixerSettings, characterId } = body;

    if (!prompt) {
      return NextResponse.json({ 
        success: false, 
        error: 'Prompt boş olamaz.' 
      }, { status: 400 });
    }

    // ─── Karakter / referans Görseller ──────────────────────────────────────
    let referenceImages: { image_url: string }[] = [];
    let characterDNA: any = null;

    if (useMyFace && session?.user) {
      if (tempFaceImage) {
        referenceImages = [{ image_url: tempFaceImage }];
      } else {
        const character = await prisma.characterDNA.findFirst({
          where: { 
            userId, 
            id: characterId || undefined, 
            isMainCharacter: characterId ? undefined : true 
          },
        });
        
        if (character) {
          characterDNA = character;
          try {
            const parsed = typeof character.faceImages === 'string'
              ? JSON.parse(character.faceImages)
              : character.faceImages;
            const images = Array.isArray(parsed) ? parsed : [parsed];
            referenceImages = images.filter(Boolean).map((url: string) => ({ image_url: url }));
          } catch (e) {
            if (character.faceImages) {
              referenceImages = [{ image_url: character.faceImages as string }];
            }
          }
          if (character.poseReference) {
            referenceImages.push({ image_url: character.poseReference as string });
          }
        }
      }
    }

    // ─── SCX Prompt optimizasyonu ──────────────────────────────────────────
    const optimizedPrompt = buildFinalPrompt(
      prompt, 
      (mixerSettings as MixerSettings) || {}, 
      characterDNA
    );

    // ─── Generator zinciri ────────────────────────────────────────────────
    const falKey = vaultAgent.getKey('FAL_KEY');
    const togetherKey = process.env.TOGETHER_API_KEY;

    let imageUrl = '';
    let engineUsed = '';

    try {
      if (falKey && referenceImages.length > 0) {
        // Yüz enjeksiyonlu – en kaliteli
        imageUrl = await generateWithFal(optimizedPrompt, falKey, referenceImages);
        engineUsed = 'fal_ai_flux_pulid';
      } else if (falKey) {
        // FAL_KEY var ama referans yok – sade FLUX
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
    } catch (generationError) {
      console.error('Generation error:', generationError);
      // Fallback to Pollinations
      try {
        imageUrl = await generateWithPollinations(optimizedPrompt);
        engineUsed = 'pollinations_flux_free_fallback';
      } catch (fallbackError) {
        throw new Error(`All generation methods failed: ${generationError}`);
      }
    }

    // ─── Veritabanına kaydet ──────────────────────────────────────────────
    let savedImage: any = null;
    if (session?.user) {
      try {
        savedImage = await prisma.generatedImage.create({
          data: {
            userId,
            promptUsed: prompt,
            imageUrl,
            engineUsed,
            mixerSettings: JSON.stringify(mixerSettings || {}),
          },
        });
      } catch (dbError) {
        console.error('DB save error:', dbError);
        // Don't fail the request if DB save fails
      }
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      id: savedImage?.id || null,
      engine: engineUsed,
      hasFaceInjection: engineUsed === 'fal_ai_flux_pulid',
    } as GenerationResponse);

  } catch (error: any) {
    console.error('Generate Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Görsel üretilemedi.' 
    }, { status: 500 });
  }
}
