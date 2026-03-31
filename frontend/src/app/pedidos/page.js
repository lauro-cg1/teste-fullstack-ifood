'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PedidoAPI } from '../../servicos/api';
import { usarAutenticacao } from '../../hooks/usarAutenticacao';
import Botao from '../../componentes/Botao/Botao';
import estilos from './page.module.css';

const MAPA_STATUS = {
  pendente: { rotulo: 'Pendente', classe: estilos.statusPendente },
  confirmado: { rotulo: 'Confirmado', classe: estilos.statusConfirmado },
  preparando: { rotulo: 'Preparando', classe: estilos.statusPreparando },
  saiu_entrega: { rotulo: 'Saiu para entrega', classe: estilos.statusSaiuEntrega },
  entregue: { rotulo: 'Entregue', classe: estilos.statusEntregue },
  cancelado: { rotulo: 'Cancelado', classe: estilos.statusCancelado }
};

export default function PaginaPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [carregandoPedidos, setCarregandoPedidos] = useState(false);
  const { estaAutenticado, carregando: carregandoAuth } = usarAutenticacao();
  const roteador = useRouter();

  const carregarPedidos = useCallback(async () => {
    setCarregandoPedidos(true);
    try {
      const resposta = await PedidoAPI.listarMeus();
      setPedidos(resposta.data.dados.pedidos);
    } catch (erro) {
      console.error('Erro ao carregar pedidos:', erro);
    } finally {
      setCarregandoPedidos(false);
    }
  }, []);

  useEffect(() => {
    if (carregandoAuth) return;
    if (!estaAutenticado) {
      roteador.push('/entrar');
      return;
    }
    carregarPedidos();
  }, [estaAutenticado, carregandoAuth, roteador, carregarPedidos]);

  const cancelarPedido = async (pedidoId) => {
    try {
      await PedidoAPI.cancelar(pedidoId);
      toast.success('Pedido cancelado');
      carregarPedidos();
    } catch (err) {
      toast.error(err.response?.data?.mensagem || 'Não foi possível cancelar');
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

  if (carregandoAuth || carregandoPedidos) {
    return (
      <div className="pagina-carregando">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className={estilos.pagina}>
      <h1 className={estilos.titulo}>Meus Pedidos</h1>

      {pedidos.length === 0 ? (
        <div className={estilos.vazio}>
          <div className={estilos.iconeVazio}>🛍️</div>
          <h3>Você ainda não fez nenhum pedido</h3>
          <p style={{ marginBottom: '24px' }}>Explore nossos restaurantes e faça seu primeiro pedido</p>
          <Link href="/">
            <Botao>Ver restaurantes</Botao>
          </Link>
        </div>
      ) : (
        pedidos.map((pedido) => {
          const statusInfo = MAPA_STATUS[pedido.status] || { rotulo: pedido.status, classe: '' };
          const podeCancelar = ['pendente', 'confirmado'].includes(pedido.status);

          return (
            <div key={pedido.id} className={estilos.cardPedido}>
              <div className={estilos.pedidoCabecalho}>
                <div>
                  <p className={estilos.restauranteNome}>{pedido.restaurante?.nome}</p>
                  <p className={estilos.pedidoData}>{formatarData(pedido.criado_em)}</p>
                </div>
                <span className={`${estilos.status} ${statusInfo.classe}`}>
                  {statusInfo.rotulo}
                </span>
              </div>

              <div className={estilos.pedidoItens}>
                {pedido.itens?.map((item) => (
                  <span key={item.id}>
                    {item.quantidade}x {item.produto?.nome}{' '}
                  </span>
                ))}
              </div>

              <div className={estilos.pedidoRodape}>
                <span className={estilos.pedidoTotal}>
                  Total: R$ {parseFloat(pedido.total).toFixed(2)}
                </span>
                {podeCancelar && (
                  <button
                    className={estilos.botaoCancelar}
                    onClick={() => cancelarPedido(pedido.id)}
                  >
                    Cancelar pedido
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
