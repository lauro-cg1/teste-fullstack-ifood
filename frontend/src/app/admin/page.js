'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PedidoAPI } from '../../servicos/api';
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

export default function PaginaAdmin() {
  const { usuario, estaAutenticado, carregando } = usarAutenticacao();
  const roteador = useRouter();
  const [pedidos, setPedidos] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [carregandoPedidos, setCarregandoPedidos] = useState(true);
  const [atualizando, setAtualizando] = useState(null);

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

  useEffect(() => {
    if (!carregando) {
      if (!estaAutenticado || !usuario?.admin) {
        roteador.push('/');
      }
    }
  }, [estaAutenticado, usuario, carregando, roteador]);

  useEffect(() => {
    if (estaAutenticado && usuario?.admin) {
      carregarPedidos();
    }
  }, [estaAutenticado, usuario, carregarPedidos]);

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

  const formatarData = (dataStr) => {
    return new Date(dataStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (carregando || carregandoPedidos) {
    return (
      <div className="pagina-carregando">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className={estilos.pagina}>
      <div className={estilos.topoPagina}>
        <h1 className={estilos.titulo}>Painel Admin</h1>
        <p className={estilos.subtitulo}>{pedidos.length} pedido(s) encontrado(s)</p>
      </div>

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

      {pedidos.length === 0 ? (
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
    </div>
  );
}
