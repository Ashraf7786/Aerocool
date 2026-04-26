const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const srcDir = path.resolve(__dirname, 'src');
const files = walk(srcDir);

const replacements = [
  { search: /from ["']\.\.\/services\//g, replace: 'from "@/services/' },
  { search: /from ["']\.\.\/lib\//g, replace: 'from "@/lib/' },
  { search: /from ["']\.\.\/utils\//g, replace: 'from "@/utils/' },
  { search: /from ["']\.\.\/context\//g, replace: 'from "@/context/' },
  { search: /from ["']\.\.\/assets\//g, replace: 'from "@/assets/' },
  { search: /from ["']\.\.\/components\//g, replace: 'from "@/components/' },
  
  // Also handle single dot if they were in the same folder but now moved
  { search: /from ["']\.\/services\//g, replace: 'from "@/services/' },
  { search: /from ["']\.\/lib\//g, replace: 'from "@/lib/' },
  { search: /from ["']\.\/utils\//g, replace: 'from "@/utils/' },
  { search: /from ["']\.\/context\//g, replace: 'from "@/context/' },
  { search: /from ["']\.\/assets\//g, replace: 'from "@/assets/' },
];

files.forEach(file => {
  if (!file.endsWith('.js') && !file.endsWith('.jsx') && !file.endsWith('.ts') && !file.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  replacements.forEach(r => {
    content = content.replace(r.search, r.replace);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated imports in: ${file}`);
  }
});
