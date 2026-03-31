'use client';

import { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import estilos from './BarraBusca.module.css';

export default function BarraBusca({ aoBuscar, placeholder }) {
  const [termo, setTermo] = useState('');

  const aoSubmeter = (e) => {
    e.preventDefault();
    if (aoBuscar && termo.trim()) {
      aoBuscar(termo.trim());
    }
  };

  const limpar = () => {
    setTermo('');
    if (aoBuscar) aoBuscar('');
  };

  return (
    <form className={estilos.barraBusca} onSubmit={aoSubmeter}>
      <FiSearch size={20} className={estilos.icone} />
      <input
        type="text"
        className={estilos.inputBusca}
        placeholder={placeholder || 'Busque por item ou loja'}
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
      />
      {termo && (
        <button type="button" className={estilos.botaoLimpar} onClick={limpar}>
          <FiX size={18} />
        </button>
      )}
    </form>
  );
}
