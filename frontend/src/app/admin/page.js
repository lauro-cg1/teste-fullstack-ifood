'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PedidoAPI, RestauranteAPI, ProdutoAPI, CategoriaAPI } from '../../servicos/api';
import { usarAutenticacao } from '../../hooks/usarAutenticacao';
import estilos from './page.module.css';

const TODOS_STATUS = ['pendente', 'confirmado', 'preparando', 'saiu_entrega', 'entregue', 'cancelado'];

const MAPA_STATUS = {
  pendente: { rotulo: 'Pendente', classe: estilos.statusPendente },
  confirmado: { rotulo: 'Confirmado', classe: estilos.statusConfirmado },
  preparando: { rotulo: 'Preparando', classe: estilos.statusPreparando },
  saiu_entrega: { rotulo: 'Saiu para entrega', classe: estilos.statusSaiuEntrega },
  entregue: { rotulo: 'Entregue', classe: estilos.statusEntregue },
  cancelado: { rotulo: 'Cancelado', classe: estilos.statusCancelado }
};

const ABAS = [
  { id: 'pedidos', rotulo: 'Pedidos' },
  { id: 'restaurantes', rotulo: 'Restaurantes' },
  { id: 'produtos', rotulo: 'Produtos' },
  { id: 'categorias', rotulo: 'Categorias' }
];

export default function PaginaAdmin() {
  const { usuario, estaAutenticado, carregando } = usarAutenticacao();
  const roteador = useRouter();
  
  const [abaAtiva, setAbaAtiva] = useState('pedidos');
  
  const [pedidos, setPedidos] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [carregandoPedidos, setCarregandoPedidos] = useState(false);
  const [atualizando, setAtualizando] = useState(null);
  
  const [restaurantes, setRestaurantes] = useState([]);
  const [carregandoRestaurantes, setCarregandoRestaurantes] = useState(false);
  const [modalRestaurante, setModalRestaurante] = useState({ aberto: false, dados: null });
  
  const [produtos, setProdutos] = useState([]);
  const [carregandoProdutos, setCarregandoProdutos] = useState(false);
  const [modalProduto, setModalProduto] = useState({ aberto: false, dados: null });
  
  const [categorias, setCategorias] = useState([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(false);
  const [modalCategoria, setModalCategoria] = useState({ aberto: false, dados: null });
  
  const [salvando, setSalvando] = useState(false);

  const carregarPedidos = useCallback(async () => {
    setCarregandoPedidos(true);
    try {
      const params = filtroStatus ? { status: filtroStatus } : {};
      const resposta = await PedidoAPI.listarTodos(params);
      setPedidos(resposta.data.dados.pedidos);
    } catch (err) {
      toast.error('Erro ao carregar pedidos');
    } finally {
      setCarregandoPedidos(false);
    }
  }, [filtroStatus]);

  const carregarRestaurantes = useCallback(async () => {
    setCarregandoRestaurantes(true);
    try {
      const resposta = await RestauranteAPI.listarTodos({ limite: 100 });
      setRestaurantes(resposta.data.dados.restaurantes);
    } catch (err) {
      toast.error('Erro ao carregar restaurantes');
    } finally {
      setCarregandoRestaurantes(false);
    }
  }, []);

  const carregarProdutos = useCallback(async () => {
    setCarregandoProdutos(true);
    try {
      const resposta = await ProdutoAPI.buscar({ limite: 100 });
      setProdutos(resposta.data.dados.produtos);
    } catch (err) {
      toast.error('Erro ao carregar produtos');
    } finally {
      setCarregandoProdutos(false);
    }
  }, []);

  const carregarCategorias = useCallback(async () => {
    setCarregandoCategorias(true);
    try {
      const resposta = await CategoriaAPI.listarTodas();
      setCategorias(resposta.data.dados);
    } catch (err) {
      toast.error('Erro ao carregar categorias');
    } finally {
      setCarregandoCategorias(false);
    }
  }, []);

  useEffect(() => {
    if (!carregando) {
      if (!estaAutenticado || !usuario?.admin) {
        roteador.push('/');
      }
    }
  }, [estaAutenticado, usuario, carregando, roteador]);

  useEffect(() => {
    if (estaAutenticado && usuario?.admin) {
      if (abaAtiva === 'pedidos') carregarPedidos();
      if (abaAtiva === 'restaurantes') {
        carregarRestaurantes();
        carregarCategorias();
      }
      if (abaAtiva === 'produtos') {
        carregarProdutos();
        carregarRestaurantes();
      }
      if (abaAtiva === 'categorias') carregarCategorias();
    }
  }, [estaAutenticado, usuario, abaAtiva, carregarPedidos, carregarRestaurantes, carregarProdutos, carregarCategorias]);

  const alterarStatus = async (pedidoId, novoStatus) => {
    setAtualizando(pedidoId);
    try {
      await PedidoAPI.atualizarStatus(pedidoId, novoStatus);
      toast.success('Status atualizado!');
      carregarPedidos();
    } catch (err) {
      toast.error('Erro ao atualizar status');
    } finally {
      setAtualizando(null);
    }
  };

  const salvarRestaurante = async (e) => {
    e.preventDefault();
    setSalvando(true);
    const form = e.target;
    const dados = {
      nome: form.nome.value,
      descricao: form.descricao.value,
      imagem_url: form.imagem_url.value,
      categoria_id: parseInt(form.categoria_id.value),
      taxa_entrega: parseFloat(form.taxa_entrega.value),
      tempo_entrega_min: parseInt(form.tempo_entrega_min.value),
      tempo_entrega_max: parseInt(form.tempo_entrega_max.value),
      avaliacao: parseFloat(form.avaliacao.value) || 0,
      endereco: form.endereco.value
    };
    try {
      if (modalRestaurante.dados?.id) {
        await RestauranteAPI.atualizar(modalRestaurante.dados.id, dados);
        toast.success('Restaurante atualizado!');
      } else {
        await RestauranteAPI.criar(dados);
        toast.success('Restaurante criado!');
      }
      setModalRestaurante({ aberto: false, dados: null });
      carregarRestaurantes();
    } catch (err) {
      toast.error('Erro ao salvar restaurante');
    } finally {
      setSalvando(false);
    }
  };

  const removerRestaurante = async (id) => {
    if (!confirm('Tem certeza que deseja remover este restaurante?')) return;
    try {
      await RestauranteAPI.remover(id);
      toast.success('Restaurante removido!');
      carregarRestaurantes();
    } catch (err) {
      toast.error('Erro ao remover restaurante');
    }
  };

  const salvarProduto = async (e) => {
    e.preventDefault();
    setSalvando(true);
    const form = e.target;
    const dados = {
      nome: form.nome.value,
      descricao: form.descricao.value,
      preco: parseFloat(form.preco.value),
      imagem_url: form.imagem_url.value,
      restaurante_id: parseInt(form.restaurante_id.value),
      disponivel: form.disponivel.checked
    };
    try {
      if (modalProduto.dados?.id) {
        await ProdutoAPI.atualizar(modalProduto.dados.id, dados);
        toast.success('Produto atualizado!');
      } else {
        await ProdutoAPI.criar(dados);
        toast.success('Produto criado!');
      }
      setModalProduto({ aberto: false, dados: null });
      carregarProdutos();
    } catch (err) {
      toast.error('Erro ao salvar produto');
    } finally {
      setSalvando(false);
    }
  };

  const removerProduto = async (id) => {
    if (!confirm('Tem certeza que deseja remover este produto?')) return;
    try {
      await ProdutoAPI.remover(id);
      toast.success('Produto removido!');
      carregarProdutos();
    } catch (err) {
      toast.error('Erro ao remover produto');
    }
  };

  const salvarCategoria = async (e) => {
    e.preventDefault();
    setSalvando(true);
    const form = e.target;
    const dados = {
      nome: form.nome.value,
      icone: form.icone.value
    };
    try {
      if (modalCategoria.dados?.id) {
        await CategoriaAPI.atualizar(modalCategoria.dados.id, dados);
        toast.success('Categoria atualizada!');
      } else {
        await CategoriaAPI.criar(dados);
        toast.success('Categoria criada!');
      }
      setModalCategoria({ aberto: false, dados: null });
      carregarCategorias();
    } catch (err) {
      toast.error('Erro ao salvar categoria');
    } finally {
      setSalvando(false);
    }
  };

  const formatarData = (dataStr) => {
    return new Date(dataStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (carregando) {
    return (
      <div className="pagina-carregando">
        <div className="spinner" />
      </div>
    );
  }

  const renderizarPedidos = () => (
    <>
      <div className={estilos.filtros}>
        <button
          className={`${estilos.chipFiltro} ${filtroStatus === '' ? estilos.chipFiltroAtivo : ''}`}
          onClick={() => setFiltroStatus('')}
        >
          Todos
        </button>
        {TODOS_STATUS.map((s) => (
          <button
            key={s}
            className={`${estilos.chipFiltro} ${filtroStatus === s ? estilos.chipFiltroAtivo : ''}`}
            onClick={() => setFiltroStatus(s)}
          >
            {MAPA_STATUS[s].rotulo}
          </button>
        ))}
      </div>

      {carregandoPedidos ? (
        <div className="pagina-carregando"><div className="spinner" /></div>
      ) : pedidos.length === 0 ? (
        <div className="mensagem-vazia">
          <h3>Nenhum pedido encontrado</h3>
        </div>
      ) : (
        <div className={estilos.listaPedidos}>
          {pedidos.map((pedido) => {
            const statusInfo = MAPA_STATUS[pedido.status] || { rotulo: pedido.status, classe: '' };
            return (
              <div key={pedido.id} className={estilos.cardPedido}>
                <div className={estilos.cardTopo}>
                  <div className={estilos.cardInfo}>
                    <span className={estilos.pedidoId}>#{pedido.id}</span>
                    <span className={estilos.restauranteNome}>{pedido.restaurante?.nome}</span>
                    <span className={estilos.pedidoData}>{formatarData(pedido.criado_em)}</span>
                  </div>
                  <span className={`${estilos.status} ${statusInfo.classe}`}>
                    {statusInfo.rotulo}
                  </span>
                </div>

                <div className={estilos.cardItens}>
                  {pedido.itens?.map((item) => (
                    <span key={item.id} className={estilos.item}>
                      {item.quantidade}x {item.produto?.nome}
                    </span>
                  ))}
                </div>

                <div className={estilos.cardRodape}>
                  <span className={estilos.total}>
                    Total: <strong>R$ {parseFloat(pedido.total).toFixed(2)}</strong>
                  </span>

                  {pedido.status !== 'entregue' && pedido.status !== 'cancelado' && (
                    <div className={estilos.acoesStatus}>
                      {TODOS_STATUS.filter((s) => s !== 'cancelado' && s !== pedido.status).map((s) => (
                        <button
                          key={s}
                          className={estilos.botaoStatus}
                          onClick={() => alterarStatus(pedido.id, s)}
                          disabled={atualizando === pedido.id}
                        >
                          {atualizando === pedido.id ? '...' : `→ ${MAPA_STATUS[s].rotulo}`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  const renderizarRestaurantes = () => (
    <>
      <div className={estilos.acaoTopo}>
        <button className={estilos.botaoNovo} onClick={() => setModalRestaurante({ aberto: true, dados: null })}>
          + Novo Restaurante
        </button>
      </div>

      {carregandoRestaurantes ? (
        <div className="pagina-carregando"><div className="spinner" /></div>
      ) : restaurantes.length === 0 ? (
        <div className="mensagem-vazia">
          <h3>Nenhum restaurante encontrado</h3>
        </div>
      ) : (
        <div className={estilos.tabelaContainer}>
          <table className={estilos.tabela}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Avaliação</th>
                <th>Taxa Entrega</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {restaurantes.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.nome}</td>
                  <td>{r.categoria?.nome || '-'}</td>
                  <td>{r.avaliacao}</td>
                  <td>R$ {parseFloat(r.taxa_entrega).toFixed(2)}</td>
                  <td>
                    <button className={estilos.botaoEditar} onClick={() => setModalRestaurante({ aberto: true, dados: r })}>Editar</button>
                    <button className={estilos.botaoRemover} onClick={() => removerRestaurante(r.id)}>Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalRestaurante.aberto && (
        <div className={estilos.modal}>
          <div className={estilos.modalConteudo}>
            <h2>{modalRestaurante.dados ? 'Editar Restaurante' : 'Novo Restaurante'}</h2>
            <form onSubmit={salvarRestaurante}>
              <div className={estilos.campoForm}>
                <label>Nome</label>
                <input name="nome" defaultValue={modalRestaurante.dados?.nome || ''} required />
              </div>
              <div className={estilos.campoForm}>
                <label>Descrição</label>
                <textarea name="descricao" defaultValue={modalRestaurante.dados?.descricao || ''} />
              </div>
              <div className={estilos.campoForm}>
                <label>URL da Imagem</label>
                <input name="imagem_url" defaultValue={modalRestaurante.dados?.imagem_url || ''} />
              </div>
              <div className={estilos.campoForm}>
                <label>Categoria</label>
                <select name="categoria_id" defaultValue={modalRestaurante.dados?.categoria_id || ''} required>
                  <option value="">Selecione...</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>
              <div className={estilos.linhaForm}>
                <div className={estilos.campoForm}>
                  <label>Taxa Entrega</label>
                  <input name="taxa_entrega" type="number" step="0.01" defaultValue={modalRestaurante.dados?.taxa_entrega || 0} required />
                </div>
                <div className={estilos.campoForm}>
                  <label>Avaliação</label>
                  <input name="avaliacao" type="number" step="0.1" min="0" max="5" defaultValue={modalRestaurante.dados?.avaliacao || 0} />
                </div>
              </div>
              <div className={estilos.linhaForm}>
                <div className={estilos.campoForm}>
                  <label>Tempo Mín (min)</label>
                  <input name="tempo_entrega_min" type="number" defaultValue={modalRestaurante.dados?.tempo_entrega_min || 30} required />
                </div>
                <div className={estilos.campoForm}>
                  <label>Tempo Máx (min)</label>
                  <input name="tempo_entrega_max" type="number" defaultValue={modalRestaurante.dados?.tempo_entrega_max || 50} required />
                </div>
              </div>
              <div className={estilos.campoForm}>
                <label>Endereço</label>
                <input name="endereco" defaultValue={modalRestaurante.dados?.endereco || ''} />
              </div>
              <div className={estilos.modalAcoes}>
                <button type="button" className={estilos.botaoCancelar} onClick={() => setModalRestaurante({ aberto: false, dados: null })}>Cancelar</button>
                <button type="submit" className={estilos.botaoSalvar} disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  const renderizarProdutos = () => (
    <>
      <div className={estilos.acaoTopo}>
        <button className={estilos.botaoNovo} onClick={() => setModalProduto({ aberto: true, dados: null })}>
          + Novo Produto
        </button>
      </div>

      {carregandoProdutos ? (
        <div className="pagina-carregando"><div className="spinner" /></div>
      ) : produtos.length === 0 ? (
        <div className="mensagem-vazia">
          <h3>Nenhum produto encontrado</h3>
        </div>
      ) : (
        <div className={estilos.tabelaContainer}>
          <table className={estilos.tabela}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Restaurante</th>
                <th>Preço</th>
                <th>Disponível</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nome}</td>
                  <td>{p.restaurante?.nome || '-'}</td>
                  <td>R$ {parseFloat(p.preco).toFixed(2)}</td>
                  <td>{p.disponivel ? 'Sim' : 'Não'}</td>
                  <td>
                    <button className={estilos.botaoEditar} onClick={() => setModalProduto({ aberto: true, dados: p })}>Editar</button>
                    <button className={estilos.botaoRemover} onClick={() => removerProduto(p.id)}>Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalProduto.aberto && (
        <div className={estilos.modal}>
          <div className={estilos.modalConteudo}>
            <h2>{modalProduto.dados ? 'Editar Produto' : 'Novo Produto'}</h2>
            <form onSubmit={salvarProduto}>
              <div className={estilos.campoForm}>
                <label>Nome</label>
                <input name="nome" defaultValue={modalProduto.dados?.nome || ''} required />
              </div>
              <div className={estilos.campoForm}>
                <label>Descrição</label>
                <textarea name="descricao" defaultValue={modalProduto.dados?.descricao || ''} />
              </div>
              <div className={estilos.campoForm}>
                <label>URL da Imagem</label>
                <input name="imagem_url" defaultValue={modalProduto.dados?.imagem_url || ''} />
              </div>
              <div className={estilos.campoForm}>
                <label>Restaurante</label>
                <select name="restaurante_id" defaultValue={modalProduto.dados?.restaurante_id || ''} required>
                  <option value="">Selecione...</option>
                  {restaurantes.map((r) => (
                    <option key={r.id} value={r.id}>{r.nome}</option>
                  ))}
                </select>
              </div>
              <div className={estilos.linhaForm}>
                <div className={estilos.campoForm}>
                  <label>Preço</label>
                  <input name="preco" type="number" step="0.01" defaultValue={modalProduto.dados?.preco || 0} required />
                </div>
                <div className={estilos.campoFormCheck}>
                  <label>
                    <input name="disponivel" type="checkbox" defaultChecked={modalProduto.dados?.disponivel !== false} />
                    Disponível
                  </label>
                </div>
              </div>
              <div className={estilos.modalAcoes}>
                <button type="button" className={estilos.botaoCancelar} onClick={() => setModalProduto({ aberto: false, dados: null })}>Cancelar</button>
                <button type="submit" className={estilos.botaoSalvar} disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  const renderizarCategorias = () => (
    <>
      <div className={estilos.acaoTopo}>
        <button className={estilos.botaoNovo} onClick={() => setModalCategoria({ aberto: true, dados: null })}>
          + Nova Categoria
        </button>
      </div>

      {carregandoCategorias ? (
        <div className="pagina-carregando"><div className="spinner" /></div>
      ) : categorias.length === 0 ? (
        <div className="mensagem-vazia">
          <h3>Nenhuma categoria encontrada</h3>
        </div>
      ) : (
        <div className={estilos.tabelaContainer}>
          <table className={estilos.tabela}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Ícone</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.nome}</td>
                  <td>{c.icone}</td>
                  <td>
                    <button className={estilos.botaoEditar} onClick={() => setModalCategoria({ aberto: true, dados: c })}>Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalCategoria.aberto && (
        <div className={estilos.modal}>
          <div className={estilos.modalConteudo}>
            <h2>{modalCategoria.dados ? 'Editar Categoria' : 'Nova Categoria'}</h2>
            <form onSubmit={salvarCategoria}>
              <div className={estilos.campoForm}>
                <label>Nome</label>
                <input name="nome" defaultValue={modalCategoria.dados?.nome || ''} required />
              </div>
              <div className={estilos.campoForm}>
                <label>Ícone (emoji ou URL)</label>
                <input name="icone" defaultValue={modalCategoria.dados?.icone || ''} />
              </div>
              <div className={estilos.modalAcoes}>
                <button type="button" className={estilos.botaoCancelar} onClick={() => setModalCategoria({ aberto: false, dados: null })}>Cancelar</button>
                <button type="submit" className={estilos.botaoSalvar} disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className={estilos.pagina}>
      <div className={estilos.topoPagina}>
        <h1 className={estilos.titulo}>Painel Admin</h1>
      </div>

      <div className={estilos.abas}>
        {ABAS.map((aba) => (
          <button
            key={aba.id}
            className={`${estilos.aba} ${abaAtiva === aba.id ? estilos.abaAtiva : ''}`}
            onClick={() => setAbaAtiva(aba.id)}
          >
            {aba.rotulo}
          </button>
        ))}
      </div>

      <div className={estilos.conteudoAba}>
        {abaAtiva === 'pedidos' && renderizarPedidos()}
        {abaAtiva === 'restaurantes' && renderizarRestaurantes()}
        {abaAtiva === 'produtos' && renderizarProdutos()}
        {abaAtiva === 'categorias' && renderizarCategorias()}
      </div>
    </div>
  );
}
