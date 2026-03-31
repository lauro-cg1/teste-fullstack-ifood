const AutenticacaoServico = require('../servicos/AutenticacaoServico');

class AutenticacaoControlador {
  static async cadastrar(req, res, next) {
    try {
      const resultado = await AutenticacaoServico.cadastrar(req.body);
      res.status(201).json({ sucesso: true, dados: resultado });
    } catch (erro) {
      next(erro);
    }
  }

  static async entrar(req, res, next) {
    try {
      const { email, senha } = req.body;
      const resultado = await AutenticacaoServico.entrar(email, senha);
      res.json({ sucesso: true, dados: resultado });
    } catch (erro) {
      next(erro);
    }
  }

  static async perfil(req, res, next) {
    try {
      const usuario = await AutenticacaoServico.obterPerfil(req.usuario.id);
      res.json({ sucesso: true, dados: usuario });
    } catch (erro) {
      next(erro);
    }
  }

  static async atualizarPerfil(req, res, next) {
    try {
      const usuario = await AutenticacaoServico.atualizarPerfil(req.usuario.id, req.body);
      res.json({ sucesso: true, dados: usuario });
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = AutenticacaoControlador;
