#!/usr/bin/env node
import { products } from '../src/data/products.js';

const REQUIRED_FIELDS = ['name', 'description', 'price', 'category', 'image'];
const BANNED_WORDS = [
  'delicious', 'tasty', 'mouthwatering', 'scrumptious', 'yummy', 'wooden table' // enforce literal neutrality
];

let errors = [];

products.forEach((p, idx) => {
  REQUIRED_FIELDS.forEach(f => {
    if (p[f] === undefined || p[f] === null || p[f] === '') {
      errors.push(`Product[${idx}] '${p.name || 'UNKNOWN'}' missing required field: ${f}`);
    }
  });
  if (typeof p.price !== 'number' || Number.isNaN(p.price) || p.price <= 0) {
    errors.push(`Product '${p.name}' has invalid price: ${p.price}`);
  }
  const descLower = p.description.toLowerCase();
  BANNED_WORDS.forEach(w => {
    if (descLower.includes(w)) {
      errors.push(`Product '${p.name}' description contains banned word/phrase: "${w}"`);
    }
  });
  // Ensure description stays literal: forbid 'best', 'premium', 'authentic'
  ['best', 'premium', 'authentic'].forEach(term => {
    if (descLower.includes(term)) {
      errors.push(`Product '${p.name}' description includes non-literal marketing term: "${term}"`);
    }
  });
});

const names = products.map(p => p.name);
const dupes = names.filter((n, i) => names.indexOf(n) !== i);
if (dupes.length) {
  errors.push(`Duplicate product names detected: ${[...new Set(dupes)].join(', ')}`);
}

if (errors.length) {
  console.error('\nProduct validation failed with the following issues:');
  errors.forEach(e => console.error(' -', e));
  process.exit(1);
} else {
  console.log(`Product validation passed. Total products: ${products.length}`);
}
