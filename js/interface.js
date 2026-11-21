const formulario = document.getElementById("formulario");
const tituloFormulario = document.getElementById("tituloFormulario");
const campoId = document.getElementById("campoId");
const campoNome = document.getElementById("campoNome");
const campoDescricao = document.getElementById("campoDescricao");
const campoCategoria = document.getElementById("campoCategoria");
const campoCor = document.getElementById("campoCor");
const campoPreco = document.getElementById("campoPreco");
const campoPrecoPromocional = document.getElementById("campoPrecoPromocional");
const campoEstoque = document.getElementById("campoEstoque");
const areaTamanhos = document.getElementById("areaTamanhos");
const campoImagem = document.getElementById("campoImagem");
const campoAtivo = document.getElementById("campoAtivo");
const campoDestaque = document.getElementById("campoDestaque");
const botaoCancelar = document.getElementById("botaoCancelar");
const campoBusca = document.getElementById("campoBusca");
const filtroCategoria = document.getElementById("filtroCategoria");
const filtroSituacao = document.getElementById("filtroSituacao");
const filtroOrdem = document.getElementById("filtroOrdem");
const areaLista = document.getElementById("lista");

function montarOpcoes() {
  const opcoes = CATEGORIAS.map((categoria) => {
    return `<option value="${categoria}">${categoria}</option>`;
  }).join("");

  campoCategoria.innerHTML = '<option value="">Selecione</option>' + opcoes;
  filtroCategoria.innerHTML = '<option value="todas">Todas as categorias</option>' + opcoes;

  areaTamanhos.innerHTML = TAMANHOS.map((tamanho) => {
    return `<label class="opcao"><input type="checkbox" name="tamanho" value="${tamanho}">${tamanho}</label>`;
  }).join("");
}

function lerFormulario() {
  const marcados = document.querySelectorAll('input[name="tamanho"]:checked');
  const tamanhos = Array.from(marcados).map((caixa) => caixa.value);
  const textoPromocional = campoPrecoPromocional.value.trim();

  return {
    nome: campoNome.value.trim(),
    descricao: campoDescricao.value.trim(),
    categoria: campoCategoria.value,
    cor: campoCor.value.trim(),
    preco: parseFloat(campoPreco.value),
    precoPromocional: textoPromocional === "" ? null : parseFloat(textoPromocional),
    estoque: parseInt(campoEstoque.value, 10),
    tamanhos: tamanhos,
    imagem: campoImagem.value.trim(),
    ativo: campoAtivo.checked,
    destaque: campoDestaque.checked
  };
}

function mostrarErros(erros) {
  document.querySelectorAll("[data-erro]").forEach((span) => {
    span.textContent = erros[span.dataset.erro] || "";
  });
}

function preencherFormulario(produto) {
  campoId.value = produto.id;
  campoNome.value = produto.nome;
  campoDescricao.value = produto.descricao;
  campoCategoria.value = produto.categoria;
  campoCor.value = produto.cor;
  campoPreco.value = produto.preco;
  campoPrecoPromocional.value = produto.precoPromocional === null ? "" : produto.precoPromocional;
  campoEstoque.value = produto.estoque;
  campoImagem.value = produto.imagem;
  campoAtivo.checked = produto.ativo;
  campoDestaque.checked = produto.destaque;

  document.querySelectorAll('input[name="tamanho"]').forEach((caixa) => {
    caixa.checked = produto.tamanhos.includes(caixa.value);
  });

  tituloFormulario.textContent = "Editar produto";
  botaoCancelar.hidden = false;
  mostrarErros({});
  campoNome.focus();
}

function limparFormulario() {
  formulario.reset();
  campoId.value = "";
  campoAtivo.checked = true;
  campoDestaque.checked = false;
  tituloFormulario.textContent = "Novo produto";
  botaoCancelar.hidden = true;
  mostrarErros({});
}

function criarCartao(produto) {
  const classeCartao = produto.ativo ? "cartao" : "cartao inativo";
  const textoPublicacao = produto.ativo ? "Despublicar" : "Publicar";
  const classeEstoque = produto.estoque <= LIMITE_ESTOQUE_BAIXO ? "estoque baixo" : "estoque";
  const textoEstoque = produto.estoque === 0 ? "Sem estoque" : `${produto.estoque} em estoque`;
  const destaque = produto.destaque ? '<p class="detalhe destaque-marca">Destaque na vitrine</p>' : "";

  return `
    <article class="${classeCartao}" data-id="${produto.id}">
      <div class="cartao-imagem">${criarImagem(produto)}${criarSelos(produto)}</div>
      <div class="cartao-corpo">
        <h3>${escaparHtml(produto.nome)}</h3>
        <p class="detalhe">${escaparHtml(produto.categoria)} · ${escaparHtml(produto.cor || "Sem cor")}</p>
        <p class="detalhe">Tamanhos: ${produto.tamanhos.join(", ")}</p>
        ${destaque}
        ${criarPreco(produto)}
        <p class="linha-estoque">${criarSituacao(produto)}<span class="${classeEstoque}">${textoEstoque}</span></p>
      </div>
      <div class="cartao-acoes">
        <button type="button" data-acao="editar">Editar</button>
        <button type="button" class="secundario" data-acao="publicacao">${textoPublicacao}</button>
        <button type="button" class="perigo" data-acao="excluir">Excluir</button>
      </div>
    </article>
  `;
}

function renderizarLista() {
  const produtos = filtrarProdutos(campoBusca.value, filtroCategoria.value, filtroSituacao.value, filtroOrdem.value);

  if (produtos.length === 0) {
    areaLista.innerHTML = '<p class="vazio">Nenhum produto encontrado. Ajuste os filtros ou cadastre uma nova peça.</p>';
    return;
  }

  areaLista.innerHTML = produtos.map(criarCartao).join("");
}
