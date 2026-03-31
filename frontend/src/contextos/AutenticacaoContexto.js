'use client';

import { createContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { AutenticacaoAPI } from '../servicos/api';

export const AutenticacaoContexto = createContext({});

export function AutenticacaoProvedor({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const carregarUsuario = useCallback(async () => {
    try {
      const token = Cookies.get('token');
      if (token) {
        const resposta = await AutenticacaoAPI.perfil();
        setUsuario(resposta.data.dados);
      }
    } catch (erro) {
      Cookies.remove('token');
      setUsuario(null);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarUsuario();
  }, [carregarUsuario]);

  const entrar = async (email, senha) => {
    const resposta = await AutenticacaoAPI.entrar({ email, senha });
    const { usuario: dadosUsuario, token } = resposta.data.dados;
    Cookies.set('token', token, { expires: 7 });
    setUsuario(dadosUsuario);
    return dadosUsuario;
  };

  const cadastrar = async (dados) => {
    const resposta = await AutenticacaoAPI.cadastrar(dados);
    const { usuario: dadosUsuario, token } = resposta.data.dados;
    Cookies.set('token', token, { expires: 7 });
    setUsuario(dadosUsuario);
    return dadosUsuario;
  };

  const sair = () => {
    Cookies.remove('token');
    setUsuario(null);
  };

  const estaAutenticado = !!usuario;

  return (
    <AutenticacaoContexto.Provider value={{
      usuario,
      carregando,
      estaAutenticado,
      entrar,
      cadastrar,
      sair
    }}>
      {children}
    </AutenticacaoContexto.Provider>
  );
}
