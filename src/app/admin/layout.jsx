import React from 'react';

export const metadata = {
  title: 'Admin Panel | linkstart.id',
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