#!/usr/bin/env node
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve('dist');
const WARN_JS = 180 * 1024; // 180 KB
const WARN_IMG = 300 * 1024; // 300 KB

function format(bytes){
  const units = ['B','KB','MB'];
  let i=0, b=bytes;
  while (b >= 1024 && i < units.length -1){ b/=1024; i++; }
  return `${b.toFixed(1)} ${units[i]}`;
}

async function walk(dir){
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes:true })){
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}

(async () => {
  try {
    const files = await walk(DIST);
    let total = 0;
    const rows = [];
    for (const f of files){
      const st = await stat(f);
      total += st.size;
      const rel = path.relative(DIST, f).replace(/\\/g,'/');
      const ext = path.extname(rel).toLowerCase();
      let warn = '';
      if (['.js','.mjs'].includes(ext) && st.size > WARN_JS) warn = ' JS>180KB';
      if (['.jpg','.jpeg','.png','.webp','.avif','.gif'].includes(ext) && st.size > WARN_IMG) warn = ' IMG>300KB';
      rows.push({ rel, size: st.size, warn });
    }

    rows.sort((a,b)=> b.size - a.size);
    console.log('Dist Asset Size Report');
    console.log('----------------------');
    for (const r of rows){
      console.log(`${format(r.size).padStart(10)}  ${r.rel}${r.warn ? '  <<'+r.warn : ''}`);
    }
    console.log('----------------------');
    console.log('Total:', format(total));
    const big = rows.filter(r => r.warn);
    if (big.length){
      console.log(`\nWarnings (${big.length}):`);
      big.forEach(r => console.log(' -', r.rel, r.warn));
      process.exitCode = 0; // do not fail build yet; could change to non-zero to enforce
    }
  } catch (e){
    console.error('Failed to audit dist:', e.message);
    process.exit(1);
  }
})();
