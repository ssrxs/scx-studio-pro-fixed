import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function tagNSFW() {
   taranıyor ve ayıklanıyor...');

  const keywords = [
    'nude', 'naked', 'lingerie', 'topless', 'underwear', 
    'see-through', 'explicit', 'erotic', 'bare breasts', 
    'bikini', 'swimsuit', 'skimpy', 'sensual'
  ];

  const prompts = await prisma.promptTemplate.findMany();
  let count = 0;

  for (const prompt of prompts) {
    const text = (prompt.originalPrompt + ' ' + (prompt.explanation || '')).toLowerCase();
    
    const isSensitive = keywords.some(k => text.includes(k));

    if (isSensitive) {
      await prisma.promptTemplate.update({
        where: { id: prompt.id },
        data: { 
          isNSFW: true,
          collection: 'Adult' // Ayrı bir koleksiyona taşı
        }
      });
      count++;
    }
  }

  
}

tagNSFW()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

