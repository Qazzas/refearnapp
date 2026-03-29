const fs = require('fs');
const path = require('path');

// 1. Source: Your actual local file in the root
const sourcePath = path.join(__dirname, '../.env.selfhosted');
// 2. Output: The template file in the root
const outputPath = path.join(__dirname, '../.env.example');

try {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`.env.selfhosted not found at ${sourcePath}`);
  }

  const content = fs.readFileSync(sourcePath, 'utf8');

  // Split by lines and process
  const lines = content.split(/\r?\n/);

  const exampleLines = lines.map(line => {
    const trimmed = line.trim();

    // Keep comments and empty lines as they are
    if (trimmed.startsWith('#') || trimmed === '') {
      return line;
    }

    // Find the first '=' and take everything before it
    if (trimmed.includes('=')) {
      const key = trimmed.split('=')[0];
      return `${key}=`;
    }

    return line;
  });

  const finalContent = [
    `# RefearnApp Environment Variables Template`,
    `# Generated from .env.selfhosted on ${new Date().toLocaleDateString()}`,
    '',
    ...exampleLines
  ].join('\n');

  fs.writeFileSync(outputPath, finalContent);

  console.log('✅ Successfully synced .env.example from .env.selfhosted');
  console.log('💡 All values have been stripped for security.');
} catch (err) {
  console.error('❌ Error:', err.message);
}