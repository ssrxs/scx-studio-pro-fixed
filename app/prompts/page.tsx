import { auth } from "@/auth";
import { prisma } from '@/lib/core/prisma';
import LandingPage from '@/components/organisms/LandingPage';
import PromptLibraryClient from '@/components/organisms/PromptLibraryClient';

/**
 * 📚 Prompt Kütüphanesi Sayfası
 */
export default async function PromptsPage() {
  const session = await auth();

  if (!session) {
    return <LandingPage />;
  }

  let prompts: any[] = [];
  try {
    prompts = await prisma.promptTemplate.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: {
        favoritedBy: {
          where: { userId: session.user?.id }
        }
      }
    });
  } catch (error) {
    prompts = [];
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-12">
      {/* Background FX */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[140px] rounded-full mix-blend-screen" />
      </div>
      
      <PromptLibraryClient initialPrompts={prompts} />
    </main>
  );
}
