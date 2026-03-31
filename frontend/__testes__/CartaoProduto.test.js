import { render, screen, fireEvent } from '@testing-library/react';
import CartaoProduto from '../src/componentes/CartaoProduto/CartaoProduto';

const produtoMock = {
  id: 1,
  nome: 'Whopper',
  descricao: 'Pão, carne grelhada, queijo, alface, tomate',
  preco: 29.90,
  preco_promocional: null,
  imagem: null,
  destaque: false
};

describe('CartaoProduto', () => {
  it('deve renderizar o nome do produto', () => {
    render(<CartaoProduto produto={produtoMock} />);
    expect(screen.getByText('Whopper')).toBeInTheDocument();
  });

  it('deve renderizar a descrição do produto', () => {
    render(<CartaoProduto produto={produtoMock} />);
    expect(screen.getByText(/Pão, carne grelhada/)).toBeInTheDocument();
  });

  it('deve renderizar o preço', () => {
    render(<CartaoProduto produto={produtoMock} />);
    expect(screen.getByText('R$ 29.90')).toBeInTheDocument();
  });

  it('deve exibir preço promocional quando disponível', () => {
    render(<CartaoProduto produto={{ ...produtoMock, preco_promocional: 22.90 }} />);
    expect(screen.getByText('R$ 22.90')).toBeInTheDocument();
    expect(screen.getByText('R$ 29.90')).toBeInTheDocument();
  });

  it('deve exibir badge de destaque quando destaque=true', () => {
    render(<CartaoProduto produto={{ ...produtoMock, destaque: true }} />);
    expect(screen.getByText('Mais Pedido')).toBeInTheDocument();
  });

  it('não deve exibir badge de destaque quando destaque=false', () => {
    render(<CartaoProduto produto={produtoMock} />);
    expect(screen.queryByText('Mais Pedido')).not.toBeInTheDocument();
  });

  it('deve chamar aoAdicionar ao clicar', () => {
    const mockAdicionar = jest.fn();
    render(<CartaoProduto produto={produtoMock} aoAdicionar={mockAdicionar} />);
    fireEvent.click(screen.getByText('Whopper').closest('div'));
    expect(mockAdicionar).toHaveBeenCalledWith(produtoMock);
  });

  it('deve mostrar placeholder quando não há imagem', () => {
    render(<CartaoProduto produto={produtoMock} />);
    expect(screen.getByText('🍽️')).toBeInTheDocument();
  });
});
