'use client';

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="btn-primary" 
      style={{
        background: 'var(--primary)', 
        color: 'white', 
        border: 'none', 
        padding: '1rem 2rem', 
        borderRadius: '10px', 
        cursor: 'pointer', 
        fontSize: '1.1rem', 
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
    >
      <span>🖨️</span> طباعة الآن
    </button>
  );
}
