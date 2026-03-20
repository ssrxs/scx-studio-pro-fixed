import { auth } from "@/auth";
import LandingPage from '@/components/organisms/LandingPage';
import StudioClient from '@/components/organisms/StudioClient';
import { prisma } from '@/lib/core/prisma';

/**
 * 🎨 Ana Sayfa: SCX STUDIO (Çalışma Alanı)
 */
export default async function HomePage() {
  const session = await auth();

  if (!session) {
    return <LandingPage />;
  }

  // Kullanıcının karakterlerini ve son üretimlerini çek
  let characters: any[] = [];
  let recentImages: any[] = [];
  
  try {
    characters = await prisma.characterDNA.findMany({
      where: { userId: session.user?.id },
      orderBy: { isMainCharacter: 'desc' }
    });
    
    recentImages = await prisma.generatedImage.findMany({
      where: { userId: session.user?.id },
      take: 10,
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    // handled
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-12 overflow-x-hidden">
      {/* Background FX */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[140px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[140px] rounded-full mix-blend-screen" />
      </div>
      
      <StudioClient 
        user={session.user} 
        initialCharacters={characters} 
        recentImages={recentImages} 
      />
    </main>
  );
}
