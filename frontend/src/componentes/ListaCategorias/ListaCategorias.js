'use client';

import estilos from './ListaCategorias.module.css';

const iconesPadrao = {
  'Lanches': '🍔',
  'Pizza': '🍕',
  'Japonesa': '🍣',
  'Brasileira': '🍛',
  'Açaí': '🫐',
  'Doces': '🍰',
  'Saudável': '🥗',
  'Árabe': '🧆',
  'Chinesa': '🥡',
  'Italiana': '🍝'
};

export default function ListaCategorias({ categorias = [], categoriaAtiva, aoSelecionar }) {
  return (
    <div className={estilos.lista}>
      <div
        className={`${estilos.item} ${!categoriaAtiva ? estilos.itemAtivo : ''}`}
        onClick={() => aoSelecionar && aoSelecionar(null)}
      >
        <div className={estilos.imagemContainer}>🏠</div>
        <span className={estilos.nome}>Todos</span>
      </div>
      {categorias.map((categoria) => (
        <div
          key={categoria.id}
          className={`${estilos.item} ${categoriaAtiva === categoria.id ? estilos.itemAtivo : ''}`}
          onClick={() => aoSelecionar && aoSelecionar(categoria.id)}
        >
          <div className={estilos.imagemContainer}>
            {categoria.imagem ? (
              <img src={categoria.imagem} alt={categoria.nome} />
            ) : (
              iconesPadrao[categoria.nome] || '🍽️'
            )}
          </div>
          <span className={estilos.nome}>{categoria.nome}</span>
        </div>
      ))}
    </div>
  );
}
