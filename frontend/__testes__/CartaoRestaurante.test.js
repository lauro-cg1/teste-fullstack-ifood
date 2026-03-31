import { render, screen } from '@testing-library/react';
import CartaoRestaurante from '../src/componentes/CartaoRestaurante/CartaoRestaurante';

jest.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

const restauranteMock = {
  id: 1,
  nome: 'Burger King',
  descricao: 'Hambúrgueres grelhados',
  imagem: null,
  taxa_entrega: 5.99,
  tempo_entrega_min: 25,
  tempo_entrega_max: 40,
  avaliacao: 4.5,
  total_avaliacoes: 1250,
  categoria: { id: 1, nome: 'Lanches' }
};

describe('CartaoRestaurante', () => {
  it('deve renderizar o nome do restaurante', () => {
    render(<CartaoRestaurante restaurante={restauranteMock} />);
    expect(screen.getByText('Burger King')).toBeInTheDocument();
  });

  it('deve exibir a avaliação', () => {
    render(<CartaoRestaurante restaurante={restauranteMock} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('deve exibir o tempo de entrega', () => {
    render(<CartaoRestaurante restaurante={restauranteMock} />);
    expect(screen.getByText(/25-40 min/)).toBeInTheDocument();
  });

  it('deve exibir a taxa de entrega', () => {
    render(<CartaoRestaurante restaurante={restauranteMock} />);
    expect(screen.getByText('R$ 5.99')).toBeInTheDocument();
  });

  it('deve exibir "Grátis" quando taxa_entrega é 0', () => {
    render(<CartaoRestaurante restaurante={{ ...restauranteMock, taxa_entrega: 0 }} />);
    expect(screen.getAllByText('Grátis').length).toBeGreaterThanOrEqual(1);
  });

  it('deve exibir o nome da categoria', () => {
    render(<CartaoRestaurante restaurante={restauranteMock} />);
    expect(screen.getByText('Lanches')).toBeInTheDocument();
  });

  it('deve ter link para a página do restaurante', () => {
    render(<CartaoRestaurante restaurante={restauranteMock} />);
    const link = screen.getByRole('link');
    expect(link.href).toContain('/restaurante/1');
  });

  it('deve mostrar badge de entrega grátis quando taxa é 0', () => {
    render(<CartaoRestaurante restaurante={{ ...restauranteMock, taxa_entrega: 0 }} />);
    expect(screen.getByText('Entrega Grátis')).toBeInTheDocument();
  });

  it('não deve mostrar badge de entrega grátis quando há taxa', () => {
    render(<CartaoRestaurante restaurante={restauranteMock} />);
    expect(screen.queryByText('Entrega Grátis')).not.toBeInTheDocument();
  });
});
