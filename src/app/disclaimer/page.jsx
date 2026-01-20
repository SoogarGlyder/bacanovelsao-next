import React from 'react';
import Link from 'next/link';
import styles from '../styles/LandPages.module.css';

export const metadata = {
  title: 'Disclaimer & Catatan Penerjemah',
  description: 'Informasi hak cipta dan catatan mengenai terjemahan di linkstart.id',
};

export default function DisclaimerPage() {
  return (
      <div className={styles.container}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Disclaimer & Notes</h1>
          <p className={styles.subtitle}>
            Harap dibaca dengan seksama sebelum melanjutkan membaca.
          </p>
        </header>

        <div className={styles.alertBox}>
          <div className={styles.alertIcon}>⚠️</div>
          <div className={styles.alertContent}>
            <h3>Penafian Hak Cipta (Copyright Disclaimer)</h3>
            <p>
              <strong>linkstart.id</strong> adalah situs penggemar (Unofficial Fan Site). Kami tidak berafiliasi, didukung, atau disponsori oleh <strong>Reki Kawahara</strong>, <strong>ASCII Media Works</strong>, <strong>Kadokawa</strong>, atau pemegang lisensi resmi seri Sword Art Online lainnya.
            </p>
            <p className={styles.smallText}>
              Seluruh aset gambar, nama karakter, dan alur cerita adalah kekayaan intelektual (Intellectual Property) dari pemilik sah. Penggunaan materi tersebut di situs ini ditujukan semata-mata untuk tujuan pendidikan, hiburan penggemar, dan pelestarian budaya pop (Fair Use).
            </p>
          </div>
        </div>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Dukung Karya Asli</h3>
          <p>
            Keberadaan situs ini didasari oleh rasa cinta kami terhadap seri SAO. Namun, cara terbaik untuk memastikan kelanjutan cerita Kirito dan Asuna adalah dengan mendukung penciptanya secara finansial.
          </p>
          <div className={styles.quoteBox}>
            <p>
              "Jika novel resmi (Official Release) telah tersedia di negara atau bahasa Anda, kami sangat menyarankan Anda untuk membelinya."
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Catatan Penerjemah (Translator's Note)</h3>
          <p>
            Terjemahan yang Anda baca di sini dikerjakan dengan penuh dedikasi, namun kami menyadari bahwa kami bukanlah penerjemah profesional tersumpah.
          </p>
          <ul>
            <li>
              <strong>Lokalisasi:</strong> Kami mungkin mengubah sedikit struktur kalimat agar lebih mengalir dan enak dibaca dalam Bahasa Indonesia (tidak kaku/robotik), tanpa mengubah makna aslinya.
            </li>
            <li>
              <strong>Istilah Teknis:</strong> Istilah game (seperti <em>Switch</em>, <em>Parry</em>, <em>Sword Skill</em>) mungkin tetap dibiarkan dalam Bahasa Inggris atau Katakana untuk menjaga nuansa "MMORPG".
            </li>
            <li>
              <strong>Koreksi:</strong> Manusia tempatnya salah. Jika Anda menemukan kesalahan terjemahan fatal atau <em>typo</em> yang mengganggu, jangan ragu untuk memberitahu kami.
            </li>
          </ul>
        </section>

        <section className={styles.closing}>
          <p>
            Ada laporan pelanggaran atau kesalahan konten?
          </p>
          <Link href="/contact" className={styles.button}>
            Hubungi Kami
          </Link>
         </section>
      </div>
  );
}