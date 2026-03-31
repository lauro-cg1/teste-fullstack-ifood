import FormularioEntrar from './FormularioEntrar';

export default {
  title: 'Componentes/FormularioEntrar',
  component: FormularioEntrar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    nextjs: { appDirectory: true }
  }
};

export const Padrao = {
  args: {
    carregando: false,
    aoSubmeter: (email, senha) => alert(`Login: ${email}`)
  }
};

export const Carregando = {
  args: {
    carregando: true,
    aoSubmeter: () => {}
  }
};
