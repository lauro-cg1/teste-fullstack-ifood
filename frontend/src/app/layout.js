import './globals.css';
import { AutenticacaoProvedor } from '../contextos/AutenticacaoContexto';
import { CarrinhoProvedor } from '../contextos/CarrinhoContexto';
import Cabecalho from '../componentes/Cabecalho/Cabecalho';
import Rodape from '../componentes/Rodape/Rodape';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'iFood Clone',
  description: 'Clone do iFood - Peça comida online',
};

export default function LayoutRaiz({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AutenticacaoProvedor>
          <CarrinhoProvedor>
            <Toaster position="top-right" />
            <Cabecalho />
            <main style={{ minHeight: 'calc(100vh - 140px)', paddingTop: '70px' }}>
              {children}
            </main>
            <Rodape />
          </CarrinhoProvedor>
        </AutenticacaoProvedor>
      </body>
    </html>
  );
}
