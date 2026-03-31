import { render, screen, fireEvent } from '@testing-library/react';
import ListaCategorias from '../src/componentes/ListaCategorias/ListaCategorias';

const categoriasMock = [
  { id: 1, nome: 'Lanches', imagem: null },
  { id: 2, nome: 'Pizza', imagem: null },
  { id: 3, nome: 'Japonesa', imagem: null }
];

describe('ListaCategorias', () => {
  it('deve renderizar a opção "Todos"', () => {
    render(<ListaCategorias categorias={categoriasMock} />);
    expect(screen.getByText('Todos')).toBeInTheDocument();
  });

  it('deve renderizar todas as categorias', () => {
    render(<ListaCategorias categorias={categoriasMock} />);
    expect(screen.getByText('Lanches')).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('Japonesa')).toBeInTheDocument();
  });

  it('deve chamar aoSelecionar ao clicar em uma categoria', () => {
    const mockSelecionar = jest.fn();
    render(<ListaCategorias categorias={categoriasMock} aoSelecionar={mockSelecionar} />);
    fireEvent.click(screen.getByText('Pizza'));
    expect(mockSelecionar).toHaveBeenCalledWith(2);
  });

  it('deve chamar aoSelecionar com null ao clicar em Todos', () => {
    const mockSelecionar = jest.fn();
    render(<ListaCategorias categorias={categoriasMock} aoSelecionar={mockSelecionar} />);
    fireEvent.click(screen.getByText('Todos'));
    expect(mockSelecionar).toHaveBeenCalledWith(null);
  });

  it('deve exibir ícones padrão para categorias conhecidas', () => {
    render(<ListaCategorias categorias={[{ id: 1, nome: 'Lanches', imagem: null }]} />);
    expect(screen.getByText('🍔')).toBeInTheDocument();
  });

  it('deve lidar com lista vazia de categorias', () => {
    render(<ListaCategorias categorias={[]} />);
    expect(screen.getByText('Todos')).toBeInTheDocument();
  });
});
