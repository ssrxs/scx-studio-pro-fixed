import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });

    const albums = await prisma.album.findMany({
      where: { userId: session.user.id },
      include: {
        images: { take: 1 }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ albums });
  } catch (error) {
    return NextResponse.json({ error: "Albümler getirilemedi." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });

    const { name, description } = await request.json();

    const album = await prisma.album.create({
      data: {
        userId: session.user.id,
        name,
        description
      }
    });

    return NextResponse.json({ success: true, album });
  } catch (error) {
    return NextResponse.json({ error: "Albüm oluşturulamadı." }, { status: 500 });
  }
}
