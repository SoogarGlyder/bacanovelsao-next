import React from 'react';
import Link from 'next/link'; // Ganti library Link

function Breadcrumbs({ items }) {
  return (
    <nav aria-label="breadcrumb" style={{ marginLeft: '3px', marginBottom: '5px', fontSize: '0.9em', color: '#666' }}>
      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap' }}>
        
        <li>
          {/* Ganti to="/" menjadi href="/" */}
          <Link href="/" style={{ textDecoration: 'none', color: '#38b6ff' }}>Beranda</Link>
        </li>

        {items.map((item, index) => (
          <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ margin: '0 8px', color: '#ccc', fontSize: '1.2em', lineHeight: '1' }}>
                &rsaquo; 
            </span>
            {item.link ? (
              // Ganti to={item.link} menjadi href={item.link}
              <Link href={item.link} style={{ textDecoration: 'none', color: '#38b6ff' }}>
                {item.label}
              </Link>
            ) : (
              <span style={{ color: '#333', fontWeight: '500' }}>
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