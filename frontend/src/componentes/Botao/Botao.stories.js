import Botao from './Botao';

export default {
  title: 'Componentes/Botao',
  component: Botao,
  tags: ['autodocs'],
  argTypes: {
    variante: {
      control: 'select',
      options: ['primario', 'secundario', 'fantasma']
    },
    tamanho: {
      control: 'select',
      options: ['pequeno', 'medio', 'grande']
    },
    cheio: { control: 'boolean' },
    desabilitado: { control: 'boolean' }
  }
};

export const Primario = {
  args: {
    children: 'Confirmar Pedido',
    variante: 'primario',
    tamanho: 'medio'
  }
};

export const Secundario = {
  args: {
    children: 'Ver cardápio',
    variante: 'secundario',
    tamanho: 'medio'
  }
};

export const Fantasma = {
  args: {
    children: 'Cancelar',
    variante: 'fantasma',
    tamanho: 'medio'
  }
};

export const Grande = {
  args: {
    children: 'Finalizar pedido',
    variante: 'primario',
    tamanho: 'grande'
  }
};

export const Pequeno = {
  args: {
    children: 'Adicionar',
    variante: 'primario',
    tamanho: 'pequeno'
  }
};

export const Desabilitado = {
  args: {
    children: 'Botão Desabilitado',
    desabilitado: true
  }
};

export const LarguraTotal = {
  args: {
    children: 'Entrar na conta',
    cheio: true,
    variante: 'primario'
  }
};
