const campoBuscaVitrine = document.getElementById("campoBuscaVitrine");
const filtroCategoriaVitrine = document.getElementById("filtroCategoriaVitrine");
const areaVitrine = document.getElementById("vitrine");
const dialogoDetalhes = document.getElementById("dialogoDetalhes");
const conteudoDetalhes = document.getElementById("conteudoDetalhes");

function criarCartaoVitrine(produto) {
  return `
    <article class="cartao-vitrine" data-id="${produto.id}">
      <div class="cartao-imagem">${criarImagem(produto)}${criarSelos(produto)}</div>
      <div class="cartao-corpo">
        <h3>${escaparHtml(produto.nome)}</h3>
        ${criarPreco(produto)}
        <button type="button" class="secundario" data-acao="detalhes">Ver detalhes</button>
      </div>
    </article>
  `;
}

function renderizarVitrine() {
  const produtos = listarVitrine(campoBuscaVitrine.value, filtroCategoriaVitrine.value);

  if (produtos.length === 0) {
    areaVitrine.innerHTML = '<p class="vazio">Nenhuma peça disponível agora. Publique um produto com estoque para ele aparecer aqui.</p>';
    return;
  }

  areaVitrine.innerHTML = produtos.map(criarCartaoVitrine).join("");
}

function abrirDetalhes(id) {
  const produto = buscarProduto(id);
  const textoDescricao = produto.descricao ? escaparHtml(produto.descricao) : "Peça sem descrição cadastrada.";
  const textoEstoque = produto.estoque <= LIMITE_ESTOQUE_BAIXO ? `Últimas ${produto.estoque} unidades` : "Em estoque";

  conteudoDetalhes.innerHTML = `
    <div class="detalhes">
      <div class="cartao-imagem">${criarImagem(produto)}${criarSelos(produto)}</div>
      <div class="detalhes-info">
        <p class="detalhe">${escaparHtml(produto.categoria)}</p>
        <h2>${escaparHtml(produto.nome)}</h2>
        ${criarPreco(produto)}
        <p>${textoDescricao}</p>
        <p class="detalhe">Cor: ${escaparHtml(produto.cor || "Não informada")}</p>
        <p class="detalhe">Tamanhos: ${produto.tamanhos.join(", ")}</p>
        <p class="linha-estoque">${criarSituacao(produto)}<span class="estoque">${textoEstoque}</span></p>
      </div>
    </div>
  `;

  dialogoDetalhes.showModal();
}
