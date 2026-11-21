function renderizarResumo() {
  const resumo = calcularResumo();

  const indicadores = [
    { rotulo: "Produtos publicados", valor: resumo.publicados },
    { rotulo: "Valor em estoque", valor: formatarMoeda(resumo.valorEmEstoque) },
    { rotulo: "Em promoção", valor: resumo.emPromocao },
    { rotulo: `Novidades (${DIAS_NOVIDADE} dias)`, valor: resumo.novidades },
    { rotulo: "Estoque baixo", valor: resumo.estoqueBaixo, atencao: resumo.estoqueBaixo > 0 },
    { rotulo: "Esgotados no ar", valor: resumo.esgotadosPublicados, atencao: resumo.esgotadosPublicados > 0 }
  ];

  document.getElementById("resumo").innerHTML = indicadores.map((indicador) => {
    const classe = indicador.atencao ? "indicador atencao" : "indicador";
    return `<div class="${classe}"><span>${indicador.rotulo}</span><strong>${indicador.valor}</strong></div>`;
  }).join("");
}

function criarListaAlertas(produtos, textoVazio, gerarTexto) {
  if (produtos.length === 0) {
    return `<p class="vazio">${textoVazio}</p>`;
  }

  const itens = produtos.map((produto) => {
    return `<li class="alerta-item"><span>${escaparHtml(produto.nome)}</span><strong>${gerarTexto(produto)}</strong></li>`;
  });

  return `<ul class="alertas">${itens.join("")}</ul>`;
}

function renderizarAlertas() {
  const esgotados = listarEsgotadosPublicados();
  const estoqueBaixo = listarEstoqueBaixo();

  document.getElementById("alertasEsgotados").innerHTML = criarListaAlertas(
    esgotados,
    "Nenhuma peça esgotada na vitrine.",
    () => "Esgotou!"
  );

  document.getElementById("alertasBaixo").innerHTML = criarListaAlertas(
    estoqueBaixo,
    "Nenhuma peça com estoque baixo.",
    (produto) => `${produto.estoque} un.`
  );

  document.getElementById("botaoDespublicar").disabled = esgotados.length === 0;
}
