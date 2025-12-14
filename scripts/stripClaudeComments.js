/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

function isClaudeComment(line) {
  return /^\/\/\s*([\w./-]+\.(js|ts|tsx|jsx))$/.test(line);
}

function stripClaude(filename) {
  if (!fs.existsSync(filename)) return;

  const content = fs.readFileSync(filename, 'utf8');
  const lines = content.split('\n');

  const first = lines[0]?.trim();
  if (!first?.startsWith('//') || !isClaudeComment(first)) return;

  const updated = lines.slice(1).join('\n');
  fs.writeFileSync(filename, updated, 'utf8');

  console.log(`Removed Claude header from: ${filename}`);
}

// lint-staged passes ONLY touched files as arguments
const files = process.argv.slice(2);
files.forEach(stripClaude);
