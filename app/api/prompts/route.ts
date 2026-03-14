import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parametreleri güvenli hale getir (Clamp)
    let page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    let limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    
    const collection = searchParams.get('collection');
    const query = searchParams.get('q');
    
    const skip = (page - 1) * limit;

    // Arama ve filtreleme koşulları
    const where: any = {};
    if (collection) {
      where.collection = collection;
    }
    if (query) {
      where.originalPrompt = {
        contains: query
      };
    }

    // Toplam sayıyı al
    const total = await prisma.promptTemplate.count({ where });

    // Verileri getir
    const items = await prisma.promptTemplate.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { isRefined: 'desc' },
        { id: 'desc' }
      ]
    });

    // Frontend için alan isimlerini eşitle (DTO Mapping)
    const formattedItems = items.map(item => ({
      id: item.id,
      collection: item.collection,
      prompt: item.originalPrompt,
      template: item.template,
      defaults: item.defaults,
      explanation: item.explanation,
      imageUrl: item.imageUrl,
      localPath: item.localPath,
      isRefined: item.isRefined
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
