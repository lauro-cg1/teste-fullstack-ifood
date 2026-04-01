import './globals.css';
import { AutenticacaoProvedor } from '../contextos/AutenticacaoContexto';
import { CarrinhoProvedor } from '../contextos/CarrinhoContexto';
import Cabecalho from '../componentes/Cabecalho/Cabecalho';
import Rodape from '../componentes/Rodape/Rodape';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'iFood Clone',
  description: 'Clone do iFood - Peça comida online',
  icons: {
    icon: 'https://imagensfree.com.br/wp-content/uploads/2021/11/icone-ifood.png',
    shortcut: 'https://imagensfree.com.br/wp-content/uploads/2021/11/icone-ifood.png',
    apple: 'https://imagensfree.com.br/wp-content/uploads/2021/11/icone-ifood.png'
  }
};

export default function LayoutRaiz({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AutenticacaoProvedor>
          <CarrinhoProvedor>
            <Toaster position="top-right" />
            <Cabecalho />
            <main style={{ minHeight: 'calc(100vh - 140px)', paddingTop: '70px', maxWidth: '100vw', overflowX: 'hidden' }}>
              {children}
            </main>
            <Rodape />
          </CarrinhoProvedor>
        </AutenticacaoProvedor>
      </body>
    </html>
  );
}
