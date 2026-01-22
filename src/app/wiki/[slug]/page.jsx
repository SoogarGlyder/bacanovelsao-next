import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { WIKI_DATA } from '@/data/wikiData'; 
import styles from './WikiDetail.module.css';
import WikiImageViewer from './WikiImageViewer';

const formatDescription = (text) => {
  if (!text) return null;
  return text.split('\n').map((paragraph, index) => (
    <p 
      key={index} 
      className={styles.descParagraph}
      dangerouslySetInnerHTML={{ __html: paragraph }}
    />
  ));
};

const formatInfoValue = (text) => {
  if (!text) return '-';
  return text.split('\n').map((line, idx) => (
    <div 
      key={idx}
      dangerouslySetInnerHTML={{ __html: line }}
    />
  ));
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = WIKI_DATA[slug];

  if (!data) {
    return { title: 'Halaman Tidak Ditemukan' };
  }

  const cleanDescription = data.description 
    ? data.description.replace(/<[^>]*>?/gm, '') 
    : 'Detail Karakter';

  return {
    title: `${data.name} | Wiki`,
    description: cleanDescription.substring(0, 160) + '...', 
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
    image: mainImage ? `https://linkstart.id${mainImage}` : undefined,
    url: `https://linkstart.id/wiki/${slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://linkstart.id/wiki/${slug}`
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

  const getAccentColor = () => {
    if (entry.type === 'guild') return '#ef4444'; // Merah
    if (entry.type === 'location') return '#10b981'; // Hijau
    return '#3b82f6'; // Biru (Default Character)
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
          <div className={styles.leftColumn}>
            <div style={{ width: '100%', marginBottom: '20px' }}>
              <WikiImageViewer 
                images={entry.images} 
                altText={entry.name} 
              />
            </div>
            {entry.info && (
              <div className={styles.infoBox}>
                <div 
                  className={styles.infoBoxHeader} 
                  style={{ backgroundColor: getAccentColor() }}
                >
                  Personal Information
                </div>
                <table className={styles.infoTable}>
                  <tbody>
                    {entry.info.map((item, idx) => (
                      <tr key={idx}>
                        <td className={styles.infoLabel}>{item.label}</td>
                        <td className={styles.infoValue}>
                          {formatInfoValue(item.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.descSection}>
               <h3 className={styles.sectionTitle}>Deskripsi</h3>
               <div className={styles.description}>
                  {formatDescription(entry.description)}
               </div>
            </div>
            {entry.stats && (
              <div className={styles.statsContainer}>
                <h3 className={styles.sectionTitle}>Game Stats</h3>
                <div className={styles.statsGrid}>
                  {entry.stats.map((stat, idx) => (
                    <div key={idx} className={styles.statItem}>
                      <span className={styles.statLabel}>{stat.label}</span>
                      <span className={styles.statValue}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {entry.appearances && entry.appearances.length > 0 && (
              <div className={styles.timelineSection}>
                <h3 className={styles.sectionTitle}>Kejadian</h3>
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