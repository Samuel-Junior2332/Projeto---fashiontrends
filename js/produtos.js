const LIMITE_ESTOQUE_BAIXO = 5;
const DIAS_NOVIDADE = 15;
const CATEGORIAS = ["Blusas", "Camisetas", "Vestidos", "Saias", "Calças", "Casacos", "Acessórios"];
const TAMANHOS = ["P", "M", "G", "GG", "Único"];

let listaProdutos = carregarProdutos();

function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function adicionarProduto(dados) {
  const novoProduto = { id: gerarId(), criadoEm: new Date().toISOString(), ...dados };
  listaProdutos.push(novoProduto);
  salvarProdutos(listaProdutos);
}

function editarProduto(id, dados) {
  listaProdutos = listaProdutos.map((produto) => {
    return produto.id === id ? { ...produto, ...dados } : produto;
  });
  salvarProdutos(listaProdutos);
}

function removerProduto(id) {
  listaProdutos = listaProdutos.filter((produto) => produto.id !== id);
  salvarProdutos(listaProdutos);
}

function buscarProduto(id) {
  return listaProdutos.find((produto) => produto.id === id);
}

function alternarPublicacao(id) {
  const produto = buscarProduto(id);
  editarProduto(id, { ativo: !produto.ativo });
}

function despublicarEsgotados() {
  let quantidade = 0;

  listaProdutos = listaProdutos.map((produto) => {
    if (produto.ativo && produto.estoque === 0) {
      quantidade++;
      return { ...produto, ativo: false };
    }
    return produto;
  });

  salvarProdutos(listaProdutos);
  return quantidade;
}

function diasDesde(dataIso) {
  return Math.floor((Date.now() - new Date(dataIso).getTime()) / MS_POR_DIA);
}

function ehNovidade(produto) {
  return diasDesde(produto.criadoEm) <= DIAS_NOVIDADE;
}

function emPromocao(produto) {
  return produto.precoPromocional !== null && produto.precoPromocional < produto.preco;
}

function precoFinal(produto) {
  return emPromocao(produto) ? produto.precoPromocional : produto.preco;
}

function calcularSituacao(produto) {
  if (!produto.ativo) {
    return "despublicado";
  }
  if (produto.estoque === 0) {
    return "esgotado";
  }
  return "disponivel";
}

function buscarPorTermoECategoria(textoBusca, categoria) {
  const termo = textoBusca.trim().toLowerCase();

  return listaProdutos.filter((produto) => {
    const combinaNome = produto.nome.toLowerCase().includes(termo);
    const combinaCategoria = categoria === "todas" || produto.categoria === categoria;
    return combinaNome && combinaCategoria;
  });
}

function filtrarProdutos(textoBusca, categoria, situacao, ordem) {
  const resultado = buscarPorTermoECategoria(textoBusca, categoria).filter((produto) => {
    return situacao === "todas" || calcularSituacao(produto) === situacao;
  });

  if (ordem === "nome") {
    resultado.sort((a, b) => a.nome.localeCompare(b.nome));
  } else if (ordem === "menor-preco") {
    resultado.sort((a, b) => precoFinal(a) - precoFinal(b));
  } else if (ordem === "maior-preco") {
    resultado.sort((a, b) => precoFinal(b) - precoFinal(a));
  } else {
    resultado.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
  }

  return resultado;
}

function listarVitrine(textoBusca, categoria, ordem) {
  const visiveis = buscarPorTermoECategoria(textoBusca, categoria).filter((produto) => {
    return calcularSituacao(produto) === "disponivel";
  });

  if (ordem === "menor-preco") {
    visiveis.sort((a, b) => precoFinal(a) - precoFinal(b));
  } else if (ordem === "maior-preco") {
    visiveis.sort((a, b) => precoFinal(b) - precoFinal(a));
  } else if (ordem === "novidades") {
    visiveis.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
  } else {
    visiveis.sort((a, b) => {
      const porDestaque = Number(b.destaque) - Number(a.destaque);
      return porDestaque || b.criadoEm.localeCompare(a.criadoEm);
    });
  }

  return visiveis;
}

function listarEsgotadosPublicados() {
  return listaProdutos.filter((produto) => calcularSituacao(produto) === "esgotado");
}

function listarEstoqueBaixo() {
  return listaProdutos
    .filter((produto) => {
      return produto.ativo && produto.estoque > 0 && produto.estoque <= LIMITE_ESTOQUE_BAIXO;
    })
    .sort((a, b) => a.estoque - b.estoque);
}

function calcularResumo() {
  const publicados = listaProdutos.filter((produto) => produto.ativo);

  const valorEmEstoque = listaProdutos.reduce((soma, produto) => {
    return soma + precoFinal(produto) * produto.estoque;
  }, 0);

  return {
    publicados: publicados.length,
    valorEmEstoque: valorEmEstoque,
    emPromocao: publicados.filter(emPromocao).length,
    novidades: publicados.filter(ehNovidade).length,
    estoqueBaixo: listarEstoqueBaixo().length,
    esgotadosPublicados: listarEsgotadosPublicados().length
  };
}

function validarProduto(dados) {
  const erros = {};

  if (dados.nome.length < 3) {
    erros.nome = "Informe um nome com pelo menos 3 caracteres.";
  }
  if (!dados.categoria) {
    erros.categoria = "Escolha uma categoria.";
  }
  if (!(dados.preco > 0)) {
    erros.preco = "O preço deve ser maior que zero.";
  }
  if (dados.precoPromocional !== null && !(dados.precoPromocional > 0 && dados.precoPromocional < dados.preco)) {
    erros.precoPromocional = "A promoção precisa ser menor que o preço normal.";
  }
  if (!Number.isInteger(dados.estoque) || dados.estoque < 0) {
    erros.estoque = "Informe um número inteiro, zero ou mais.";
  }
  if (dados.tamanhos.length === 0) {
    erros.tamanhos = "Marque ao menos um tamanho.";
  }
  if (dados.imagem && !/^(https?:\/\/|img\/)/i.test(dados.imagem)) {
    erros.imagem = "Use um link http(s) ou um caminho como img/produtos/foto.jpg.";
  }

  return erros;
}
