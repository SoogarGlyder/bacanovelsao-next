import React from 'react';
import Link from 'next/link';
import styles from '../styles/LandPages.module.css';

export const metadata = {
  title: 'Tentang Kami',
  description: 'Platform baca novel Sword Art Online terbaik dengan pengalaman antarmuka modern.',
};

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <h1 className={styles.title}>
          Tentang <span className={styles.highlight}>linkstart.id</span>
        </h1>
        <p className={styles.subtitle}>
          Membawa dunia Aincrad, ALfheim, Gun Gale, Underworld, dan Unital Ring ke dalam genggaman Anda.
        </p>
      </header>
      
      <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Siapa Kami?</h3>
          <p>
            <strong>linkstart.id</strong> lahir dari keinginan sederhana: menciptakan tempat membaca novel <em>Sword Art Online</em> yang nyaman, cepat, dan modern.
            <br />
            Kami menyadari betapa sulitnya menemukan terjemahan yang rapi dengan tampilan yang enak dipandang mata. Oleh karena itu, website ini dibangun dengan fokus pada <strong>User Experience</strong>. Tidak ada iklan popup yang mengganggu, navigasi yang membingungkan, atau teks yang sulit dibaca.
          </p>
      </section>

      <section className={styles.features}>
        <h3 className={styles.sectionTitle}>Kenapa Membaca di Sini?</h3>
        <div className={styles.gridFeature}>
          <div className={styles.featureItem}>
            <div className={styles.iconWrapper}>⚡</div>
            <h4>Super Cepat</h4>
            <p>Dibangun dengan teknologi terbaru, halaman dimuat dalam hitungan milidetik.</p>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.iconWrapper}>🌙</div>
            <h4>Mode Gelap</h4>
            <p>Otomatis menyesuaikan dengan preferensi mata Anda. Baca malam hari tanpa silau.</p>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.iconWrapper}>📱</div>
            <h4>Responsif</h4>
            <p>Tampilan optimal di Laptop, Tablet, maupun Smartphone. Baca di mana saja.</p>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.iconWrapper}>Aa</div>
            <h4>Font Size</h4>
            <p>Ukuran font yang bisa diatur menjadi lebih besar atau kecil sesuai kebutuhan anda.</p>
          </div>
        </div>
      </section>

      <section className={styles.closing}>
        <p>
          Terima kasih telah menjadi bagian dari perjalanan ini. 
          <br />
          <em>Link Start!</em>
        </p>
        <Link href="/contact" className={styles.button}>
          Hubungi Kami
        </Link>
      </section>

    </div>
  );
}