const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const prisma = new PrismaClient();

async function processPrompts() {
  const filePath = path.join('D:/Projeler/SCX-Studio-Pro', 'prompts_data_v2.jsonl');
  if (!fs.existsSync(filePath)) {
    console.error('Dosya bulunamadi:', filePath);
    return;
  }

  // Önce mevcut import sayısını kontrol et
  const existing = await prisma.promptTemplate.count();
  console.log(`Mevcut prompt sayisi: ${existing}`);

  if (existing > 100) {
    console.log('Zaten import edilmis! Cikiliyor.');
    await prisma.$disconnect();
    return;
  }

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  console.log('2406 prompt isleniyor...');
  let count = 0;
  let errors = 0;

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const data = JSON.parse(line);
      const originalPrompt = data.prompt;
      if (!originalPrompt) continue;

      let template = originalPrompt;
      const defaults = {
        SUBJECT: "a person",
        OUTFIT: "original outfit",
        POSE: "natural pose",
        BACKGROUND: "original background"
      };

      const subjects = ["a man", "a woman", "a person", "young girl", "young man", "the person", "the subject"];
      for (const s of subjects) {
        if (template.toLowerCase().includes(s)) {
          const regex = new RegExp(s, 'gi');
          template = template.replace(regex, '[SUBJECT]');
          defaults.SUBJECT = s;
          break;
        }
      }
      if (!template.includes('[SUBJECT]')) template = '[SUBJECT], ' + template;

      // localPath'i düzelt — public/downloads/ olarak kaydet
      let localPath = data.local_path;
      if (localPath) {
        const filename = path.basename(localPath);
        localPath = '/downloads/' + filename;
      }

      await prisma.promptTemplate.create({
        data: {
          collection: data.collection || 'curated',
          originalPrompt,
          template,
          defaults: JSON.stringify(defaults),
          explanation: originalPrompt.substring(0, 100) + '...',
          imageUrl: data.image_url || null,
          localPath: localPath || null,
          isRefined: true,
          isNSFW: false
        }
      });

      count++;
      if (count % 100 === 0) console.log(`${count} prompt eklendi...`);

    } catch (e) {
      errors++;
    }
  }

  console.log(`\nTAMAM! ${count} prompt eklendi, ${errors} hata atlandı.`);
}

processPrompts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
