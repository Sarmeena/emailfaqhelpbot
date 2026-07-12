const fs = require('fs');
const path = require('path');

const targetDir = 'C:\\Users\\Windows 11\\.gemini\\antigravity-ide\\brain\\3d935559-9eb2-407f-b899-e163fa2beabf';

console.log('Checking path:', targetDir);
try {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log('Successfully created directory!');
} catch (err) {
  console.error('Error creating directory:', err);
}
