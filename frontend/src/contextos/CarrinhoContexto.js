'use client';

import { createContext, useState, useCallback, useEffect } from 'react';

export const CarrinhoContexto = createContext({});

const CHAVE_STORAGE = 'ifood_clone_carrinho';

export function CarrinhoProvedor({ children }) {
  const [itens, setItens] = useState([]);
  const [restauranteAtual, setRestauranteAtual] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const carrinhoSalvo = localStorage.getItem(CHAVE_STORAGE);
      if (carrinhoSalvo) {
        const dados = JSON.parse(carrinhoSalvo);
        setItens(dados.itens || []);
        setRestauranteAtual(dados.restaurante || null);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify({
        itens,
        restaurante: restauranteAtual
      }));
    }
  }, [itens, restauranteAtual]);

  const adicionarItem = useCallback((produto, restaurante, quantidade = 1) => {
    if (restauranteAtual && restauranteAtual.id !== restaurante.id) {
      setItens([]);
    }

    setRestauranteAtual(restaurante);

    setItens(itensAtuais => {
      const indiceExistente = itensAtuais.findIndex(item => item.produto.id === produto.id);

      if (indiceExistente >= 0) {
        const novosItens = [...itensAtuais];
        novosItens[indiceExistente].quantidade += quantidade;
        return novosItens;
      }

      return [...itensAtuais, { produto, quantidade }];
    });
  }, [restauranteAtual]);

  const removerItem = useCallback((produtoId) => {
    setItens(itensAtuais => {
      const novosItens = itensAtuais.filter(item => item.produto.id !== produtoId);
      if (novosItens.length === 0) {
        setRestauranteAtual(null);
      }
      return novosItens;
    });
  }, []);

  const atualizarQuantidade = useCallback((produtoId, quantidade) => {
    if (quantidade <= 0) {
      removerItem(produtoId);
      return;
    }

    setItens(itensAtuais =>
      itensAtuais.map(item =>
        item.produto.id === produtoId ? { ...item, quantidade } : item
      )
    );
  }, [removerItem]);

  const limparCarrinho = useCallback(() => {
    setItens([]);
    setRestauranteAtual(null);
  }, []);

  const totalItens = itens.reduce((acc, item) => acc + item.quantidade, 0);

  const subtotal = itens.reduce((acc, item) => {
    const preco = item.produto.preco_promocional || item.produto.preco;
    return acc + (parseFloat(preco) * item.quantidade);
  }, 0);

  const taxaEntrega = restauranteAtual ? parseFloat(restauranteAtual.taxa_entrega || 0) : 0;
  const total = subtotal + taxaEntrega;

  return (
    <CarrinhoContexto.Provider value={{
      itens,
      restauranteAtual,
      totalItens,
      subtotal,
      taxaEntrega,
      total,
      adicionarItem,
      removerItem,
      atualizarQuantidade,
      limparCarrinho
    }}>
      {children}
    </CarrinhoContexto.Provider>
  );
}
