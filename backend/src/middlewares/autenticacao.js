const { verificarToken } = require('../utils/token');
const { Usuario } = require('../modelos/indice');

const autenticacao = async (req, res, next) => {
  try {
    const cabecalhoAuth = req.headers.authorization;

    if (!cabecalhoAuth || !cabecalhoAuth.startsWith('Bearer ')) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token de autenticação não fornecido'
      });
    }

    const token = cabecalhoAuth.split(' ')[1];
    const dadosDecodificados = verificarToken(token);

    const usuario = await Usuario.findByPk(dadosDecodificados.id, {
      attributes: { exclude: ['senha'] }
    });

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado ou inativo'
      });
    }

    req.usuario = usuario;
    next();
  } catch (erro) {
    return res.status(401).json({
      sucesso: false,
      mensagem: 'Token inválido ou expirado'
    });
  }
};

const autenticacaoOpcional = async (req, res, next) => {
  try {
    const cabecalhoAuth = req.headers.authorization;

    if (cabecalhoAuth && cabecalhoAuth.startsWith('Bearer ')) {
      const token = cabecalhoAuth.split(' ')[1];
      const dadosDecodificados = verificarToken(token);
      const usuario = await Usuario.findByPk(dadosDecodificados.id, {
        attributes: { exclude: ['senha'] }
      });
      if (usuario && usuario.ativo) {
        req.usuario = usuario;
      }
    }

    next();
  } catch (erro) {
    next();
  }
};

const apenasAdmin = (req, res, next) => {
  if (!req.usuario || !req.usuario.admin) {
    return res.status(403).json({ sucesso: false, mensagem: 'Acesso restrito a administradores' });
  }
  next();
};

module.exports = { autenticacao, autenticacaoOpcional, apenasAdmin };
