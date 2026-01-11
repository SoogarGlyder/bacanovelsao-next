export const characters = {
  'kirito': {
    type: 'character',
    series: ['sao', 'alo', 'ggo', 'alicization'], 
    name: 'Kirigaya Kazuto',
    subtitle: 'The Black Swordsman (Beater)',
    images: [
      { label: 'SAO', url: '/images/wiki/kirito-sao.svg' }, 
      { label: 'ALO #1', url: '/images/wiki/kirito-alo-old.svg' },
      { label: 'ALO #2', url: '/images/wiki/kirito-alo-new.svg' },
      { label: 'GGO', url: '/images/wiki/kirito-ggo.svg' },
      { label: 'PA #1', url: '/images/wiki/kirito-pa.svg' }, 
      { label: 'PA #2', url: '/images/wiki/kirito-pa-valet.svg' },
      { label: 'PA #3', url: '/images/wiki/kirito-pa-elite.svg' },
      { label: 'PA #4', url: '/images/wiki/kirito-pa-offline.svg' },
    ],
    description: 'Pemain solo yang berjuang di garis depan Aincrad. Memiliki waktu reaksi tercepat di seluruh server, memberikannya hak unik untuk menggunakan skill "Dual Blades". Ia sering disalahpahami sebagai pemain yang egois, padahal ia hanya ingin melindungi orang lain dari beban berat.',
    stats: [
      { label: 'Level (End)', value: '96' },
      { label: 'Guild', value: 'Solo / KoB' },
      { label: 'Weapon', value: 'Elucidator & Dark Repulser' },
      { label: 'Skill Unik', value: 'Dual Blades' }
    ],
    appearances: [
      { title: 'Mendapatkan Elucidator (Drop Boss)', url: '#' },
      { title: 'Duel Melawan Heathcliff', url: '/sword-art-online-vol-1/chapter-16' },
      { title: 'Tragedi Sachi (Moonlit Black Cats)', url: '/sword-art-online-vol-2/red-nosed-reindeer' }
    ]
  },

  'asuna': {
    type: 'character',
    series: ['sao', 'alo', 'alicization'],
    name: 'Yuuki Asuna',
    subtitle: 'The Flash (Senkou)',
    images: [
      { label: 'SAO', url: '/images/wiki/asuna-sao.svg' },
      { label: 'ALO #1', url: '/images/wiki/asuna-alo-old.svg' },
      { label: 'ALO #2', url: '/images/wiki/asuna-alo-new.svg' },
      { label: 'PA', url: '/images/wiki/asuna-pa.svg' },      
    ],
    description: 'Sub-leader dari guild terkuat "Knights of the Blood". Dikenal dengan julukan "The Flash" karena kecepatan rapier-nya yang tak kasat mata. Awalnya hanya ingin menamatkan game secepat mungkin, hingga pertemuannya dengan Kirito mengubah pandangannya.',
    stats: [
      { label: 'Level (End)', value: '94' },
      { label: 'Guild', value: 'Knights of the Blood' },
      { label: 'Weapon', value: 'Lambent Light' },
      { label: 'Julukan', value: 'The Flash' }
    ],
    appearances: [
      { title: 'Pertemuan Lantai 1', url: '/sao-progressive-vol-1/chapter-1' },
      { title: 'Masakan Ragout Rabbit', url: '/sword-art-online-vol-1/chapter-9' }
    ]
  }
};