const tratarErros = (erro, req, res, next) => {
  console.error('Erro:', erro);

  if (erro.name === 'SequelizeValidationError') {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'Erro de validação',
      erros: erro.errors.map(e => ({ campo: e.path, mensagem: e.message }))
    });
  }

  if (erro.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      sucesso: false,
      mensagem: 'Registro já existe',
      erros: erro.errors.map(e => ({ campo: e.path, mensagem: e.message }))
    });
  }

  if (erro.name === 'JsonWebTokenError') {
    return res.status(401).json({
      sucesso: false,
      mensagem: 'Token inválido'
    });
  }

  if (erro.name === 'TokenExpiredError') {
    return res.status(401).json({
      sucesso: false,
      mensagem: 'Token expirado'
    });
  }

  const statusCode = erro.statusCode || 500;
  const mensagem = erro.mensagem || erro.message || 'Erro interno do servidor';

  res.status(statusCode).json({
    sucesso: false,
    mensagem
  });
};

module.exports = tratarErros;
