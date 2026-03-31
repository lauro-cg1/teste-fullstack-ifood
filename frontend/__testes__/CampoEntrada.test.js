import { render, screen, fireEvent } from '@testing-library/react';
import CampoEntrada from '../src/componentes/CampoEntrada/CampoEntrada';

describe('CampoEntrada', () => {
  it('deve renderizar o rótulo corretamente', () => {
    render(<CampoEntrada rotulo="E-mail" nome="email" />);
    expect(screen.getByText('E-mail')).toBeInTheDocument();
  });

  it('deve renderizar o placeholder', () => {
    render(<CampoEntrada placeholder="Digite aqui" nome="campo" />);
    expect(screen.getByPlaceholderText('Digite aqui')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro', () => {
    render(<CampoEntrada rotulo="Email" nome="email" erro="Email inválido" />);
    expect(screen.getByText('Email inválido')).toBeInTheDocument();
  });

  it('deve chamar aoMudar ao digitar', () => {
    const mockChange = jest.fn();
    render(<CampoEntrada nome="campo" aoMudar={mockChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'teste' } });
    expect(mockChange).toHaveBeenCalledTimes(1);
  });

  it('deve renderizar como tipo password', () => {
    const { container } = render(<CampoEntrada tipo="password" nome="senha" />);
    expect(container.querySelector('input[type="password"]')).toBeInTheDocument();
  });

  it('deve associar label ao input via htmlFor', () => {
    render(<CampoEntrada rotulo="Nome" nome="nome" />);
    const label = screen.getByText('Nome');
    expect(label.htmlFor).toBe('nome');
  });

  it('deve exibir valor controlado', () => {
    render(<CampoEntrada nome="campo" valor="valor inicial" aoMudar={() => {}} />);
    expect(screen.getByRole('textbox').value).toBe('valor inicial');
  });
});
