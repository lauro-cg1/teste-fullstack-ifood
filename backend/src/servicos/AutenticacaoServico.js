const { Usuario } = require('../modelos/indice');
const { criptografar, comparar } = require('../utils/criptografia');
const { gerarToken } = require('../utils/token');

class AutenticacaoServico {
  static async cadastrar(dados) {
    const usuarioExistente = await Usuario.findOne({ where: { email: dados.email } });

    if (usuarioExistente) {
      const erro = new Error('Email já cadastrado');
      erro.statusCode = 409;
      throw erro;
    }

    const senhaCriptografada = await criptografar(dados.senha);

    const usuario = await Usuario.create({
      ...dados,
      senha: senhaCriptografada
    });

    const token = gerarToken({ id: usuario.id, email: usuario.email });

    const usuarioSemSenha = usuario.toJSON();
    delete usuarioSemSenha.senha;

    return { usuario: usuarioSemSenha, token };
  }

  static async entrar(email, senha) {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      const erro = new Error('Email ou senha incorretos');
      erro.statusCode = 401;
      throw erro;
    }

    if (!usuario.ativo) {
      const erro = new Error('Conta desativada');
      erro.statusCode = 403;
      throw erro;
    }

    const senhaCorreta = await comparar(senha, usuario.senha);

    if (!senhaCorreta) {
      const erro = new Error('Email ou senha incorretos');
      erro.statusCode = 401;
      throw erro;
    }

    const token = gerarToken({ id: usuario.id, email: usuario.email });

    const usuarioSemSenha = usuario.toJSON();
    delete usuarioSemSenha.senha;

    return { usuario: usuarioSemSenha, token };
  }

  static async obterPerfil(usuarioId) {
    const usuario = await Usuario.findByPk(usuarioId, {
      attributes: { exclude: ['senha'] }
    });

    if (!usuario) {
      const erro = new Error('Usuário não encontrado');
      erro.statusCode = 404;
      throw erro;
    }

    return usuario;
  }

  static async atualizarPerfil(usuarioId, dados) {
    const usuario = await Usuario.findByPk(usuarioId);

    if (!usuario) {
      const erro = new Error('Usuário não encontrado');
      erro.statusCode = 404;
      throw erro;
    }

    if (dados.senha) {
      dados.senha = await criptografar(dados.senha);
    }

    await usuario.update(dados);

    const usuarioAtualizado = usuario.toJSON();
    delete usuarioAtualizado.senha;

    return usuarioAtualizado;
  }
}

module.exports = AutenticacaoServico;
