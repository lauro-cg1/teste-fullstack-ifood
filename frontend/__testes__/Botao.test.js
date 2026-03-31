import { render, screen, fireEvent } from '@testing-library/react';
import Botao from '../src/componentes/Botao/Botao';

describe('Botao', () => {
  it('deve renderizar o texto corretamente', () => {
    render(<Botao>Confirmar</Botao>);
    expect(screen.getByText('Confirmar')).toBeInTheDocument();
  });

  it('deve aplicar a classe primario por padrão', () => {
    const { container } = render(<Botao>Primário</Botao>);
    expect(container.firstChild.className).toContain('primario');
  });

  it('deve aplicar a variante secundario quando informada', () => {
    const { container } = render(<Botao variante="secundario">Secundário</Botao>);
    expect(container.firstChild.className).toContain('secundario');
  });

  it('deve chamar aoClicar quando clicado', () => {
    const mockClick = jest.fn();
    render(<Botao aoClicar={mockClick}>Clique</Botao>);
    fireEvent.click(screen.getByText('Clique'));
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('deve estar desabilitado quando desabilitado=true', () => {
    render(<Botao desabilitado>Desabilitado</Botao>);
    expect(screen.getByText('Desabilitado')).toBeDisabled();
  });

  it('deve não chamar aoClicar quando desabilitado', () => {
    const mockClick = jest.fn();
    render(<Botao desabilitado aoClicar={mockClick}>Desabilitado</Botao>);
    fireEvent.click(screen.getByText('Desabilitado'));
    expect(mockClick).not.toHaveBeenCalled();
  });

  it('deve ter largura total quando cheio=true', () => {
    const { container } = render(<Botao cheio>Cheio</Botao>);
    expect(container.firstChild.className).toContain('cheio');
  });

  it('deve ter tipo submit quando informado', () => {
    render(<Botao tipo="submit">Enviar</Botao>);
    expect(screen.getByText('Enviar').type).toBe('submit');
  });

  it('deve aplicar tamanho grande quando informado', () => {
    const { container } = render(<Botao tamanho="grande">Grande</Botao>);
    expect(container.firstChild.className).toContain('grande');
  });

  it('deve aplicar tamanho pequeno quando informado', () => {
    const { container } = render(<Botao tamanho="pequeno">Pequeno</Botao>);
    expect(container.firstChild.className).toContain('pequeno');
  });
});
