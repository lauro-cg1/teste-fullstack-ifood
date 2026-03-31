import { render, screen, fireEvent } from '@testing-library/react';
import BarraBusca from '../src/componentes/BarraBusca/BarraBusca';

describe('BarraBusca', () => {
  it('deve renderizar o placeholder padrão', () => {
    render(<BarraBusca />);
    expect(screen.getByPlaceholderText('Busque por item ou loja')).toBeInTheDocument();
  });

  it('deve renderizar placeholder customizado', () => {
    render(<BarraBusca placeholder="Buscar restaurantes" />);
    expect(screen.getByPlaceholderText('Buscar restaurantes')).toBeInTheDocument();
  });

  it('deve chamar aoBuscar ao submeter o formulário', () => {
    const mockBuscar = jest.fn();
    render(<BarraBusca aoBuscar={mockBuscar} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'pizza' } });
    fireEvent.submit(input.closest('form'));
    expect(mockBuscar).toHaveBeenCalledWith('pizza');
  });

  it('deve exibir botão de limpar quando há texto', () => {
    render(<BarraBusca />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'sushi' } });
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('deve limpar o campo ao clicar no botão X', () => {
    const mockBuscar = jest.fn();
    render(<BarraBusca aoBuscar={mockBuscar} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'burger' } });
    const botaoLimpar = screen.getByRole('button');
    fireEvent.click(botaoLimpar);
    expect(input.value).toBe('');
    expect(mockBuscar).toHaveBeenCalledWith('');
  });

  it('não deve submeter com campo vazio', () => {
    const mockBuscar = jest.fn();
    render(<BarraBusca aoBuscar={mockBuscar} />);
    const input = screen.getByRole('textbox');
    fireEvent.submit(input.closest('form'));
    expect(mockBuscar).not.toHaveBeenCalled();
  });
});
