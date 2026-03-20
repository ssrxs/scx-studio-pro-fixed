import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { isAdult: true }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Doğrulama kaydedilemedi." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ isAdult: false });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdult: true }
    });

    return NextResponse.json({ isAdult: user?.isAdult || false });
  } catch (error) {
    return NextResponse.json({ isAdult: false });
  }
}
