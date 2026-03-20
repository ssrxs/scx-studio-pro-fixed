import { NextResponse } from 'next/server';
import { prisma } from '@/lib/core/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

/**
 * Prompt Listeleme API: NSFW (Adult) filtreleme ve Yetkilendirme Korumalı
 */
export async function GET(request: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    
    let page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    let limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    
    const collection = searchParams.get('collection');
    const query = searchParams.get('q');
    const isAdultConfirmed = searchParams.get('adultConfirmed') === 'true';
    
    const skip = (page - 1) * limit;

    const where: any = {};
    
    // --- GÜVENLİK FİLTRESİ ---
    // Giriş yapılmamışsa veya yaş doğrulanmamışsa NSFW içerikleri ASLA gösterme
    if (!session?.user || !isAdultConfirmed) {
      where.isNSFW = false;
      
      // Eğer Kullanıcı doğrudan 'Adult' koleksiyonunu istiyorsa reddet
      if (collection === 'Adult') {
        return NextResponse.json({ 
          error: "Hassas içerikler için yaş doğrulaması gereklidir.",
          items: [], total: 0, hasMore: false 
        });
      }
    } else {
      // Giriş yapılmış ve doğrulanmışsa, kategoriye göre filtrele
      if (collection && collection !== 'all') {
        where.collection = collection;
      }
    }

    if (query) {
      where.OR = [
        { originalPrompt: { contains: query } },
        { collection: { contains: query } },
        { explanation: { contains: query } }
      ];
    }

    const total = await prisma.promptTemplate.count({ where });

    const items = await prisma.promptTemplate.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { isRefined: 'desc' },
        { id: 'desc' }
      ]
    });

    const formattedItems = items.map(item => ({
      id: item.id,
      collection: item.collection,
      prompt: item.originalPrompt,
      template: item.template,
      defaults: item.defaults,
      explanation: item.explanation,
      imageUrl: item.imageUrl,
      localPath: item.localPath,
      isRefined: item.isRefined,
      isNSFW: item.isNSFW
    }));

    return NextResponse.json({
      items: formattedItems,
      total,
      page,
      limit,
      hasMore: skip + items.length < total
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Veriler getirilemedi." }, { status: 500 });
  }
}

