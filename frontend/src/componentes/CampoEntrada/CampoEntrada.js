import estilos from './CampoEntrada.module.css';

export default function CampoEntrada({
  rotulo,
  tipo = 'text',
  placeholder,
  valor,
  aoMudar,
  erro,
  nome,
  obrigatorio = false,
  ...props
}) {
  return (
    <div className={`${estilos.campo} ${erro ? estilos.erro : ''}`}>
      {rotulo && (
        <label className={estilos.rotulo} htmlFor={nome}>
          {rotulo}
        </label>
      )}
      <input
        id={nome}
        name={nome}
        type={tipo}
        placeholder={placeholder}
        value={valor}
        onChange={aoMudar}
        required={obrigatorio}
        className={estilos.entrada}
        {...props}
      />
      {erro && <span className={estilos.mensagemErro}>{erro}</span>}
    </div>
  );
}
