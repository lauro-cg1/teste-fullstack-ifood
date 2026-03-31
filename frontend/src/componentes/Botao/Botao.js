import estilos from './Botao.module.css';

export default function Botao({
  children,
  variante = 'primario',
  tamanho = 'medio',
  cheio = false,
  desabilitado = false,
  tipo = 'button',
  aoClicar,
  ...props
}) {
  const classes = [
    estilos.botao,
    estilos[variante],
    estilos[tamanho],
    cheio && estilos.cheio,
    desabilitado && estilos.desabilitado
  ].filter(Boolean).join(' ');

  return (
    <button
      type={tipo}
      className={classes}
      disabled={desabilitado}
      onClick={aoClicar}
      {...props}
    >
      {children}
    </button>
  );
}
