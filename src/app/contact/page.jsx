import React from 'react';
import styles from '../styles/LandPages.module.css';

export const metadata = {
  title: 'Hubungi Kami',
  description: 'Hubungi tim linkstart.id untuk saran, laporan bug, atau kerjasama.',
};

export default function ContactPage() {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <h1 className={styles.title}>
          Hubungi <span className={styles.highlight}>linkstart.id</span>
        </h1>
        <p className={styles.subtitle}>
          Punya pertanyaan, saran, atau menemukan bug? Kami siap mendengar dari Anda.
        </p>
      </header>

      <div className={styles.gridContact}>
        <div className={styles.contactCard}>
          <div className={styles.iconWrapper}>
            📬
          </div>
          <h3>Email Support</h3>
          <p>Cara tercepat untuk menghubungi kami adalah melalui email. Kami berusaha membalas dalam 1x24 jam.</p>
          
          <div className={styles.emailBox}>
            <span className={styles.emailLabel}>Official Email:</span>
            <a href="mailto:admin@linkstart.id" className={styles.emailLink}>
              admin@linkstart.id
            </a>
          </div>
        </div>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Apa yang bisa kami bantu?</h3>
          <ul className={styles.topicList}>
            <li>
              <strong>🐞 Lapor Bug / Error</strong>
              <p>Jika ada chapter yang tidak bisa dibuka, gambar rusak, atau typo fatal.</p>
            </li>
            <li>
              <strong>📚 Request Novel</strong>
              <p>Punya saran novel seri SAO lain (seperti <em>Alternative GGO</em>) yang belum ada di sini?</p>
            </li>
            <li>
              <strong>©️ DMCA / Hak Cipta</strong>
              <p>Jika Anda pemegang hak cipta dan ingin mendiskusikan konten di situs ini.</p>
            </li>
            <li>
              <strong>🤝 Kerjasama</strong>
              <p>Untuk pertanyaan seputar promosi atau kerjasama lainnya.</p>
            </li>
          </ul>
        </section>

      </div>

      <div className={styles.faqSection}>
        <h3>Sering Ditanyakan (FAQ)</h3>
        <div className={styles.faqItem}>
          <h4>Apakah saya bisa menjadi kontributor/penerjemah?</h4>
          <p>Saat ini kami belum membuka lowongan umum, tapi jika Anda sangat berminat, silakan kirim portofolio terjemahan Anda ke email kami.</p>
        </div>
      </div>

    </div>
  );
}