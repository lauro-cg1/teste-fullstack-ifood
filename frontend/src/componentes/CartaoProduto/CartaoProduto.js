'use client';

import estilos from './CartaoProduto.module.css';

export default function CartaoProduto({ produto, aoAdicionar }) {
  const temPromocao = produto.preco_promocional && parseFloat(produto.preco_promocional) < parseFloat(produto.preco);

  return (
    <div className={estilos.cartaoWrapper}>
      <div className={estilos.cartao} onClick={() => aoAdicionar && aoAdicionar(produto)}>
        <div className={estilos.info}>
          {produto.destaque && <span className={estilos.destaque}>Mais Pedido</span>}
          <h4 className={estilos.nome}>{produto.nome}</h4>
          <p className={estilos.descricao}>{produto.descricao}</p>
          <div className={estilos.precoContainer}>
            {temPromocao ? (
              <>
                <span className={estilos.precoOriginal}>
                  R$ {parseFloat(produto.preco).toFixed(2)}
                </span>
                <span className={`${estilos.preco} ${estilos.precoPromocional}`}>
                  R$ {parseFloat(produto.preco_promocional).toFixed(2)}
                </span>
              </>
            ) : (
              <span className={estilos.preco}>
                R$ {parseFloat(produto.preco).toFixed(2)}
              </span>
            )}
          </div>
        </div>
        <div className={estilos.imagemContainer}>
          {produto.imagem ? (
            <img src={produto.imagem} alt={produto.nome} />
          ) : (
            <span className={estilos.placeholderImagem}>🍽️</span>
          )}
        </div>
      </div>
    </div>
  );
}
