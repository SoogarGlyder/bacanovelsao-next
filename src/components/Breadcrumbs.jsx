import React from 'react';
import Link from 'next/link';
// Import CSS Module yang baru dibuat
import styles from './Breadcrumbs.module.css'; 

function Breadcrumbs({ items }) {
  return (
    <nav aria-label="breadcrumb" className={styles.breadcrumbNav}>
      <ol className={styles.breadcrumbList}>
        
        {/* Item 1: Beranda */}
        <li>
          <Link href="/" className={styles.link}>
            Beranda
          </Link>
        </li>

        {/* Item Selanjutnya (Looping) */}
        {items.map((item, index) => (
          <li key={index} className={styles.listItem}>
            {/* Separator Panah */}
            <span className={styles.separator}>
                &rsaquo; 
            </span>

            {item.link ? (
              // Jika ada link, render sebagai Link biru
              <Link href={item.link} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              // Jika tidak ada link (halaman aktif), render teks biasa
              <span className={styles.activeItem}>
                {item.label}
              </span>
            )}
          </li>
        ))}

      </ol>
    </nav>
  );
}

export default Breadcrumbs;