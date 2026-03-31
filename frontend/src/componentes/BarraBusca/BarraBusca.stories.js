import BarraBusca from './BarraBusca';

export default {
  title: 'Componentes/BarraBusca',
  component: BarraBusca,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    )
  ]
};

export const Padrao = {
  args: {
    placeholder: 'Busque por item ou loja'
  }
};

export const CustomPlaceholder = {
  args: {
    placeholder: 'Busque por restaurante ou prato'
  }
};
