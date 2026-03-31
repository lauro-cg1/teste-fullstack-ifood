import CartaoRestaurante from './CartaoRestaurante';

export default {
  title: 'Componentes/CartaoRestaurante',
  component: CartaoRestaurante,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    nextjs: { appDirectory: true }
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    )
  ]
};

const restaurantePadrao = {
  id: 1,
  nome: 'Burger King',
  descricao: 'Hambúrgueres grelhados como você gosta',
  imagem: null,
  taxa_entrega: 5.99,
  tempo_entrega_min: 25,
  tempo_entrega_max: 40,
  avaliacao: 4.5,
  total_avaliacoes: 1250,
  categoria: { id: 1, nome: 'Lanches' }
};

export const Padrao = {
  args: { restaurante: restaurantePadrao }
};

export const EntregaGratis = {
  args: {
    restaurante: {
      ...restaurantePadrao,
      nome: 'Pizza Hut',
      taxa_entrega: 0,
      avaliacao: 4.8,
      categoria: { id: 2, nome: 'Pizza' }
    }
  }
};

export const AvaliacaoAlta = {
  args: {
    restaurante: {
      ...restaurantePadrao,
      nome: 'Sushi Premium',
      avaliacao: 4.9,
      total_avaliacoes: 3200,
      taxa_entrega: 12.99,
      tempo_entrega_min: 40,
      tempo_entrega_max: 60,
      categoria: { id: 3, nome: 'Japonesa' }
    }
  }
};
