'use client';

import { useContext } from 'react';
import { AutenticacaoContexto } from '../contextos/AutenticacaoContexto';

export function usarAutenticacao() {
  const contexto = useContext(AutenticacaoContexto);
  if (!contexto) {
    throw new Error('usarAutenticacao deve ser usado dentro de AutenticacaoProvedor');
  }
  return contexto;
}
