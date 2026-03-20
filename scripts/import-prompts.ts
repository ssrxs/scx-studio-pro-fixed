import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';

const prisma = new PrismaClient();

async function processPrompts() {
  const filePath = path.join(process.cwd(), 'prompts_data_v2.jsonl');
  if (!fs.existsSync(filePath)) {
    console.error('Dosya bulunamadı:', filePath);
    return;
  }

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  

  let count = 0;
  
  // Önce mevcutları temizle (isteğe bağlı)
  // await prisma.promptTemplate.deleteMany({});

  for await (const line of rl) {
    try {
      const data = JSON.parse(line);
      const originalPrompt = data.prompt;
      
      let template = originalPrompt;
      const defaults: any = {
        SUBJECT: "a person",
        OUTFIT: "original outfit",
        POSE: "natural pose",
        BACKGROUND: "original background"
      };

      const subjects = ["a man", "a woman", "a person", "young girl", "young man", "the person", "the subject"];
      for (const s of subjects) {
        if (template.toLowerCase().includes(s)) {
          template = template.replace(new RegExp(s, 'gi'), '[SUBJECT]');
          defaults.SUBJECT = s;
          break;
        }
      }

      if (!template.includes('[SUBJECT]')) template = '[SUBJECT], ' + template;

      await prisma.promptTemplate.create({
        data: {
          collection: data.collection || "Imported",
          originalPrompt: originalPrompt,
          template: template,
          defaults: JSON.stringify(defaults),
          explanation: originalPrompt.substring(0, 80) + '...',
          imageUrl: data.image_url,
          localPath: data.local_path,
          isRefined: true
        }
      });

      count++;
      if (count % 50 === 0) 
      
    } catch (e) {
      // Hatalı satırları atla
    }
  }

  
}

processPrompts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

