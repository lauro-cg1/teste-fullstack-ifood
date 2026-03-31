require('dotenv').config();
const { sequelize, Usuario, Categoria, Restaurante, Produto } = require('../modelos/indice');
const { criptografar } = require('./criptografia');

const semear = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Tabelas recriadas.');

    const senhaCriptografada = await criptografar('123456');

    await Usuario.bulkCreate([
      { nome: 'Admin', email: 'admin@ifood.com', senha: senhaCriptografada, telefone: '11999999999', endereco: 'Administração', admin: true },
      { nome: 'João Silva', email: 'joao@email.com', senha: senhaCriptografada, telefone: '11999999999', endereco: 'Rua das Flores, 123 - São Paulo' },
      { nome: 'Maria Santos', email: 'maria@email.com', senha: senhaCriptografada, telefone: '11988888888', endereco: 'Av. Paulista, 1000 - São Paulo' }
    ]);
    console.log('Usuários criados.');

    const categorias = await Categoria.bulkCreate([
      { nome: 'Lanches', imagem: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&h=120&fit=crop' },
      { nome: 'Pizza', imagem: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&h=120&fit=crop' },
      { nome: 'Japonesa', imagem: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=120&h=120&fit=crop' },
      { nome: 'Brasileira', imagem: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=120&h=120&fit=crop' },
      { nome: 'Açaí', imagem: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=120&h=120&fit=crop' },
      { nome: 'Doces', imagem: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=120&h=120&fit=crop' },
      { nome: 'Saudável', imagem: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120&h=120&fit=crop' },
      { nome: 'Árabe', imagem: 'https://images.unsplash.com/photo-1561043433-aaf687c4cf04?w=120&h=120&fit=crop' },
      { nome: 'Chinesa', imagem: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=120&h=120&fit=crop' },
      { nome: 'Italiana', imagem: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&h=120&fit=crop' }
    ]);
    console.log('Categorias criadas.');

    const restaurantes = await Restaurante.bulkCreate([
      {
        nome: 'Hondai Japanese',
        descricao: 'Culinária japonesa autêntica em Barão Geraldo. Sushis, temakis e pratos quentes preparados com ingredientes frescos e selecionados.',
        imagem: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=200&fit=crop',
        imagem_capa: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&h=400&fit=crop',
        categoria_id: categorias[2].id,
        endereco: 'Av. Dr. Luís Teixeira Mendes, 412 - Barão Geraldo, Campinas',
        telefone: '1932899999',
        taxa_entrega: 6.99,
        tempo_entrega_min: 35,
        tempo_entrega_max: 55,
        avaliacao: 4.8,
        total_avaliacoes: 643,
        pedido_minimo: 40.00,
        horario_abertura: '11:30',
        horario_fechamento: '22:30'
      },
      {
        nome: 'Nosso Açaí',
        descricao: 'O melhor açaí de Campinas, batido na hora com frutas frescas e coberturas especiais. Direto da nossa família para a sua!',
        imagem: 'https://bhacaiesorvetesmc.meucatalogofacil.com/_core/_uploads/56/2021/08/1145070821fa1bjcicek.jpg',
        imagem_capa: 'https://bhacaiesorvetesmc.meucatalogofacil.com/_core/_uploads/56/2021/08/1145070821fa1bjcicek.jpg?w=1200&h=400&fit=crop',
        categoria_id: categorias[4].id,
        endereco: 'R. Crócio, 82 - Barão Geraldo, Campinas',
        telefone: '1933001122',
        taxa_entrega: 3.99,
        tempo_entrega_min: 15,
        tempo_entrega_max: 30,
        avaliacao: 4.7,
        total_avaliacoes: 389,
        pedido_minimo: 18.00,
        horario_abertura: '09:00',
        horario_fechamento: '22:00'
      },
      {
        nome: 'Bardana Restaurante',
        descricao: 'Self service com opções variadas de pratos quentes, saladas e sobremesas. Comida caseira e saborosa no peso certo para você.',
        imagem: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop',
        imagem_capa: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=400&fit=crop',
        categoria_id: categorias[6].id,
        endereco: 'R. Roxo Moreira, 1091 - Barão Geraldo, Campinas',
        telefone: '1932113344',
        taxa_entrega: 4.99,
        tempo_entrega_min: 30,
        tempo_entrega_max: 50,
        avaliacao: 4.6,
        total_avaliacoes: 512,
        pedido_minimo: 25.00,
        horario_abertura: '11:00',
        horario_fechamento: '15:00'
      },
      {
        nome: 'O Matuto Churrascaria',
        descricao: 'Churrasco de verdade, do jeito que o interior gosta. Carnes nobres na brasa, acompanhamentos caprichados e muito sabor em cada pedaço.',
        imagem: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=200&fit=crop',
        imagem_capa: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=400&fit=crop',
        categoria_id: categorias[3].id,
        endereco: 'Av. Albino J. B. de Oliveira, 900 - Barão Geraldo, Campinas',
        telefone: '1932445566',
        taxa_entrega: 7.99,
        tempo_entrega_min: 40,
        tempo_entrega_max: 60,
        avaliacao: 4.7,
        total_avaliacoes: 728,
        pedido_minimo: 35.00,
        horario_abertura: '11:00',
        horario_fechamento: '23:00'
      },
      {
        nome: 'Burger King',
        descricao: 'Hambúrgueres grelhados no fogo como você gosta. O sabor inconfundível do Whopper e muito mais esperando por você.',
        imagem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Burger_King_2020.svg/250px-Burger_King_2020.svg.png?w=400&h=200&fit=crop',
        imagem_capa: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&h=400&fit=crop',
        categoria_id: categorias[0].id,
        endereco: 'Av. João Jorge, 900 - Centro, Campinas',
        telefone: '1940028922',
        taxa_entrega: 5.99,
        tempo_entrega_min: 25,
        tempo_entrega_max: 40,
        avaliacao: 4.4,
        total_avaliacoes: 1837,
        pedido_minimo: 15.00,
        horario_abertura: '10:00',
        horario_fechamento: '23:00'
      },
      {
        nome: "McDonald's",
        descricao: 'Amo muito tudo isso! Big Mac, McChicken, batata frita crocante e muito mais para o seu dia ficar mais gostoso.',
        imagem: 'https://franquias360.com.br/wp-content/uploads/2024/03/mc-donalds-logo.png?w=400&h=200&fit=crop',
        imagem_capa: 'https://images.unsplash.com/photo-1610614991750-5c7ec8dc5987?w=1200&h=400&fit=crop',
        categoria_id: categorias[0].id,
        endereco: 'Shopping Iguatemi Campinas - Av. Hav. Leste, 800',
        telefone: '1940028923',
        taxa_entrega: 7.99,
        tempo_entrega_min: 20,
        tempo_entrega_max: 35,
        avaliacao: 4.3,
        total_avaliacoes: 3104,
        pedido_minimo: 20.00,
        horario_abertura: '06:00',
        horario_fechamento: '00:00'
      },
      {
        nome: 'Pizza Hut',
        descricao: 'A pizza favorita do Brasil! Massa fresca, molho especial e ingredientes selecionados em pizzas que só a Pizza Hut sabe fazer.',
        imagem: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjxR4db7OkAuEjQJS1GhK7n3LLgBI3oO2MiFzFfGIZ5lHDq8zEkgOTB-5MTaxN2lkDEIj0gS_iHEWpwWhVJSYhQ1bSWPvBCeT_ZWDvoUEgtrQ6FY_y6WL5hD2hhIXJb1v4J9g1S/s16000/pizza+logo+1.jpg?w=400&h=200&fit=crop',
        imagem_capa: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1200&h=400&fit=crop',
        categoria_id: categorias[1].id,
        endereco: 'Shopping Campinas - Av. Guilherme Campos, 500',
        telefone: '1940028924',
        taxa_entrega: 0.00,
        tempo_entrega_min: 35,
        tempo_entrega_max: 55,
        avaliacao: 4.6,
        total_avaliacoes: 1092,
        pedido_minimo: 30.00,
        horario_abertura: '11:00',
        horario_fechamento: '23:30'
      }
    ]);
    console.log('Restaurantes criados.');

    const IMG_JAPONES = 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/30/2f/cf/buffet.jpg?w=900&h=500&s=1';
    const IMG_ACAI = 'https://static.casaebar.com.br/public/casaebar/imagens/produtos/tigela-cereais-acai-500ml-682e025661b1d.png';
    const IMG_BRASILEIRA = 'https://lirp.cdn-website.com/33406c6e/dms3rep/multi/opt/Mudan%C3%A7a-no-estilo-de-servi%C3%A7o-quando-%C3%A9-necess%C3%A1rio-e-como-faz%C3%AA-la-1920w.jpg';
    const IMG_CHURRASCO = 'https://supermercadosrondon.com.br/guiadecarnes/images/postagens/as_7_melhores_carnes_para_churrasco_21-05-2019.jpg';
    const IMG_HAMBURGUER = 'https://www.infomoney.com.br/wp-content/uploads/2025/02/bigmac.png?fit=450%2C305&quality=70&strip=all';
    const IMG_PIZZA = 'https://upload.wikimedia.org/wikipedia/commons/9/91/Pizza-3007395.jpg';

    await Produto.bulkCreate([

      { nome: 'Combo Sushi 20 peças', descricao: 'Mix de nigiris, uramakis e sashimis variados', preco: 69.90, imagem: IMG_JAPONES, restaurante_id: restaurantes[0].id, categoria_produto: 'Combos', destaque: true },
      { nome: 'Combo Sushi 30 peças', descricao: '30 peças variadas: salmão, atum, camarão e vegetariano', preco: 94.90, imagem: IMG_JAPONES, restaurante_id: restaurantes[0].id, categoria_produto: 'Combos' },
      { nome: 'Temaki Salmão', descricao: 'Temaki de salmão fresco com cream cheese e cebolinha', preco: 29.90, imagem: IMG_JAPONES, restaurante_id: restaurantes[0].id, categoria_produto: 'Temakis', destaque: true },
      { nome: 'Temaki Atum', descricao: 'Temaki de atum com pepino e molho tarê', preco: 29.90, imagem: IMG_JAPONES, restaurante_id: restaurantes[0].id, categoria_produto: 'Temakis' },
      { nome: 'Hot Roll 10un', descricao: 'Hot roll empanado de salmão com cream cheese', preco: 36.90, imagem: IMG_JAPONES, restaurante_id: restaurantes[0].id, categoria_produto: 'Hot Rolls' },
      { nome: 'Yakisoba de Frango', descricao: 'Macarrão yakisoba com frango, legumes e molho shoyu', preco: 38.90, imagem: IMG_JAPONES, restaurante_id: restaurantes[0].id, categoria_produto: 'Pratos Quentes' },
      { nome: 'Missoshiru', descricao: 'Sopa de missô tradicional com tofu e alga wakame', preco: 12.90, imagem: IMG_JAPONES, restaurante_id: restaurantes[0].id, categoria_produto: 'Sopas' },
      { nome: 'Soda Japonesa', descricao: 'Ramune sabor melancia, morango ou laranja', preco: 11.90, imagem: IMG_JAPONES, restaurante_id: restaurantes[0].id, categoria_produto: 'Bebidas' },

      { nome: 'Açaí 300ml', descricao: 'Açaí puro batido na hora, consistência cremosa', preco: 14.90, imagem: IMG_ACAI, restaurante_id: restaurantes[1].id, categoria_produto: 'Açaí' },
      { nome: 'Açaí 500ml', descricao: 'Açaí puro 500ml batido na hora', preco: 21.90, imagem: IMG_ACAI, restaurante_id: restaurantes[1].id, categoria_produto: 'Açaí', destaque: true },
      { nome: 'Açaí 700ml Premium', descricao: 'Açaí com banana, morango, granola e mel', preco: 29.90, preco_promocional: 25.90, imagem: IMG_ACAI, restaurante_id: restaurantes[1].id, categoria_produto: 'Açaí' },
      { nome: 'Bowl Tropical', descricao: 'Açaí com manga, kiwi, granola crocante e leite condensado', preco: 34.90, imagem: IMG_ACAI, restaurante_id: restaurantes[1].id, categoria_produto: 'Bowls', destaque: true },
      { nome: 'Bowl Fitness', descricao: 'Açaí com banana, granola sem açúcar e chia', preco: 32.90, imagem: IMG_ACAI, restaurante_id: restaurantes[1].id, categoria_produto: 'Bowls' },
      { nome: 'Vitamina de Morango', descricao: 'Vitamina cremosa de morango com leite e sorvete', preco: 16.90, imagem: IMG_ACAI, restaurante_id: restaurantes[1].id, categoria_produto: 'Vitaminas' },
      { nome: 'Suco de Laranja 500ml', descricao: 'Suco de laranja natural espremido na hora', preco: 10.90, imagem: IMG_ACAI, restaurante_id: restaurantes[1].id, categoria_produto: 'Bebidas' },

      { nome: 'Prato Self Service (kg)', descricao: 'Monte seu prato à vontade: pratos quentes, saladas e acompanhamentos. Preço por kg.', preco: 69.90, imagem: IMG_BRASILEIRA, restaurante_id: restaurantes[2].id, categoria_produto: 'Self Service', destaque: true },
      { nome: 'Frango Grelhado', descricao: 'Filé de frango grelhado temperado com ervas finas', preco: 29.90, imagem: IMG_BRASILEIRA, restaurante_id: restaurantes[2].id, categoria_produto: 'Pratos Quentes' },
      { nome: 'Estrogànofe de Carne', descricao: 'Estrogànofe cremoso de carne com arroz e batata palha', preco: 31.90, imagem: IMG_BRASILEIRA, restaurante_id: restaurantes[2].id, categoria_produto: 'Pratos Quentes' },
      { nome: 'Escondidinho de Frango', descricao: 'Purê de batata com frango desfiado e queijo gratinado', preco: 27.90, imagem: IMG_BRASILEIRA, restaurante_id: restaurantes[2].id, categoria_produto: 'Pratos Quentes' },
      { nome: 'Salada Mista', descricao: 'Alface, rúcula, tomate cereja, cenoura e azeite', preco: 16.90, imagem: IMG_BRASILEIRA, restaurante_id: restaurantes[2].id, categoria_produto: 'Saladas' },
      { nome: 'Pudim de Leite', descricao: 'Pudim de leite condensado com calça de caramelo', preco: 12.90, imagem: IMG_BRASILEIRA, restaurante_id: restaurantes[2].id, categoria_produto: 'Sobremesas' },
      { nome: 'Suco do Dia', descricao: 'Suco natural da fruta do dia, 400ml', preco: 9.90, imagem: IMG_BRASILEIRA, restaurante_id: restaurantes[2].id, categoria_produto: 'Bebidas' },

      { nome: 'Picanha na Brasa', descricao: 'Picanha prime grelhada na brasa com alho, servida com arroz, vinagrete e farofa', preco: 79.90, imagem: IMG_CHURRASCO, restaurante_id: restaurantes[3].id, categoria_produto: 'Carnes', destaque: true },
      { nome: 'Costela Bovina', descricao: 'Costela bovina assada lentamente por 12h, desfiada e suculenta', preco: 69.90, imagem: IMG_CHURRASCO, restaurante_id: restaurantes[3].id, categoria_produto: 'Carnes' },
      { nome: 'Frango na Brasa', descricao: 'Frango inteiro grelhado na brasa com tempero especial da casa', preco: 54.90, imagem: IMG_CHURRASCO, restaurante_id: restaurantes[3].id, categoria_produto: 'Carnes' },
      { nome: 'Linguica Toscana', descricao: 'Linguiça toscana artesanal grelhada na brasa, 300g', preco: 34.90, imagem: IMG_CHURRASCO, restaurante_id: restaurantes[3].id, categoria_produto: 'Carnes' },
      { nome: 'Arroz com Feijão', descricao: 'Arroz soltinho e feijão temperado, acompanhamento perfeito', preco: 14.90, imagem: IMG_CHURRASCO, restaurante_id: restaurantes[3].id, categoria_produto: 'Acompanhamentos' },
      { nome: 'Farofa da Casa', descricao: 'Farofa temperada com bacon, ovos e cheiro-verde', preco: 16.90, imagem: IMG_CHURRASCO, restaurante_id: restaurantes[3].id, categoria_produto: 'Acompanhamentos' },
      { nome: 'Caipirinha de Limão', descricao: 'Caipirinha artesanal de limão tahiti com cachaça premium', preco: 18.90, imagem: IMG_CHURRASCO, restaurante_id: restaurantes[3].id, categoria_produto: 'Bebidas' },
      { nome: 'Refrigerante Lata', descricao: 'Coca-Cola, Guaraná Antarctica ou Sprite, lata 350ml', preco: 7.90, imagem: IMG_CHURRASCO, restaurante_id: restaurantes[3].id, categoria_produto: 'Bebidas' },

      { nome: 'Whopper', descricao: 'Pão brioche, carne grelhada, queijo, alface, tomate, cebola, picles e maionese', preco: 32.90, imagem: IMG_HAMBURGUER, restaurante_id: restaurantes[4].id, categoria_produto: 'Sanduíches', destaque: true },
      { nome: 'Whopper Duplo', descricao: 'Duas carnes grelhadas com queijo americano e molho especial', preco: 39.90, imagem: IMG_HAMBURGUER, restaurante_id: restaurantes[4].id, categoria_produto: 'Sanduíches' },
      { nome: 'Chicken Crispy', descricao: 'Frango empanado crocante com maionese de ervas e alface', preco: 27.90, imagem: IMG_HAMBURGUER, restaurante_id: restaurantes[4].id, categoria_produto: 'Sanduíches' },
      { nome: 'Onion Rings', descricao: 'Anéis de cebola empanados e crocantes, porção com 8 unidades', preco: 14.90, imagem: IMG_HAMBURGUER, restaurante_id: restaurantes[4].id, categoria_produto: 'Acompanhamentos' },
      { nome: 'Batata Frita M', descricao: 'Batata frita crocante por fora, macia por dentro, tamanho médio', preco: 10.90, imagem: IMG_HAMBURGUER, restaurante_id: restaurantes[4].id, categoria_produto: 'Acompanhamentos' },
      { nome: 'Refrigerante 500ml', descricao: 'Coca-Cola, Guaraná ou Sprite, copo 500ml', preco: 9.90, imagem: IMG_HAMBURGUER, restaurante_id: restaurantes[4].id, categoria_produto: 'Bebidas' },

      { nome: 'Big Mac', descricao: 'Dois hambúrgueres, alface, queijo, molho especial, cebola, picles e pão com gergelim', preco: 35.90, imagem: IMG_HAMBURGUER, restaurante_id: restaurantes[5].id, categoria_produto: 'Sanduíches', destaque: true },
      { nome: 'McChicken', descricao: 'Frango empanado crocante com alface e maionese', preco: 24.90, imagem: IMG_HAMBURGUER, restaurante_id: restaurantes[5].id, categoria_produto: 'Sanduíches' },
      { nome: 'Quarterão com Queijo', descricao: 'Hambúrguer 113g com queijo americano, cebola, picles, ketchup e mostarda', preco: 30.90, imagem: IMG_HAMBURGUER, restaurante_id: restaurantes[5].id, categoria_produto: 'Sanduíches' },
      { nome: 'McNuggets 10un', descricao: '10 unidades de frango empanado com molho à escolha', preco: 21.90, imagem: IMG_HAMBURGUER, restaurante_id: restaurantes[5].id, categoria_produto: 'Acompanhamentos' },
      { nome: 'Batata Frita G', descricao: 'Batata frita crocante tamanho grande', preco: 13.90, imagem: IMG_HAMBURGUER, restaurante_id: restaurantes[5].id, categoria_produto: 'Acompanhamentos' },
      { nome: 'McFlurry Oreo', descricao: 'Sorvete cremoso com pedaços de Oreo', preco: 16.90, imagem: IMG_HAMBURGUER, restaurante_id: restaurantes[5].id, categoria_produto: 'Sobremesas' },
      { nome: 'Refrigerante 500ml', descricao: 'Coca-Cola, Guaraná ou Suco Del Valle', preco: 9.90, imagem: IMG_HAMBURGUER, restaurante_id: restaurantes[5].id, categoria_produto: 'Bebidas' },

      { nome: 'Pizza Calabresa G', descricao: 'Pizza grande com calabresa fatiada, cebola roxa e azeitonas', preco: 52.90, imagem: IMG_PIZZA, restaurante_id: restaurantes[6].id, categoria_produto: 'Pizzas Tradicionais', destaque: true },
      { nome: 'Pizza Margherita G', descricao: 'Molho de tomate especial, muçarela fior di latte, tomate e manjericão fresco', preco: 47.90, imagem: IMG_PIZZA, restaurante_id: restaurantes[6].id, categoria_produto: 'Pizzas Tradicionais' },
      { nome: 'Pizza Pepperoni G', descricao: 'Generosa camada de pepperoni importado com muçarela', preco: 56.90, imagem: IMG_PIZZA, restaurante_id: restaurantes[6].id, categoria_produto: 'Pizzas Tradicionais' },
      { nome: 'Pizza 4 Queijos G', descricao: 'Muçarela, provolone, catupiry e gorgonzola gratinados', preco: 58.90, imagem: IMG_PIZZA, restaurante_id: restaurantes[6].id, categoria_produto: 'Pizzas Especiais' },
      { nome: 'Pizza Portuguesa G', descricao: 'Presunto, ovo, cebola, azeitona, ervilha e muçarela', preco: 55.90, imagem: IMG_PIZZA, restaurante_id: restaurantes[6].id, categoria_produto: 'Pizzas Especiais' },
      { nome: 'Pan Pizza Frango', descricao: 'Pan pizza de massa alta com frango, catupiry e milho', preco: 54.90, imagem: IMG_PIZZA, restaurante_id: restaurantes[6].id, categoria_produto: 'Pan Pizza', destaque: true },
      { nome: 'Refrigerante 2L', descricao: 'Coca-Cola, Guaraná ou Sprite, garrafa 2 litros', preco: 14.90, imagem: IMG_PIZZA, restaurante_id: restaurantes[6].id, categoria_produto: 'Bebidas' }

    ]);
    console.log('Produtos criados.');

    console.log('Seed finalizado com sucesso!');
    process.exit(0);
  } catch (erro) {
    console.error('Erro no seed:', erro);
    process.exit(1);
  }
};

semear();
