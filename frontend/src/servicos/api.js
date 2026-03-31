import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/entrar')) {
        window.location.href = '/entrar';
      }
    }
    return Promise.reject(error);
  }
);

export const obterBaseUrlApi = () => api.defaults.baseURL;

export const AutenticacaoAPI = {
  cadastrar: (dados) => api.post('/autenticacao/cadastrar', dados),
  entrar: (dados) => api.post('/autenticacao/entrar', dados),
  perfil: () => api.get('/autenticacao/perfil'),
  atualizarPerfil: (dados) => api.put('/autenticacao/perfil', dados)
};

export const RestauranteAPI = {
  listarTodos: (params) => api.get('/restaurantes', { params }),
  obterPorId: (id) => api.get(`/restaurantes/${id}`)
};

export const CategoriaAPI = {
  listarTodas: () => api.get('/categorias')
};

export const ProdutoAPI = {
  listarPorRestaurante: (restauranteId) => api.get(`/produtos/restaurante/${restauranteId}`),
  buscar: (params) => api.get('/produtos/buscar', { params }),
  obterPorId: (id) => api.get(`/produtos/${id}`)
};

export const PedidoAPI = {
  criar: (dados) => api.post('/pedidos', dados),
  listarMeus: (params) => api.get('/pedidos/meus', { params }),
  listarTodos: (params) => api.get('/pedidos', { params }),
  obterPorId: (id) => api.get(`/pedidos/${id}`),
  atualizarStatus: (id, status) => api.patch(`/pedidos/${id}/status`, { status }),
  cancelar: (id) => api.patch(`/pedidos/${id}/cancelar`)
};

export default api;
