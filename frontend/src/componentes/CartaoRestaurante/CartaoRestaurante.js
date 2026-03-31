import Link from 'next/link';
import { FiStar, FiClock } from 'react-icons/fi';
import estilos from './CartaoRestaurante.module.css';

export default function CartaoRestaurante({ restaurante }) {
  const taxaGratis = parseFloat(restaurante.taxa_entrega) === 0;

  return (
    <Link href={`/restaurante/${restaurante.id}`}>
      <div className={estilos.cartao}>
        <div className={estilos.imagemContainer}>
          {restaurante.imagem ? (
            <img src={restaurante.imagem} alt={restaurante.nome} />
          ) : (
            <div className={estilos.placeholderImagem}>🍽️</div>
          )}
          {taxaGratis && (
            <span className={estilos.entregaGratis}>Entrega Grátis</span>
          )}
        </div>
        <div className={estilos.conteudo}>
          <h3 className={estilos.nome}>{restaurante.nome}</h3>
          <div className={estilos.info}>
            <span className={estilos.avaliacao}>
              <FiStar size={14} /> {parseFloat(restaurante.avaliacao).toFixed(1)}
            </span>
            <span className={estilos.separador}>•</span>
            <span>{restaurante.categoria?.nome}</span>
          </div>
          <div className={estilos.detalhesEntrega}>
            <span className={estilos.taxaEntrega}>
              {taxaGratis ? 'Grátis' : `R$ ${parseFloat(restaurante.taxa_entrega).toFixed(2)}`}
            </span>
            <span className={estilos.separador}>•</span>
            <span>
              <FiClock size={12} /> {restaurante.tempo_entrega_min}-{restaurante.tempo_entrega_max} min
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
