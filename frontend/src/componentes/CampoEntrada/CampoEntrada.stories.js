import CampoEntrada from './CampoEntrada';

export default {
  title: 'Componentes/CampoEntrada',
  component: CampoEntrada,
  tags: ['autodocs'],
  argTypes: {
    tipo: {
      control: 'select',
      options: ['text', 'email', 'password', 'tel', 'number']
    }
  }
};

export const PadraoTexto = {
  args: {
    rotulo: 'Nome completo',
    nome: 'nome',
    placeholder: 'Seu nome aqui',
    tipo: 'text'
  }
};

export const CampoEmail = {
  args: {
    rotulo: 'E-mail',
    nome: 'email',
    placeholder: 'seu@email.com',
    tipo: 'email'
  }
};

export const CampoSenha = {
  args: {
    rotulo: 'Senha',
    nome: 'senha',
    placeholder: 'Mínimo 6 caracteres',
    tipo: 'password'
  }
};

export const ComErro = {
  args: {
    rotulo: 'E-mail',
    nome: 'email',
    placeholder: 'seu@email.com',
    tipo: 'email',
    valor: 'email_invalido',
    erro: 'E-mail inválido'
  }
};

export const Obrigatorio = {
  args: {
    rotulo: 'Telefone',
    nome: 'telefone',
    placeholder: '(11) 99999-9999',
    obrigatorio: true
  }
};
