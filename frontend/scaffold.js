const fs = require('fs');
const path = require('path');

const folders = [
  'src/features/auth',
  'src/features/tracker',
  'src/features/ai-chat',
  'src/components/ui',
  'src/components/layout',
  'src/components/shared',
  'src/hooks',
  'src/store',
  'src/services',
  'src/types',
  'src/utils',
  'src/constants',
  'src/animations',
  'src/providers',
  'src/lib'
];

folders.forEach(folder => {
  fs.mkdirSync(path.join(__dirname, folder), { recursive: true });
});

console.log('Frontend folders scaffolded successfully.');
