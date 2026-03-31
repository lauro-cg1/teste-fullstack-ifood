import ListaCategorias from './ListaCategorias';

export default {
  title: 'Componentes/ListaCategorias',
  component: ListaCategorias,
  tags: ['autodocs'],
  parameters: { layout: 'padded' }
};

const categoriasMock = [
  { id: 1, nome: 'Lanches', imagem: null },
  { id: 2, nome: 'Pizza', imagem: null },
  { id: 3, nome: 'Japonesa', imagem: null },
  { id: 4, nome: 'Brasileira', imagem: null },
  { id: 5, nome: 'Açaí', imagem: null },
  { id: 6, nome: 'Doces', imagem: null },
  { id: 7, nome: 'Saudável', imagem: null }
];

export const Padrao = {
  args: {
    categorias: categoriasMock,
    categoriaAtiva: null
  }
};

export const ComCategoriaAtiva = {
  args: {
    categorias: categoriasMock,
    categoriaAtiva: 1
  }
};

export const Vazia = {
  args: {
    categorias: [],
    categoriaAtiva: null
  }
};
