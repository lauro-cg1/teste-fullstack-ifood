'use client';

import { useState, useEffect, useCallback } from 'react';
import { RestauranteAPI, CategoriaAPI } from '../servicos/api';
import CartaoRestaurante from '../componentes/CartaoRestaurante/CartaoRestaurante';
import ListaCategorias from '../componentes/ListaCategorias/ListaCategorias';
import BarraBusca from '../componentes/BarraBusca/BarraBusca';
import BannerPromocional from '../componentes/BannerPromocional/BannerPromocional';
import estilos from './page.module.css';

const ORDENACOES = [
  { valor: '', rotulo: 'Relevância' },
  { valor: 'avaliacao', rotulo: 'Mais avaliados' },
  { valor: 'entrega', rotulo: 'Menor entrega' },
  { valor: 'tempo', rotulo: 'Mais rápido' }
];

export default function PaginaInicial() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [erroConexao, setErroConexao] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const [ordenacao, setOrdenacao] = useState('');
  const [busca, setBusca] = useState('');
  const [paginacao, setPaginacao] = useState({ pagina: 1, totalPaginas: 1 });
  const [carregando, setCarregando] = useState(true);

  const obterMensagemErroConexao = (erro, recurso) => {
    if (!erro?.response) {
      return `Nao foi possivel conectar ao servidor para carregar ${recurso}. Verifique se a API esta ativa e tente novamente.`;
    }

    return `Nao foi possivel carregar ${recurso}. Tente novamente em instantes.`;
  };

  const carregarCategorias = useCallback(async () => {
    try {
      const resposta = await CategoriaAPI.listarTodas();
      setCategorias(resposta.data.dados);
      setErroConexao('');
    } catch (erro) {
      setErroConexao(obterMensagemErroConexao(erro, 'as categorias'));
      console.error('Erro ao carregar categorias:', erro.message, erro.code);
    }
  }, []);

  const carregarRestaurantes = useCallback(async (pagina = 1) => {
    setCarregando(true);
    try {
      const params = {
        pagina,
        limite: 12,
        ...(categoriaAtiva && { categoria_id: categoriaAtiva }),
        ...(busca && { busca }),
        ...(ordenacao && { ordenar: ordenacao })
      };
      const resposta = await RestauranteAPI.listarTodos(params);
      setRestaurantes(resposta.data.dados.restaurantes);
      setPaginacao(resposta.data.dados.paginacao);
      setErroConexao('');
    } catch (erro) {
      setErroConexao(obterMensagemErroConexao(erro, 'os restaurantes'));
      console.error('Erro ao carregar restaurantes:', erro.message, erro.code);
    } finally {
      setCarregando(false);
    }
  }, [categoriaAtiva, busca, ordenacao]);

  useEffect(() => {
    carregarCategorias();
  }, [carregarCategorias]);

  useEffect(() => {
    carregarRestaurantes(1);
  }, [carregarRestaurantes]);

  const aoSelecionarCategoria = (id) => {
    setCategoriaAtiva(id);
    setBusca('');
  };

  const aoBuscar = (termo) => {
    setBusca(termo);
    if (termo) setCategoriaAtiva(null);
  };

  const mudarPagina = (novaPagina) => {
    carregarRestaurantes(novaPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tentarNovamente = async () => {
    setErroConexao('');
    await Promise.all([carregarCategorias(), carregarRestaurantes(1)]);
  };

  return (
    <div className={estilos.pagina}>
      <div className={estilos.heroi}>
        <h1>Fome de quê?</h1>
        <p>Peça comida dos melhores restaurantes sem sair de casa</p>
        <BarraBusca aoBuscar={aoBuscar} placeholder="Busque por restaurante ou prato" />
      </div>

      <div className={estilos.secao}>
        {erroConexao && (
          <div className={estilos.alertaConexao} role="alert">
            <p>{erroConexao}</p>
            <button className={estilos.botaoTentarNovamente} onClick={tentarNovamente}>
              Tentar novamente
            </button>
          </div>
        )}

        <ListaCategorias
          categorias={categorias}
          categoriaAtiva={categoriaAtiva}
          aoSelecionar={aoSelecionarCategoria}
        />

        <BannerPromocional
          titulo="Entrega grátis hoje!"
          descricao="Nos seus restaurantes favoritos, sem taxa de entrega"
          textoBotao="Ver restaurantes"
        />

        <div className={estilos.filtrosOrdenacao}>
          {ORDENACOES.map((ord) => (
            <button
              key={ord.valor}
              className={`${estilos.chipFiltro} ${ordenacao === ord.valor ? estilos.chipFiltroAtivo : ''}`}
              onClick={() => setOrdenacao(ord.valor)}
            >
              {ord.rotulo}
            </button>
          ))}
        </div>

        {busca && (
          <p className={estilos.tituloBusca}>
            Resultados para &quot;{busca}&quot;
          </p>
        )}

        {carregando ? (
          <div className="pagina-carregando">
            <div className="spinner" />
          </div>
        ) : restaurantes.length === 0 ? (
          <div className="mensagem-vazia">
            <h3>Nenhum restaurante encontrado</h3>
            <p>Tente buscar por outro nome ou categoria</p>
          </div>
        ) : (
          <div className="grade-restaurantes">
            {restaurantes.map((restaurante) => (
              <CartaoRestaurante key={restaurante.id} restaurante={restaurante} />
            ))}
          </div>
        )}

        {paginacao.totalPaginas > 1 && (
          <div className={estilos.paginacao}>
            {Array.from({ length: paginacao.totalPaginas }, (_, i) => i + 1).map((pagina) => (
              <button
                key={pagina}
                className={`${estilos.botaoPagina} ${paginacao.pagina === pagina ? estilos.botaoPaginaAtivo : ''}`}
                onClick={() => mudarPagina(pagina)}
              >
                {pagina}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
