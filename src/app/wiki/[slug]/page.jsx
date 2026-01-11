import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { WIKI_DATA } from '@/data/wikiData'; 
import styles from './WikiDetail.module.css';
import WikiImageViewer from './WikiImageViewer';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = WIKI_DATA[slug];

  if (!data) {
    return { title: 'Halaman Tidak Ditemukan' };
  }

  return {
    title: `${data.name} | Wiki BacaNovelSAO`,
    description: data.description.substring(0, 160) + '...', 
  };
}

export default async function WikiDetailPage({ params }) {
  
  const { slug } = await params;
  const entry = WIKI_DATA[slug];

  if (!entry) {
    return notFound();
  }

  const mainImage = entry.images && entry.images.length > 0 ? entry.images[0].url : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': entry.type === 'character' ? 'Person' : 
             entry.type === 'guild' ? 'Organization' : 'Place',
    name: entry.name,
    description: entry.description,
    image: mainImage ? `https://bacanovelsao.vercel.app${mainImage}` : undefined,
    url: `https://bacanovelsao.vercel.app/wiki/${slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://bacanovelsao.vercel.app/wiki/${slug}`
    }
  };
  
  const jsonLdScript = (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
  
  const getThemeClass = (type) => {
    if (type === 'guild') return styles.themeGuild;       
    if (type === 'location') return styles.themeLocation; 
    return styles.themeCharacter;                         
  };

  return (
    <div className={styles.container}>
      {jsonLdScript}
      
      <Link href="/wiki" className={styles.backLink}>
        &larr; Kembali ke Database
      </Link>

      <div className={styles.card}>
        
        <div className={`${styles.header} ${getThemeClass(entry.type)}`}>
          <span className={styles.typeBadge}>{entry.type}</span>
          <h1 className={styles.name}>{entry.name}</h1>
          <p className={styles.subtitle}>{entry.subtitle}</p>
        </div>

        <div className={styles.body}>
          <div style={{ width: '100%' }}>
            <WikiImageViewer 
              images={entry.images} 
              altText={entry.name} 
            />
          </div>
          <div className={styles.infoSection}>
            <p className={styles.description}>
              {entry.description}
            </p>

            <div className={styles.statsGrid}>
              {entry.stats && entry.stats.map((stat, idx) => (
                <div key={idx} className={styles.statItem}>
                  <span className={styles.statLabel}>{stat.label}</span>
                  <span className={styles.statValue}>{stat.value}</span>
                </div>
              ))}
            </div>

            {entry.appearances && entry.appearances.length > 0 && (
              <div className={styles.timelineSection}>
                <div className={styles.timelineTitle}>
                  ⚡ Kemunculan / Referensi Timeline
                </div>
                <ul className={styles.timelineList}>
                  {entry.appearances.map((item, idx) => (
                    <li key={idx}>
                      <Link href={item.url} className={styles.timelineLink}>
                        📖 {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>

    </div>
  );
}