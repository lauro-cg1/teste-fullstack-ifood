'use client';

import { useRouter } from 'next/navigation';
import { FiShoppingBag } from 'react-icons/fi';
import { usarCarrinho } from '../../hooks/usarCarrinho';
import { usarAutenticacao } from '../../hooks/usarAutenticacao';
import Botao from '../Botao/Botao';
import estilos from './Carrinho.module.css';

export default function Carrinho() {
  const { itens, restauranteAtual, subtotal, taxaEntrega, total, atualizarQuantidade, limparCarrinho } = usarCarrinho();
  const { estaAutenticado } = usarAutenticacao();
  const roteador = useRouter();

  const irParaCheckout = () => {
    if (!estaAutenticado) {
      roteador.push('/entrar');
      return;
    }
    roteador.push('/carrinho');
  };

  if (itens.length === 0) {
    return (
      <div className={estilos.carrinho}>
        <div className={estilos.cabecalho}>
          <h3>Sacola</h3>
        </div>
        <div className={estilos.vazio}>
          <div className={estilos.iconeVazio}><FiShoppingBag /></div>
          <p>Sua sacola está vazia</p>
          <p>Adicione itens para continuar</p>
        </div>
      </div>
    );
  }

  return (
    <div className={estilos.carrinho}>
      <div className={estilos.cabecalho}>
        <h3>Sacola</h3>
        <button className={estilos.botaoLimpar} onClick={limparCarrinho}>Limpar</button>
      </div>

      {restauranteAtual && (
        <div className={estilos.restauranteInfo}>
          Pedido em: <strong>{restauranteAtual.nome}</strong>
        </div>
      )}

      <div className={estilos.listaItens}>
        {itens.map(({ produto, quantidade }) => (
          <div key={produto.id} className={estilos.item}>
            <div className={estilos.itemInfo}>
              <p className={estilos.itemNome}>{produto.nome}</p>
              <p className={estilos.itemPreco}>
                R$ {(parseFloat(produto.preco_promocional || produto.preco) * quantidade).toFixed(2)}
              </p>
            </div>
            <div className={estilos.itemControles}>
              <button
                className={estilos.botaoQuantidade}
                onClick={() => atualizarQuantidade(produto.id, quantidade - 1)}
              >−</button>
              <span className={estilos.quantidade}>{quantidade}</span>
              <button
                className={estilos.botaoQuantidade}
                onClick={() => atualizarQuantidade(produto.id, quantidade + 1)}
              >+</button>
            </div>
          </div>
        ))}
      </div>

      <div className={estilos.resumo}>
        <div className={estilos.linhaResumo}>
          <span>Subtotal</span>
          <span>R$ {subtotal.toFixed(2)}</span>
        </div>
        <div className={estilos.linhaResumo}>
          <span>Entrega</span>
          <span>{taxaEntrega === 0 ? 'Grátis' : `R$ ${taxaEntrega.toFixed(2)}`}</span>
        </div>
        <div className={estilos.linhaTotal}>
          <span>Total</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
      </div>

      <div className={estilos.acoes}>
        <Botao cheio aoClicar={irParaCheckout}>
          {estaAutenticado ? 'Confirmar pedido' : 'Entrar para pedir'}
        </Botao>
      </div>
    </div>
  );
}
