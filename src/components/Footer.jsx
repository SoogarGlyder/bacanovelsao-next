'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';

function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname === '/') {
    return null;
  }

  return (
      <footer className={styles.footer}>
        <div className={styles.copyright}>
          <p>&copy; {currentYear} BacaNovelSAO. Made with ❤ by SoogarGlyder.</p>
        </div>
      </footer>
  );
}

export default Footer;