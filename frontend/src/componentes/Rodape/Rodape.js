import Link from 'next/link';
import estilos from './Rodape.module.css';

export default function Rodape() {
  return (
    <footer className={estilos.rodape}>
      <div className={estilos.rodapeConteudo}>
        <div className={estilos.rodapeSecao}>
          <h4>iFood Clone</h4>
          <ul>
            <li><Link href="/">Sobre nós</Link></li>
            <li><Link href="/">Carreiras</Link></li>
            <li><Link href="/">iFood Card</Link></li>
          </ul>
        </div>
        <div className={estilos.rodapeSecao}>
          <h4>Descubra</h4>
          <ul>
            <li><Link href="/">Cadastre seu restaurante</Link></li>
            <li><Link href="/">Entregador</Link></li>
            <li><Link href="/">iFood Benefícios</Link></li>
          </ul>
        </div>
        <div className={estilos.rodapeSecao}>
          <h4>Suporte</h4>
          <ul>
            <li><Link href="/">Ajuda</Link></li>
            <li><Link href="/">Termos de uso</Link></li>
            <li><Link href="/">Privacidade</Link></li>
          </ul>
        </div>
        <div className={estilos.rodapeSecao}>
          <h4>Social</h4>
          <ul>
            <li><Link href="/">Instagram</Link></li>
            <li><Link href="/">Facebook</Link></li>
            <li><Link href="/">Twitter</Link></li>
          </ul>
        </div>
      </div>
      <hr className={estilos.rodapeDivisor} />
      <p className={estilos.rodapeCopy}>
        Desenvolvido por Lauro Gonçalves
      </p>
    </footer>
  );
}
