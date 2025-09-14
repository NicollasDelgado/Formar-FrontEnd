import React from 'react';
import { FaCarSide } from 'react-icons/fa';

export const StatusIndicator: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {/* Círculo amarelo com ícone de carro */}
      <div
        style={{
          backgroundColor: '#F4C430', // amarelo
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FaCarSide style={{ color: '#000', fontSize: '20px' }} />
      </div>

      {/* Barra azul clara */}
      <div
        style={{
          backgroundColor: '#90E0FF',
          width: '11px',
          height: '30px',
          borderRadius: '6px',
        }}
      />

      {/* Barra rosa */}
      <div
        style={{
          backgroundColor: '#EC7FA8',
          width: '11px',
          height: '20px',
          borderRadius: '6px',
        }}
      />
    </div>
  );
};

export default StatusIndicator;