'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiLogOut, FiFileText, FiSettings } from 'react-icons/fi';
import { usarAutenticacao } from '../../hooks/usarAutenticacao';
import { usarCarrinho } from '../../hooks/usarCarrinho';
import estilos from './Cabecalho.module.css';

export default function Cabecalho() {
  const { usuario, estaAutenticado, sair } = usarAutenticacao();
  const { totalItens } = usarCarrinho();
  const [menuAberto, setMenuAberto] = useState(false);
  const roteador = useRouter();

  const aoSair = () => {
    sair();
    roteador.push('/');
  };

  return (
    <header className={estilos.cabecalho}>
      <div className={estilos.cabecalhoConteudo}>
        <Link href="/" className={estilos.logo}>
          <svg viewBox="0 0 200 200" fill="currentColor">
            <circle cx="100" cy="100" r="90" fill="#ea1d2c"/>
            <text x="100" y="130" textAnchor="middle" fill="white" fontSize="100" fontWeight="bold">iF</text>
          </svg>
          iFood
        </Link>

        <nav className={estilos.navegacao}>
          <Link href="/" className={estilos.linkNav}>Início</Link>
          {estaAutenticado && (
            <Link href="/pedidos" className={estilos.linkNav}>
              <FiFileText size={16} /> Pedidos
            </Link>
          )}
          {estaAutenticado && (
            <Link href="/conta" className={estilos.linkNav}>
              <FiUser size={16} /> Minha Conta
            </Link>
          )}
          {estaAutenticado && usuario?.admin && (
            <Link href="/admin" className={estilos.linkNav}>
              <FiSettings size={16} /> Admin
            </Link>
          )}
          <Link href="/carrinho" className={estilos.botaoCarrinho}>
            <FiShoppingBag size={18} />
            Sacola
            {totalItens > 0 && (
              <span className={estilos.badgeCarrinho}>{totalItens}</span>
            )}
          </Link>
        </nav>

        {estaAutenticado ? (
          <div className={estilos.usuarioMenu}>
            <FiUser size={18} />
            <span className={estilos.nomeUsuario}>{usuario?.nome?.split(' ')[0]}</span>
            <button onClick={aoSair} className={estilos.botaoSair}>
              <FiLogOut size={16} />
            </button>
          </div>
        ) : (
          <div className={estilos.botoesAuth}>
            <Link href="/entrar">
              <button className={estilos.botaoEntrar}>Entrar</button>
            </Link>
            <Link href="/cadastrar">
              <button className={estilos.botaoCadastrar}>Criar conta</button>
            </Link>
          </div>
        )}

        <button
          className={estilos.menuMobile}
          onClick={() => setMenuAberto(!menuAberto)}
        >
          {menuAberto ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <div className={menuAberto ? estilos.menuMobileConteudo : estilos.menuMobileConteudoOculto}>
        <Link href="/" onClick={() => setMenuAberto(false)}>Início</Link>
        {estaAutenticado && (
          <Link href="/pedidos" onClick={() => setMenuAberto(false)}>
            <FiFileText size={16} /> Pedidos
          </Link>
        )}
        {estaAutenticado && (
          <Link href="/conta" onClick={() => setMenuAberto(false)}>
            <FiUser size={16} /> Minha Conta
          </Link>
        )}
        {estaAutenticado && usuario?.admin && (
          <Link href="/admin" onClick={() => setMenuAberto(false)}>
            <FiSettings size={16} /> Admin
          </Link>
        )}
        <Link href="/carrinho" onClick={() => setMenuAberto(false)}>
          <FiShoppingBag size={16} /> Sacola
          {totalItens > 0 && <span className={estilos.badgeCarrinho}>{totalItens}</span>}
        </Link>
        {!estaAutenticado && (
          <>
            <Link href="/entrar" onClick={() => setMenuAberto(false)}>Entrar</Link>
            <Link href="/cadastrar" onClick={() => setMenuAberto(false)}>Criar conta</Link>
          </>
        )}
        {estaAutenticado && (
          <button onClick={() => { aoSair(); setMenuAberto(false); }}>
            <FiLogOut size={16} /> Sair
          </button>
        )}
      </div>
    </header>
  );
}
