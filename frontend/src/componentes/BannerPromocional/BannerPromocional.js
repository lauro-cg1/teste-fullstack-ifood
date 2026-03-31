import Botao from '../Botao/Botao';
import estilos from './BannerPromocional.module.css';

export default function BannerPromocional({ titulo, descricao, textoBotao, aoClicar }) {
  return (
    <div className={estilos.banner}>
      <div className={estilos.bannerConteudo}>
        <h2>{titulo || 'Fome de quê?'}</h2>
        <p>{descricao || 'Peça comida dos melhores restaurantes sem sair de casa'}</p>
        {textoBotao && (
          <Botao variante="secundario" aoClicar={aoClicar} style={{ background: 'white', color: '#ea1d2c', border: 'none' }}>
            {textoBotao}
          </Botao>
        )}
      </div>
      <div className={estilos.bannerImagem}>🍔</div>
    </div>
  );
}
