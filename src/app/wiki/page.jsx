import React from 'react';
import { WIKI_DATA } from '@/data/wikiData';
import styles from './WikiIndex.module.css';
import WikiList from './WikiList';

export const metadata = {
  title: 'Database & Ensiklopedia SAO | BacaNovelSAO',
  description: 'Kumpulan biodata karakter, guild, dan lokasi penting di dunia Sword Art Online.',
};

export default function WikiIndexPage() {
  const wikiList = Object.entries(WIKI_DATA);

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <h1 className={styles.title}>DATABASE <span className={styles.highlight}>SAO</span></h1>
        <p className={styles.subtitle}>
          Arsip lengkap karakter, guild, dan dunia Aincrad.
        </p>
      </header>
      <WikiList allData={wikiList} />
      
    </div>
  );
}