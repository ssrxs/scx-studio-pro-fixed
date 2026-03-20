import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';

export async function GET() {
  try {
    const session = await auth();
    
    // Admin check
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const [userCount, femaleCount, maleCount, imageCount, characterCount, feedbackCount] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { gender: 'female' } }),
      prisma.user.count({ where: { gender: 'male' } }),
      prisma.generatedImage.count(),
      prisma.characterDNA.count(),
      prisma.feedback.count({ where: { status: 'OPEN' } })
    ]);

    return NextResponse.json({
      stats: {
        totalUsers: userCount,
        femaleUsers: femaleCount,
        maleUsers: maleCount,
        totalImages: imageCount,
        totalCharacters: characterCount,
        openFeedbacks: feedbackCount
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Stats failed" }, { status: 500 });
  }
}
