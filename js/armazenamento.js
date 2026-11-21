const CHAVE_PRODUTOS = "fashiontrends_produtos_v3";
const MS_POR_DIA = 24 * 60 * 60 * 1000;

function dataHaDias(dias) {
  return new Date(Date.now() - dias * MS_POR_DIA).toISOString();
}

function criarProdutosIniciais() {
  return [
    { id: "p1", nome: "Vestido Slip Dress Champagne", descricao: "Vestido midi de cetim com caimento fluido e alças finas.", categoria: "Vestidos", cor: "Champagne", preco: 259.9, precoPromocional: 199.9, estoque: 14, tamanhos: ["P", "M", "G"], imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNY8fVka91LXmgm5eSmX8nvIiRvY4PeByhO1xbYBWMoQ&s=10", ativo: true, destaque: true, criadoEm: dataHaDias(3) },
    { id: "p2", nome: "Blazer Alfaiataria Oversized", descricao: "Blazer estruturado de ombro marcado, unissex.", categoria: "Casacos", cor: "Preto", preco: 349.9, precoPromocional: null, estoque: 4, tamanhos: ["M", "G", "GG"], imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPNYeKcSglEWTvEeTUAZzaSGBD-caq3s2bjrX9mrJdcg&s", ativo: true, destaque: true, criadoEm: dataHaDias(20) },
    { id: "p3", nome: "Camiseta Baby Look Canelada", descricao: "Malha canelada macia com modelagem ajustada.", categoria: "Camisetas", cor: "Off-white", preco: 59.9, precoPromocional: null, estoque: 32, tamanhos: ["P", "M", "G"], imagem: "https://shop2gether.fbitsstatic.net/img/p/camiseta-feminina-baby-look-canelada-bege-232491/655482-10.jpg?w=1225&h=1633&v=202503171240", ativo: true, destaque: false, criadoEm: dataHaDias(2)}
  ];
}

function carregarProdutos() {
  try {
    const texto = localStorage.getItem(CHAVE_PRODUTOS);
    if (texto === null) {
      return criarProdutosIniciais();
    }
    return JSON.parse(texto);
  } catch (erro) {
    return [];
  }
}

function salvarProdutos(lista) {
  localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(lista));
}
