import CartaoProduto from './CartaoProduto';

export default {
  title: 'Componentes/CartaoProduto',
  component: CartaoProduto,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '600px' }}>
        <Story />
      </div>
    )
  ]
};

export const ProdutoPadrao = {
  args: {
    produto: {
      id: 1,
      nome: 'Whopper',
      descricao: 'Pão, carne grelhada, queijo, alface, tomate, cebola, picles e maionese',
      preco: 29.90,
      preco_promocional: null,
      imagem: null,
      destaque: false
    }
  }
};

export const ProdutoDestaque = {
  args: {
    produto: {
      id: 2,
      nome: 'Big Mac',
      descricao: 'Dois hambúrgueres, alface, queijo, molho especial, cebola e picles',
      preco: 32.90,
      preco_promocional: null,
      imagem: null,
      destaque: true
    }
  }
};

export const ComPromocao = {
  args: {
    produto: {
      id: 3,
      nome: 'Açaí 700ml Premium',
      descricao: 'Açaí com banana, morango, granola e leite condensado',
      preco: 28.90,
      preco_promocional: 22.90,
      imagem: null,
      destaque: false
    }
  }
};
