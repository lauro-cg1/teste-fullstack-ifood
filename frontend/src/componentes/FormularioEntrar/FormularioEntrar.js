'use client';

import { useState } from 'react';
import Link from 'next/link';
import CampoEntrada from '../CampoEntrada/CampoEntrada';
import Botao from '../Botao/Botao';
import estilos from './FormularioEntrar.module.css';

export default function FormularioEntrar({ aoSubmeter, carregando }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const lidarSubmissao = async (e) => {
    e.preventDefault();
    setErro('');

    if (!email || !senha) {
      setErro('Preencha todos os campos');
      return;
    }

    try {
      await aoSubmeter(email, senha);
    } catch (err) {
      setErro(err.response?.data?.mensagem || 'Erro ao fazer login');
    }
  };

  return (
    <form className={estilos.formulario} onSubmit={lidarSubmissao}>
      <h2 className={estilos.titulo}>Entrar</h2>
      <p className={estilos.subtitulo}>Acesse sua conta do iFood Clone</p>

      {erro && <div className={estilos.erroGeral}>{erro}</div>}

      <div className={estilos.campos}>
        <CampoEntrada
          rotulo="E-mail"
          tipo="email"
          nome="email"
          placeholder="seu@email.com"
          valor={email}
          aoMudar={(e) => setEmail(e.target.value)}
          obrigatorio
        />
        <CampoEntrada
          rotulo="Senha"
          tipo="password"
          nome="senha"
          placeholder="Sua senha"
          valor={senha}
          aoMudar={(e) => setSenha(e.target.value)}
          obrigatorio
        />
      </div>

      <Botao tipo="submit" cheio desabilitado={carregando}>
        {carregando ? 'Entrando...' : 'Entrar'}
      </Botao>

      <p className={estilos.link}>
        Não tem conta? <Link href="/cadastrar">Criar conta</Link>
      </p>
    </form>
  );
}
