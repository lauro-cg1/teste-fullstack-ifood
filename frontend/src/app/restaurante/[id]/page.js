'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { FiStar, FiClock, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { RestauranteAPI } from '../../../servicos/api';
import { usarCarrinho } from '../../../hooks/usarCarrinho';
import CartaoProduto from '../../../componentes/CartaoProduto/CartaoProduto';
import Carrinho from '../../../componentes/Carrinho/Carrinho';
import estilos from './page.module.css';

export default function PaginaRestaurante() {
  const { id } = useParams();
  const [restaurante, setRestaurante] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [categoriaMenuAtiva, setCategoriaMenuAtiva] = useState(null);
  const { adicionarItem } = usarCarrinho();

  const carregarRestaurante = useCallback(async () => {
    try {
      const resposta = await RestauranteAPI.obterPorId(id);
      const dados = resposta.data.dados;
      setRestaurante(dados);
      if (dados.produtos?.length > 0) {
        setCategoriaMenuAtiva(dados.produtos[0].categoria_produto);
      }
    } catch (erro) {
      console.error('Erro ao carregar restaurante:', erro);
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    carregarRestaurante();
  }, [carregarRestaurante]);

  if (carregando) {
    return (
      <div className="pagina-carregando">
        <div className="spinner" />
      </div>
    );
  }

  if (!restaurante) {
    return (
      <div className="mensagem-vazia">
        <h3>Restaurante não encontrado</h3>
      </div>
    );
  }

  const produtosPorCategoria = restaurante.produtos?.reduce((acc, produto) => {
    const cat = produto.categoria_produto || 'Outros';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(produto);
    return acc;
  }, {}) || {};

  const categorias = Object.keys(produtosPorCategoria);

  const aoAdicionarProduto = (produto) => {
    adicionarItem(produto, restaurante);
    toast.success(`${produto.nome} adicionado à sacola!`, { icon: '🛒' });
  };

  return (
    <>
      <div className={estilos.pagina}>
        <div className={estilos.conteudoPrincipal}>
          {restaurante.imagem_capa ? (
            <img src={restaurante.imagem_capa} alt={restaurante.nome} className={estilos.capa} />
          ) : (
            <div className={estilos.capaPlaceholder}>🍽️</div>
          )}

          <div className={estilos.infoContainer}>
            <div className={estilos.infoTopo}>
              {restaurante.imagem ? (
                <img src={restaurante.imagem} alt={restaurante.nome} className={estilos.logoRestaurante} />
              ) : (
                <div className={estilos.logoPlaceholder}>🍽️</div>
              )}
              <div className={estilos.infoTexto}>
                <h1>{restaurante.nome}</h1>
                <p style={{ color: 'var(--cinza-500)', fontSize: '0.875rem' }}>{restaurante.descricao}</p>
                <div className={estilos.badges}>
                  <span className={estilos.badge}>
                    <FiStar color="#ffba00" size={14} />
                    {parseFloat(restaurante.avaliacao).toFixed(1)}
                    <span style={{ color: 'var(--cinza-400)' }}>({restaurante.total_avaliacoes})</span>
                  </span>
                  <span className={estilos.badge}>
                    <FiClock size={14} />
                    {restaurante.tempo_entrega_min}-{restaurante.tempo_entrega_max} min
                  </span>
                  <span className={`${estilos.badge} ${estilos.badgeDestaque}`}>
                    <FiShoppingBag size={12} />
                    {parseFloat(restaurante.taxa_entrega) === 0 ? 'Grátis' : `R$ ${parseFloat(restaurante.taxa_entrega).toFixed(2)}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {categorias.length > 0 && (
            <div className={estilos.navegacaoAncorada}>
              {categorias.map((cat) => (
                <button
                  key={cat}
                  className={estilos.linkAncora}
                  onClick={() => {
                    setCategoriaMenuAtiva(cat);
                    document.getElementById(`cat-${cat}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className={estilos.secaoProdutos}>
            {categorias.map((cat) => (
              <div key={cat} id={`cat-${cat}`}>
                <h2 className={estilos.tituloCategoriaMenu}>{cat}</h2>
                <div className={estilos.listaProdutos}>
                  {produtosPorCategoria[cat].map((produto) => (
                    <CartaoProduto
                      key={produto.id}
                      produto={produto}
                      aoAdicionar={aoAdicionarProduto}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={estilos.carrinhoFixo}>
          <Carrinho />
        </div>
      </div>
    </>
  );
}
