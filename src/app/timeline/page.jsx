import React from 'react';
import Link from 'next/link';
import styles from './Timeline.module.css';

const TIMELINE_DATA = [
  {
    id: 1,
    date: "6 November 2022",
    event: "Hari Pertama di Aincrad",
    items: [
      {
        serie: "Sword Art Online 001: Aincrad I | Bagian 2",
        title: "Kirito menunjukkan kepada Klein dasar-dasar gim SAO.",
        url: "/aincrad-i/bagian-2", 
      },
      {
        serie: "Sword Art Online 001: Aincrad I | Bagian 3",
        title: "Pengenalan 'fitur' tidak bisa log out oleh Kayaba Akihiko. Lalu, Kirito berpisah dengan Klein.",
        url: "/aincrad-i/bagian-3",
      },
      {
        serie: "Sword Art Online 008: Early and Late | Hari Pertama",
        title: "Kirito menjalankan quest pertamanya dan bertemu dengan Coper, seorang beta tester.",
        url: "/early-late/hari-pertama",
      },
    ]
  },
  {
    id: 2,
    date: "7 November 2022",
    event: "Hari Kedua di Aincrad",
    items: [
      {
        serie: "Sword Art Online Progressive: The Next Day | Bagian 1",
        title: "Kirito bertemu Argo, seorang beta tester eksentrik yang menyebut dirinya sebagai makelar informasi.",
        url: "/progressive-the-next-day/bagian-1",
      },
      {
        serie: "Sword Art Online Progressive: The Next Day | Bagian 2",
        title: "Kirito membentuk party dengan Argo untuk menyelesaikan quest bersama.",
        url: "/progressive-the-next-day/bagian-2",
      },
            {
        serie: "Sword Art Online Progressive: The Next Day | Bagian 3",
        title: "Saat Kirito dan Argo menjalankan quest, ada sedikit plot twist yang terjadi.",
        url: "/progressive-the-next-day/bagian-3",
      },
            {
        serie: "Sword Art Online Progressive: The Next Day | Bagian 4",
        title: "Kirito dan Argo berhasil menyelesaikan quest dan akhirnya berpisah.",
        url: "/progressive-the-next-day/bagian-4",
      }
    ]
  },
  {
    id: 3,
    date: "13 November 2022",
    event: "Hari Ketujuh di Aincrad",
    items: [
      {
        serie: "Sword Art Online Progressive: The Seventh Day | Bagian 1",
        title: "Di hari ketujuh, Kirito mulai merasakan tekanan batin yang membuatnya tidak bisa tidur.",
        url: "/progressive-the-seventh-day/bagian-1",
      },
      {
        serie: "Sword Art Online Progressive: The Seventh Day | Bagian 2",
        title: "Mendengar rumor boss baru di gua, Kirito mencari info tentang kelemahannya.",
        url: "/progressive-the-seventh-day/bagian-2",
      },
      {
        serie: "Sword Art Online Progressive: The Seventh Day | Bagian 3",
        title: "Setelah mendapatkan informasi kunci dari NPC, Kirito bergegas ke gua.",
        url: "/progressive-the-seventh-day/bagian-3",
      },
      {
        serie: "Sword Art Online Progressive: The Seventh Day | Bagian 4",
        title: "Memanfaatkan informasi yang diberikan NPC, Kirito mencoba melawan boss gua.",
        url: "/progressive-the-seventh-day/bagian-4",
      },
      {
        serie: "Sword Art Online Progressive: The Seventh Day | Bagian 5",
        title: "Kirito berhasil mengalahkan boss gua dan siap untuk ke kota selanjutnya.",
        url: "/progressive-the-seventh-day/bagian-5",
      }
    ]
  }
];

export const metadata = {
  title: 'Timeline Kronologis',
  description: 'Urutan baca novel Sword Art Online berdasarkan waktu kejadian cerita.',
};

export default function TimelinePage() {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <h1 className={styles.title}>
          Timeline <span className={styles.highlight}>Kronologis</span>
        </h1>
        <p className={styles.subtitle}>
          Daftar kejadian Aincrad secara berurutan (Main Series + Progressive).
        </p>
      </header>
      
      {TIMELINE_DATA.map((block) => (
        <section key={block.id} className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.dateTitle}>{block.date}</h3>
            <span className={styles.eventDescription}>{block.event}</span>
          </div>
          <div className={styles.chapterList}>
            {block.items.map((item, index) => (
              <Link 
                key={index} 
                href={item.url} 
                className={styles.chapterItem}
              >
                <div className={styles.itemContent}>
                  <span className={styles.serieLabel}>{item.serie}</span>
                  <span className={styles.chapterTitle}>{item.title}</span>
                </div>
                <div className={styles.arrow}>›</div>
              </Link>
            ))}
          </div>

        </section>
      ))}

      <p style={{textAlign: 'center', marginTop: '3rem', opacity: 0.5, fontStyle: 'italic'}}>
        To be continued...
      </p>

    </div>
  );
}