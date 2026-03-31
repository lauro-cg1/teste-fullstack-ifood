'use client';

import { useContext } from 'react';
import { CarrinhoContexto } from '../contextos/CarrinhoContexto';

export function usarCarrinho() {
  const contexto = useContext(CarrinhoContexto);
  if (!contexto) {
    throw new Error('usarCarrinho deve ser usado dentro de CarrinhoProvedor');
  }
  return contexto;
}
