const fs = require('fs');
const path = require('path');

const folders = [
  'src/api/controllers/auth',
  'src/api/routes/auth',
  'src/api/middlewares',
  'src/api/validators',
  'src/services/auth',
  'src/repositories',
  'src/models',
  'src/config',
  'src/utils',
  'src/jobs',
  'src/sockets',
  'src/integrations',
  'tests/unit',
  'tests/integration',
  'logs',
];

folders.forEach(folder => {
  fs.mkdirSync(path.join(__dirname, folder), { recursive: true });
});

console.log('Folders scaffolded successfully.');
