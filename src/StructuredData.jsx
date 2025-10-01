import React from 'react';
import { products } from './data/products.js';

// Inject combined JSON-LD: ItemList + individual Product nodes via @graph.
// Rationale: ItemList gives ordering context, separate Product nodes may enable richer product rich results.
export const StructuredData = () => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const orgNode = {
    '@type': 'Organization',
    '@id': baseUrl ? `${baseUrl}/#org` : '#org',
    'name': 'VIP Coffee',
    'url': baseUrl || undefined,
    'logo': baseUrl ? `${baseUrl}/favicon.svg` : undefined
  };

  const productNodes = products.map((p, idx) => {
    const id = `${baseUrl}/#product-${encodeURIComponent(p.name.replace(/\s+/g,'-').toLowerCase())}`;
    const image = p.image || undefined;
    return {
      '@type': 'Product',
      '@id': id,
      'name': p.name,
      'description': p.description,
      ...(image ? { image } : {}),
      'brand': { '@id': orgNode['@id'] },
      'offers': {
        '@type': 'Offer',
        'price': p.price,
        'priceCurrency': 'ETB',
        'availability': 'https://schema.org/InStock'
      }
    };
  });

  const itemList = {
    '@type': 'ItemList',
    'name': 'VIP Coffee Menu',
    'itemListElement': productNodes.map((node, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'item': { '@id': node['@id'] }
    }))
  };

  const graph = [ orgNode, itemList, ...productNodes ];
  const doc = { '@context': 'https://schema.org', '@graph': graph };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(doc) }} />;
};

export default StructuredData;