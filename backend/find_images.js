const fs = require('fs');
const lines = fs.readFileSync('C:/Users/matej/.gemini/antigravity/brain/c69afc0e-473c-40d4-9117-7f381eb3772b/.system_generated/logs/transcript.jsonl', 'utf8').split('\n');
lines.forEach(l => {
  if (!l) return;
  const obj = JSON.parse(l);
  if (obj.type === 'USER_INPUT' && obj.content.includes('media__')) {
    console.log('--- USER MESSAGE ---');
    console.log(obj.content.substring(0, 500));
  }
});
