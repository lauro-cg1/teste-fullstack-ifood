import Carrinho from './Carrinho';
import { CarrinhoProvedor } from '../../contextos/CarrinhoContexto';
import { AutenticacaoProvedor } from '../../contextos/AutenticacaoContexto';

export default {
  title: 'Componentes/Carrinho',
  component: Carrinho,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <AutenticacaoProvedor>
        <CarrinhoProvedor>
          <div style={{ maxWidth: '380px', margin: '0 auto' }}>
            <Story />
          </div>
        </CarrinhoProvedor>
      </AutenticacaoProvedor>
    )
  ],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light'
    }
  }
};

export const Vazio = {
  args: {}
};

export const ComItens = {
  decorators: [
    (Story) => {
      if (typeof window !== 'undefined') {
        const carrinhoMock = {
          itens: [
            {
              produto: { id: 1, nome: 'Whopper', preco: 32.90 },
              quantidade: 2
            },
            {
              produto: { id: 2, nome: 'Batata Frita M', preco: 10.90 },
              quantidade: 1
            }
          ],
          restaurante: { id: 1, nome: 'Burger King', taxa_entrega: 5.99 }
        };
        localStorage.setItem('ifood_carrinho', JSON.stringify(carrinhoMock));
      }
      return (
        <AutenticacaoProvedor>
          <CarrinhoProvedor>
            <div style={{ maxWidth: '380px', margin: '0 auto' }}>
              <Story />
            </div>
          </CarrinhoProvedor>
        </AutenticacaoProvedor>
      );
    }
  ]
};
