import Cabecalho from './Cabecalho';
import { CarrinhoProvedor } from '../../contextos/CarrinhoContexto';
import { AutenticacaoProvedor } from '../../contextos/AutenticacaoContexto';

export default {
  title: 'Componentes/Cabecalho',
  component: Cabecalho,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <AutenticacaoProvedor>
        <CarrinhoProvedor>
          <Story />
        </CarrinhoProvedor>
      </AutenticacaoProvedor>
    )
  ],
  parameters: {
    layout: 'fullscreen'
  }
};

export const Deslogado = {
  args: {}
};

export const ComItensNoCarrinho = {
  decorators: [
    (Story) => {
      if (typeof window !== 'undefined') {
        const carrinhoMock = {
          itens: [
            { produto: { id: 1, nome: 'Whopper', preco: 32.90 }, quantidade: 2 },
            { produto: { id: 2, nome: 'Batata Frita', preco: 10.90 }, quantidade: 1 }
          ],
          restaurante: { id: 1, nome: 'Burger King', taxa_entrega: 5.99 }
        };
        localStorage.setItem('ifood_carrinho', JSON.stringify(carrinhoMock));
      }
      return (
        <AutenticacaoProvedor>
          <CarrinhoProvedor>
            <Story />
          </CarrinhoProvedor>
        </AutenticacaoProvedor>
      );
    }
  ]
};

export const Mobile = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
};
