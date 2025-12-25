'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';

function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        <div className={styles.brandColumn}>
          <h3 className={styles.brandName}>BacaNovelSAO</h3>
          <p className={styles.brandDesc}>
            Platform baca novel Sword Art Online (SAO) Bahasa Indonesia. 
            Dibuat oleh penggemar, untuk penggemar.
          </p>
        </div>

        <div className={styles.linkColumn}>
          <h4 className={styles.columnTitle}>Menu</h4>
          <ul className={styles.linkList}>
            <li><Link href="/">Beranda</Link></li>
          </ul>
        </div>

        <div className={styles.linkColumn}>
          <h4 className={styles.columnTitle}>Informasi</h4>
          <ul className={styles.linkList}>
            <li><Link href="/about">Tentang Kami</Link></li>
            <li><Link href="/contact">Hubungi Kami</Link></li>
            <li><Link href="/privacy">Kebijakan Privasi</Link></li>
            <li><Link href="/disclaimer">Disclaimer</Link></li>
          </ul>
        </div>

      </div>

      <div className={styles.bottomBar}>
        <p>
          &copy; {currentYear} BacaNovelSAO. <span className={styles.hiddenMobile}>All rights reserved.</span>
        </p>
        <p className={styles.maker}>
          Made with <span style={{color: '#e25555'}}>❤</span> by SoogarGlyder
        </p>
      </div>
    </footer>
  );
}

export default Footer;