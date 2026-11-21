const campoBuscaLoja = document.getElementById("campoBuscaLoja");
const areaCategorias = document.getElementById("categorias");
const ordemLoja = document.getElementById("ordemLoja");
const areaContagem = document.getElementById("contagem");
const areaVitrine = document.getElementById("vitrine");
const dialogoDetalhes = document.getElementById("dialogoDetalhes");
const conteudoDetalhes = document.getElementById("conteudoDetalhes");

let categoriaSelecionada = "todas";

function montarCategorias() {
  const nomes = ["todas", ...CATEGORIAS];

  areaCategorias.innerHTML = nomes.map((nome) => {
    const rotulo = nome === "todas" ? "Tudo" : nome;
    const classe = nome === categoriaSelecionada ? "categoria ativa" : "categoria";
    return `<button type="button" class="${classe}" data-categoria="${nome}">${rotulo}</button>`;
  }).join("");
}

function criarCartaoVitrine(produto) {
  return `
    <article class="cartao-vitrine" data-id="${produto.id}">
      <div class="cartao-imagem">${criarImagem(produto)}${criarSelos(produto)}</div>
      <div class="cartao-corpo">
        <h3>${escaparHtml(produto.nome)}</h3>
        ${criarPreco(produto)}
        <button type="button" class="secundario">Ver detalhes</button>
      </div>
    </article>
  `;
}

function renderizarLoja() {
  const produtos = listarVitrine(campoBuscaLoja.value, categoriaSelecionada, ordemLoja.value);
  const palavra = produtos.length === 1 ? "peça" : "peças";
  areaContagem.textContent = `${produtos.length} ${palavra}`;

  if (produtos.length === 0) {
    areaVitrine.innerHTML = '<p class="vazio">Nenhuma peça por aqui agora. A próxima mini-coleção chega em breve.</p>';
    return;
  }

  areaVitrine.innerHTML = produtos.map(criarCartaoVitrine).join("");
}

function abrirDetalhes(id) {
  const produto = buscarProduto(id);
  if (!produto) {
    return;
  }

  const textoDescricao = produto.descricao ? escaparHtml(produto.descricao) : "Peça sem descrição cadastrada.";
  const textoEstoque = produto.estoque <= LIMITE_ESTOQUE_BAIXO ? `Últimas ${produto.estoque} unidades` : "Em estoque";
  const tamanhos = produto.tamanhos.map((tamanho) => `<li>${tamanho}</li>`).join("");

  conteudoDetalhes.innerHTML = `
    <div class="detalhes">
      <div class="cartao-imagem">${criarImagem(produto)}${criarSelos(produto)}</div>
      <div class="detalhes-info">
        <p class="detalhe">${escaparHtml(produto.categoria)}</p>
        <h2>${escaparHtml(produto.nome)}</h2>
        ${criarPreco(produto)}
        <p>${textoDescricao}</p>
        <p class="detalhe">Cor: ${escaparHtml(produto.cor || "Não informada")}</p>
        <ul class="tamanhos">${tamanhos}</ul>
        <p class="linha-estoque">${criarSituacao(produto)}<span class="estoque">${textoEstoque}</span></p>
      </div>
    </div>
  `;

  dialogoDetalhes.showModal();
}

areaCategorias.addEventListener("click", (evento) => {
  const botao = evento.target.closest("button[data-categoria]");
  if (!botao) {
    return;
  }

  categoriaSelecionada = botao.dataset.categoria;
  montarCategorias();
  renderizarLoja();
});

campoBuscaLoja.addEventListener("input", renderizarLoja);
ordemLoja.addEventListener("change", renderizarLoja);

areaVitrine.addEventListener("click", (evento) => {
  const cartao = evento.target.closest(".cartao-vitrine");
  if (cartao) {
    abrirDetalhes(cartao.dataset.id);
  }
});

document.getElementById("botaoFechar").addEventListener("click", () => dialogoDetalhes.close());

dialogoDetalhes.addEventListener("click", (evento) => {
  if (evento.target === dialogoDetalhes) {
    dialogoDetalhes.close();
  }
});

window.addEventListener("storage", (evento) => {
  if (evento.key === CHAVE_PRODUTOS) {
    listaProdutos = carregarProdutos();
    renderizarLoja();
  }
});

montarCategorias();
renderizarLoja();
