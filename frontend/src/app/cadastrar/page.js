'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { usarAutenticacao } from '../../hooks/usarAutenticacao';
import CampoEntrada from '../../componentes/CampoEntrada/CampoEntrada';
import Botao from '../../componentes/Botao/Botao';
import estilos from '../entrar/page.module.css';
import formEstilos from '../../componentes/FormularioEntrar/FormularioEntrar.module.css';

export default function PaginaCadastrar() {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [dados, setDados] = useState({ nome: '', email: '', senha: '', telefone: '', endereco: '' });
  const { cadastrar } = usarAutenticacao();
  const roteador = useRouter();

  const aoMudar = (e) => {
    setDados(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const aoSubmeter = async (e) => {
    e.preventDefault();
    setErro('');

    if (dados.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setCarregando(true);
    try {
      await cadastrar(dados);
      toast.success('Conta criada com sucesso!');
      roteador.push('/');
    } catch (err) {
      setErro(err.response?.data?.mensagem || 'Erro ao criar conta');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={estilos.paginaAuth}>
      <form className={formEstilos.formulario} onSubmit={aoSubmeter}>
        <h2 className={formEstilos.titulo}>Criar conta</h2>
        <p className={formEstilos.subtitulo}>Cadastre-se no iFood Clone</p>

        {erro && <div className={formEstilos.erroGeral}>{erro}</div>}

        <div className={formEstilos.campos}>
          <CampoEntrada rotulo="Nome completo" nome="nome" placeholder="Seu nome" valor={dados.nome} aoMudar={aoMudar} obrigatorio />
          <CampoEntrada rotulo="E-mail" tipo="email" nome="email" placeholder="seu@email.com" valor={dados.email} aoMudar={aoMudar} obrigatorio />
          <CampoEntrada rotulo="Senha" tipo="password" nome="senha" placeholder="Mínimo 6 caracteres" valor={dados.senha} aoMudar={aoMudar} obrigatorio />
          <CampoEntrada rotulo="Telefone" nome="telefone" placeholder="(11) 99999-9999" valor={dados.telefone} aoMudar={aoMudar} obrigatorio />
          <CampoEntrada rotulo="Endereço" nome="endereco" placeholder="Rua, número, bairro, cidade" valor={dados.endereco} aoMudar={aoMudar} />
        </div>

        <Botao tipo="submit" cheio desabilitado={carregando}>
          {carregando ? 'Criando conta...' : 'Criar conta'}
        </Botao>

        <p className={formEstilos.link}>
          Já tem conta? <Link href="/entrar">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
