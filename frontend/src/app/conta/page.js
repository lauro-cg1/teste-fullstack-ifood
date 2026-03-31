'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { usarAutenticacao } from '../../hooks/usarAutenticacao';
import { AutenticacaoAPI } from '../../servicos/api';
import Botao from '../../componentes/Botao/Botao';
import CampoEntrada from '../../componentes/CampoEntrada/CampoEntrada';
import estilos from './page.module.css';

export default function PaginaConta() {
  const { usuario, estaAutenticado, carregando } = usarAutenticacao();
  const roteador = useRouter();

  const [form, setForm] = useState({ nome: '', email: '', telefone: '', endereco: '', senha: '' });
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!carregando && !estaAutenticado) {
      roteador.push('/entrar');
    }
  }, [estaAutenticado, carregando, roteador]);

  useEffect(() => {
    if (usuario) {
      setForm({
        nome: usuario.nome || '',
        email: usuario.email || '',
        telefone: usuario.telefone || '',
        endereco: usuario.endereco || '',
        senha: ''
      });
    }
  }, [usuario]);

  const aoAlterar = (e) => {
    const { name, value } = e.target;
    setForm((ant) => ({ ...ant, [name]: value }));
  };

  const aoSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const payload = { nome: form.nome, telefone: form.telefone, endereco: form.endereco };
      if (form.senha) payload.senha = form.senha;
      await AutenticacaoAPI.atualizarPerfil(payload);
      toast.success('Dados atualizados com sucesso!');
      setForm((ant) => ({ ...ant, senha: '' }));
    } catch (err) {
      toast.error(err.response?.data?.mensagem || 'Erro ao atualizar dados');
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <div className="pagina-carregando">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className={estilos.pagina}>
      <div className={estilos.container}>
        <div className={estilos.cabecalho}>
          <div className={estilos.avatar}>
            {usuario?.nome?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className={estilos.titulo}>Minha Conta</h1>
            <p className={estilos.subtitulo}>Gerencie seus dados pessoais</p>
          </div>
        </div>

        <form onSubmit={aoSalvar} className={estilos.formulario}>
          <div className={estilos.secao}>
            <h2 className={estilos.tituloSecao}>Dados Pessoais</h2>
            <div className={estilos.grade}>
              <CampoEntrada
                rotulo="Nome completo"
                nome="nome"
                valor={form.nome}
                aoMudar={aoAlterar}
                obrigatorio
              />
              <CampoEntrada
                rotulo="E-mail"
                nome="email"
                tipo="email"
                valor={form.email}
                aoMudar={aoAlterar}
                disabled
              />
              <CampoEntrada
                rotulo="Telefone"
                nome="telefone"
                valor={form.telefone}
                aoMudar={aoAlterar}
              />
              <CampoEntrada
                rotulo="Endereço"
                nome="endereco"
                valor={form.endereco}
                aoMudar={aoAlterar}
              />
            </div>
          </div>

          <div className={estilos.secao}>
            <h2 className={estilos.tituloSecao}>Alterar Senha</h2>
            <p className={estilos.descricaoSecao}>Deixe em branco para manter a senha atual</p>
            <div className={estilos.grade}>
              <CampoEntrada
                rotulo="Nova senha"
                nome="senha"
                tipo="password"
                valor={form.senha}
                aoMudar={aoAlterar}
                placeholder="Nova senha (opcional)"
              />
            </div>
          </div>

          <div className={estilos.acoes}>
            <Botao tipo="submit" desabilitado={salvando}>
              Salvar alterações
            </Botao>
          </div>
        </form>
      </div>
    </div>
  );
}
