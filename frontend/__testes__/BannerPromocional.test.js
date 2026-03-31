import { render, screen, fireEvent } from '@testing-library/react';
import BannerPromocional from '../src/componentes/BannerPromocional/BannerPromocional';

describe('BannerPromocional', () => {
  it('deve renderizar o título', () => {
    render(<BannerPromocional titulo="Fome de quê?" />);
    expect(screen.getByText('Fome de quê?')).toBeInTheDocument();
  });

  it('deve renderizar a descrição', () => {
    render(<BannerPromocional descricao="Peça agora mesmo" />);
    expect(screen.getByText('Peça agora mesmo')).toBeInTheDocument();
  });

  it('deve renderizar o botão quando textoBotao é fornecido', () => {
    render(<BannerPromocional textoBotao="Ver mais" aoClicar={() => {}} />);
    expect(screen.getByText('Ver mais')).toBeInTheDocument();
  });

  it('não deve renderizar o botão quando textoBotao não é fornecido', () => {
    render(<BannerPromocional titulo="Título" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('deve chamar aoClicar ao clicar no botão', () => {
    const mockClicar = jest.fn();
    render(<BannerPromocional textoBotao="Clique aqui" aoClicar={mockClicar} />);
    fireEvent.click(screen.getByText('Clique aqui'));
    expect(mockClicar).toHaveBeenCalledTimes(1);
  });

  it('deve usar título padrão quando não fornecido', () => {
    render(<BannerPromocional />);
    expect(screen.getByText('Fome de quê?')).toBeInTheDocument();
  });
});
