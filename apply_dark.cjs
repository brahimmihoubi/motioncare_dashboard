const fs = require('fs');
const path = require('path');

const dir = '/home/barhoum/motioncare_dashboard/src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const replacements = [
  { search: /\bbg-white(?! dark:bg-slate-800)\b/g, replace: 'bg-white dark:bg-slate-800' },
  { search: /\bborder-slate-100(?! dark:border-slate-700)\b/g, replace: 'border-slate-100 dark:border-slate-700' },
  { search: /\bborder-slate-200(?! dark:border-slate-600)\b/g, replace: 'border-slate-200 dark:border-slate-600' },
  { search: /\btext-slate-800(?! dark:text-slate-100)\b/g, replace: 'text-slate-800 dark:text-slate-100' },
  { search: /\btext-slate-900(?! dark:text-white)\b/g, replace: 'text-slate-900 dark:text-white' },
  { search: /\btext-slate-700(?! dark:text-slate-200)\b/g, replace: 'text-slate-700 dark:text-slate-200' },
  { search: /\btext-slate-600(?! dark:text-slate-300)\b/g, replace: 'text-slate-600 dark:text-slate-300' },
  { search: /\btext-slate-500(?! dark:text-slate-400)\b/g, replace: 'text-slate-500 dark:text-slate-400' },
  { search: /\bbg-slate-50(?![\/\w]| dark:bg-slate-700\/50)\b/g, replace: 'bg-slate-50 dark:bg-slate-700/50' },
  { search: /\bhover:bg-slate-50\b(?! dark:hover:bg-slate-700)/g, replace: 'hover:bg-slate-50 dark:hover:bg-slate-700' },
  { search: /\bbg-slate-100\b(?! dark:bg-slate-700)/g, replace: 'bg-slate-100 dark:bg-slate-700' },
];

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  for (const { search, replace } of replacements) {
    content = content.replace(search, replace);
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
}
