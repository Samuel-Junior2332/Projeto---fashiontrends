const ROTULOS_SITUACAO = {
  disponivel: "Disponível",
  esgotado: "Esgotado",
  despublicado: "Despublicado"
};

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function criarImagem(produto) {
  if (produto.imagem) {
    return `<img src="${escaparHtml(produto.imagem)}" alt="${escaparHtml(produto.nome)}" loading="lazy" data-id="${produto.id}">`;
  }
  return `<div class="sem-imagem">${criarIlustracao(produto)}</div>`;
}

function criarSelos(produto) {
  const selos = [];
  if (ehNovidade(produto)) {
    selos.push('<span class="selo selo-novidade">Novidade</span>');
  }
  if (emPromocao(produto)) {
    selos.push('<span class="selo selo-promocao">Promoção</span>');
  }
  return `<div class="selos">${selos.join("")}</div>`;
}

function criarPreco(produto) {
  if (emPromocao(produto)) {
    return `<p class="preco"><span class="preco-antigo">${formatarMoeda(produto.preco)}</span> <span class="preco-promocao">${formatarMoeda(produto.precoPromocional)}</span></p>`;
  }
  return `<p class="preco">${formatarMoeda(produto.preco)}</p>`;
}

function criarSituacao(produto) {
  const situacao = calcularSituacao(produto);
  return `<span class="situacao situacao-${situacao}">${ROTULOS_SITUACAO[situacao]}</span>`;
}
