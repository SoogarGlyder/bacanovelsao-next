import React from 'react';

export const metadata = {
  title: 'Admin Panel | Baca Novel SAO',
  description: 'Halaman dashboard untuk administrator.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}