'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiShoppingBag, FiCreditCard, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { PedidoAPI } from '../../servicos/api';
import { usarCarrinho } from '../../hooks/usarCarrinho';
import { usarAutenticacao } from '../../hooks/usarAutenticacao';
import Botao from '../../componentes/Botao/Botao';
import CampoEntrada from '../../componentes/CampoEntrada/CampoEntrada';
import estilos from './page.module.css';

const FORMAS_PAGAMENTO = [
  { valor: 'pix', rotulo: 'PIX', icone: '💲' },
  { valor: 'cartao_credito', rotulo: 'Crédito', icone: '💳' },
  { valor: 'cartao_debito', rotulo: 'Débito', icone: '💳' },
  { valor: 'dinheiro', rotulo: 'Dinheiro', icone: '💵' }
];

export default function PaginaCarrinho() {
  const { itens, restauranteAtual, subtotal, taxaEntrega, total, limparCarrinho, atualizarQuantidade } = usarCarrinho();
  const { usuario, estaAutenticado } = usarAutenticacao();
  const [formaPagamento, setFormaPagamento] = useState('pix');
  const [endereco, setEndereco] = useState(usuario?.endereco || '');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const roteador = useRouter();

  if (!estaAutenticado) {
    return (
      <div className={estilos.pagina}>
        <div className={estilos.carrinhoVazio}>
          <div className={estilos.iconeVazio}>🔐</div>
          <h3>Faça login para continuar</h3>
          <p>Você precisa estar logado para finalizar o pedido</p>
          <Link href="/entrar">
            <Botao>Entrar</Botao>
          </Link>
        </div>
      </div>
    );
  }

  if (itens.length === 0) {
    return (
      <div className={estilos.pagina}>
        <div className={estilos.carrinhoVazio}>
          <div className={estilos.iconeVazio}><FiShoppingBag /></div>
          <h3>Sua sacola está vazia</h3>
          <p>Adicione itens de algum restaurante</p>
          <Link href="/">
            <Botao>Ver restaurantes</Botao>
          </Link>
        </div>
      </div>
    );
  }

  const confirmarPedido = async () => {
    if (!endereco.trim()) {
      setErro('Informe o endereço de entrega');
      return;
    }

    setErro('');
    setCarregando(true);

    try {
      const dadosPedido = {
        restaurante_id: restauranteAtual.id,
        endereco_entrega: endereco,
        forma_pagamento: formaPagamento,
        itens: itens.map(({ produto, quantidade }) => ({
          produto_id: produto.id,
          quantidade
        }))
      };

      const resposta = await PedidoAPI.criar(dadosPedido);
      limparCarrinho();
      toast.success('Pedido realizado com sucesso! 🎉');
      roteador.push(`/pedidos`);
    } catch (err) {
      setErro(err.response?.data?.mensagem || 'Erro ao confirmar pedido');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={estilos.pagina}>
      <h1 className={estilos.titulo}>Finalizar Pedido</h1>

      <div className={estilos.secao}>
        <h3>Itens do pedido</h3>
        {itens.map(({ produto, quantidade }) => (
          <div key={produto.id} className={estilos.itemResumo}>
            <span>{quantidade}x {produto.nome}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--cinza-500)', fontSize: '0.875rem' }}>
                R$ {(parseFloat(produto.preco_promocional || produto.preco) * quantidade).toFixed(2)}
              </span>
              <button
                onClick={() => atualizarQuantidade(produto.id, quantidade - 1)}
                style={{ color: 'var(--vermelho-principal)', fontSize: '1rem', background: 'none' }}
              >×</button>
            </div>
          </div>
        ))}
      </div>

      <div className={estilos.secao}>
        <h3>Endereço de entrega</h3>
        <CampoEntrada
          nome="endereco"
          placeholder="Rua, número, bairro, cidade"
          valor={endereco}
          aoMudar={(e) => setEndereco(e.target.value)}
        />
      </div>

      <div className={estilos.secao}>
        <h3>Forma de pagamento</h3>
        <div className={estilos.formaPagamento}>
          {FORMAS_PAGAMENTO.map((forma) => (
            <button
              key={forma.valor}
              className={`${estilos.opcaoPagamento} ${formaPagamento === forma.valor ? estilos.opcaoPagamentoSelecionada : ''}`}
              onClick={() => setFormaPagamento(forma.valor)}
            >
              <span style={{ fontSize: '1.5rem' }}>{forma.icone}</span>
              {forma.rotulo}
            </button>
          ))}
        </div>
      </div>

      <div className={estilos.secao}>
        <h3>Resumo</h3>
        <div className={estilos.itemResumo}>
          <span>Subtotal</span>
          <span>R$ {subtotal.toFixed(2)}</span>
        </div>
        <div className={estilos.itemResumo}>
          <span>Taxa de entrega</span>
          <span>{taxaEntrega === 0 ? 'Grátis' : `R$ ${taxaEntrega.toFixed(2)}`}</span>
        </div>
        <div className={estilos.linhaTotalFinal}>
          <span>Total</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
      </div>

      {erro && <div className={estilos.erro}>{erro}</div>}

      <Botao cheio tamanho="grande" aoClicar={confirmarPedido} desabilitado={carregando}>
        {carregando ? 'Confirmando...' : `Confirmar Pedido • R$ ${total.toFixed(2)}`}
      </Botao>
    </div>
  );
}
