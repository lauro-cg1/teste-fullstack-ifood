'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { usarAutenticacao } from '../../hooks/usarAutenticacao';
import FormularioEntrar from '../../componentes/FormularioEntrar/FormularioEntrar';
import estilos from './page.module.css';

export default function PaginaEntrar() {
  const [carregando, setCarregando] = useState(false);
  const { entrar } = usarAutenticacao();
  const roteador = useRouter();

  const aoSubmeter = async (email, senha) => {
    setCarregando(true);
    try {
      await entrar(email, senha);
      toast.success('Login realizado com sucesso!');
      roteador.push('/');
    } catch (erro) {
      throw erro;
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={estilos.paginaAuth}>
      <FormularioEntrar aoSubmeter={aoSubmeter} carregando={carregando} />
    </div>
  );
}
