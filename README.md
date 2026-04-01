# iFood Clone — Desafio FullStack

Clone das principais páginas e APIs do iFood.

---

## Tecnologias

### Backend
| Tecnologia | Uso |
|---|---|
| Node.js + Express | Servidor HTTP e roteamento |
| Sequelize + MySQL | ORM e banco de dados relacional |
| SQLite | Banco em memória para testes |
| JWT (jsonwebtoken) | Autenticação stateless |
| bcryptjs | Criptografia de senhas |
| Helmet | Headers de segurança HTTP |
| express-rate-limit | Proteção contra brute-force |
| express-validator | Validação de entradas |
| Swagger (swagger-jsdoc + swagger-ui-express) | Documentação da API |
| Jest + Supertest | Testes de integração |

### Frontend
| Tecnologia | Uso |
|---|---|
| Next.js 14 (App Router) | Framework React com SSR/CSR |
| React 18 | UI declarativa com hooks |
| Axios | Cliente HTTP |
| js-cookie | Gerenciamento de cookies (JWT) |
| react-hot-toast | Notificações |
| react-icons | Ícones SVG |
| CSS Modules | Estilos escopados por componente |
| Storybook 7 | Documentação visual de componentes |
| Jest + Testing Library | Testes unitários de componentes |

---

## Estrutura do Projeto

```
ifood-clone/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuração do banco e Swagger
│   │   ├── modelos/         # Modelos Sequelize (Usuario, Restaurante, Produto, Pedido, etc.)
│   │   ├── controladores/   # Controladores das rotas
│   │   ├── servicos/        # Regras de negócio
│   │   ├── rotas/           # Definição das rotas + JSDoc Swagger
│   │   ├── middlewares/     # Autenticação JWT, validação, tratamento de erros
│   │   └── utils/           # Token, criptografia, seeds, migrações
│   └── testes/              # Testes Jest + Supertest
└── frontend/
    ├── src/
    │   ├── app/             # Páginas Next.js (App Router)
    │   ├── componentes/     # Componentes React reutilizáveis
    │   ├── contextos/       # Context API (autenticação + carrinho)
    │   ├── hooks/           # Hooks customizados
    │   └── servicos/        # Camada de API (axios)
    ├── __testes__/          # Testes Jest + Testing Library
    └── .storybook/          # Configuração do Storybook
```

---

## Como Executar

### Pré-requisitos
- Node.js >= 18
- MySQL (ou usar SQLite para testes)

### Backend

```bash
cd ifood-clone/backend

# Instalar dependências
npm install

# Copiar e configurar variáveis de ambiente
cp env.exemplo .env
# Edite o .env com suas credenciais do MySQL

# Sincronizar banco e popular dados de exemplo
npm run semear

# Iniciar servidor de desenvolvimento
npm run dev

# Executar testes
npm run testar

# Gerar cobertura de testes
npm run testar -- --coverage
```

O servidor sobe em `http://localhost:3001`
Documentação Swagger: `http://localhost:3001/api/documentacao`

### Frontend

```bash
cd ifood-clone/frontend

# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp env.local.exemplo .env.local

# Iniciar em desenvolvimento
npm run dev

# Executar testes
npm run testar

# Iniciar Storybook
npm run storybook

# Gerar build de produção
npm run build
```

O frontend sobe em `http://localhost:3000`
Storybook em `http://localhost:6006`

---

## Endpoints da API

### Autenticação
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/api/autenticacao/cadastrar` | Cadastrar usuário | ❌ |
| POST | `/api/autenticacao/entrar` | Login | ❌ |
| GET | `/api/autenticacao/perfil` | Ver perfil | ✅ |
| PUT | `/api/autenticacao/perfil` | Atualizar perfil | ✅ |

### Restaurantes
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/api/restaurantes` | Listar (paginado, filtros) | ❌ |
| GET | `/api/restaurantes/:id` | Detalhes + cardápio | ❌ |
| POST | `/api/restaurantes` | Criar restaurante | ✅ |
| PUT | `/api/restaurantes/:id` | Atualizar restaurante | ✅ |
| DELETE | `/api/restaurantes/:id` | Remover (soft delete) | ✅ |

### Categorias
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/api/categorias` | Listar todas | ❌ |
| GET | `/api/categorias/:id` | Detalhes | ❌ |
| POST | `/api/categorias` | Criar | ✅ |
| PUT | `/api/categorias/:id` | Atualizar | ✅ |

### Produtos
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/api/produtos/buscar` | Busca de produtos | ❌ |
| GET | `/api/produtos/restaurante/:id` | Cardápio do restaurante | ❌ |
| GET | `/api/produtos/:id` | Detalhes do produto | ❌ |
| POST | `/api/produtos` | Criar produto | ✅ |
| PUT | `/api/produtos/:id` | Atualizar produto | ✅ |
| DELETE | `/api/produtos/:id` | Remover (soft delete) | ✅ |

### Pedidos
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/api/pedidos` | Criar pedido | ✅ |
| GET | `/api/pedidos/meus` | Listar meus pedidos | ✅ |
| GET | `/api/pedidos/:id` | Detalhes do pedido | ✅ |
| PATCH | `/api/pedidos/:id/status` | Atualizar status | ✅ |
| PATCH | `/api/pedidos/:id/cancelar` | Cancelar pedido | ✅ |

---

## Funcionalidades Implementadas

### Backend
- [x] CRUD completo de restaurantes, produtos, categorias e pedidos
- [x] Autenticação e autorização com JWT
- [x] Hash de senhas com bcryptjs
- [x] Rate limiting
- [x] Headers de segurança com Helmet
- [x] Validação de entrada com express-validator
- [x] Tratamento centralizado de erros
- [x] Soft delete em restaurantes e produtos
- [x] Paginação em listagens
- [x] Transações de banco para criação de pedidos
- [x] Filtros por categoria, busca por nome e ordenação
- [x] Documentação Swagger gerada automaticamente
- [x] Testes de integração com Jest + Supertest (autenticação, restaurantes, pedidos)
- [x] Seed de dados de exemplo

### Frontend
- [x] Página inicial com listagem de restaurantes
- [x] Filtro por categoria com scroll horizontal
- [x] Busca por restaurante/produto
- [x] Ordenação por avaliação, entrega e tempo
- [x] Paginação
- [x] Página de detalhes do restaurante com cardápio por categorias
- [x] Carrinho de compras com Context API e localStorage
- [x] Página de checkout com seleção de endereço e forma de pagamento
- [x] Página de pedidos do usuário com cancelamento
- [x] Login e cadastro com JWT
- [x] Rotas protegidas por autenticação
- [x] Responsivo para mobile e desktop
- [x] Design system com CSS Modules e variáveis CSS
- [x] Storybook com stories para todos os componentes
- [x] Testes unitários com Jest + Testing Library

---

## Deploy
### AWS — Backend (EC2 + RDS (Servidor MySQL) + EB)
http://ifood-clone-backend-prod-env-1.eba-3svxwcd6.us-east-2.elasticbeanstalk.com/

### AWS — Frontend (Amplify)

https://main.d3ok36v2okd2fu.amplifyapp.com/

Usuários de teste:
joao@email.com:123456
maria@email.com:123456

Administrador de teste (página do admin simula pedidos recebidos pelo restaurante):
admin@ifood.com:123456

---

## Modelos do Banco de Dados

```
usuarios           → id, nome, email, senha, telefone, endereco, imagem, ativo
categorias         → id, nome, imagem, ativo
restaurantes       → id, nome, descricao, imagem, imagem_capa, categoria_id, endereco, telefone, taxa_entrega, tempo_entrega_min, tempo_entrega_max, avaliacao, total_avaliacoes, pedido_minimo, horario_abertura, horario_fechamento, ativo
produtos           → id, nome, descricao, preco, preco_promocional, imagem, restaurante_id, categoria_produto, disponivel, destaque
pedidos            → id, usuario_id, restaurante_id, status, subtotal, taxa_entrega, total, endereco_entrega, forma_pagamento, observacoes
itens_pedido       → id, pedido_id, produto_id, quantidade, preco_unitario, subtotal, observacoes
```

---

