import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updatePaths() {
  

  const prompts = await prisma.promptTemplate.findMany();
  let count = 0;

  for (const prompt of prompts) {
    if (prompt.localPath) {
      // Örn: banana_downloads\xyz.webp -> /downloads/xyz.webp
      const fileName = prompt.localPath.split(/[\\/]/).pop();
      const newPath = `/downloads/${fileName}`;
      
      await prisma.promptTemplate.update({
        where: { id: prompt.id },
        data: { localPath: newPath }
      });
      count++;
    }
  }

  
}

updatePaths()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

