import BannerPromocional from './BannerPromocional';

export default {
  title: 'Componentes/BannerPromocional',
  component: BannerPromocional,
  tags: ['autodocs'],
  parameters: { layout: 'padded' }
};

export const Padrao = {
  args: {
    titulo: 'Fome de quê?',
    descricao: 'Peça comida dos melhores restaurantes sem sair de casa',
    textoBotao: 'Ver restaurantes'
  }
};

export const EntregaGratis = {
  args: {
    titulo: 'Entrega grátis hoje!',
    descricao: 'Nos seus restaurantes favoritos, sem taxa de entrega',
    textoBotao: 'Aproveitar'
  }
};

export const SemBotao = {
  args: {
    titulo: 'Bem-vindo de volta!',
    descricao: 'Confira nossas novidades de hoje'
  }
};
