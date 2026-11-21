const FORMAS = {
  camiseta: '<path d="M62 42 L88 30 Q100 48 112 30 L138 42 L178 82 L154 104 L142 92 L142 208 L58 208 L58 92 L46 104 L22 82 Z"/>',
  blusa: '<path d="M62 42 L88 30 Q100 48 112 30 L138 42 L178 82 L154 104 L142 92 L142 208 L58 208 L58 92 L46 104 L22 82 Z"/><path d="M88 30 L100 62 L112 30" fill="none"/>',
  vestido: '<path d="M82 28 L92 28 L100 46 L108 28 L118 28 L126 92 L164 220 L36 220 L74 92 Z"/><path d="M74 92 L126 92" fill="none"/>',
  saia: '<path d="M68 58 L132 58 L168 212 L32 212 Z"/><path d="M68 58 L132 58 L132 74 L68 74 Z"/><path d="M90 74 L80 212 M110 74 L120 212 M100 74 L100 212" fill="none"/>',
  calca: '<path d="M64 40 L136 40 L148 220 L108 220 L100 104 L92 220 L52 220 Z"/><path d="M64 56 L136 56" fill="none"/>',
  casaco: '<path d="M64 38 L90 28 L100 52 L110 28 L136 38 L176 190 L150 198 L142 118 L142 214 L58 214 L58 118 L50 198 L24 190 Z"/><path d="M100 52 L100 214 M90 28 L74 70 L100 100 M110 28 L126 70 L100 100" fill="none"/>',
  acessorio: '<path d="M44 96 H156 L170 206 Q171 220 157 220 H43 Q29 220 30 206 Z"/><path d="M72 96 Q72 44 100 44 Q128 44 128 96" fill="none"/><path d="M41 118 H159" fill="none"/>'
};

const PALAVRAS_FORMA = [
  ["vestido", "vestido"],
  ["saia", "saia"],
  ["calça", "calca"],
  ["calca", "calca"],
  ["blazer", "casaco"],
  ["jaqueta", "casaco"],
  ["casaco", "casaco"],
  ["camiseta", "camiseta"],
  ["baby look", "camiseta"],
  ["blusa", "blusa"],
  ["top", "blusa"],
  ["cropped", "blusa"],
  ["bolsa", "acessorio"],
  ["cinto", "acessorio"]
];

const FORMA_POR_CATEGORIA = {
  "Blusas": "blusa",
  "Camisetas": "camiseta",
  "Vestidos": "vestido",
  "Saias": "saia",
  "Calças": "calca",
  "Casacos": "casaco",
  "Acessórios": "acessorio"
};

const CORES_PRODUTO = {
  "verde sálvia": "#7a9e7e",
  "verde salvia": "#7a9e7e",
  "verde": "#7a9e7e",
  "off-white": "#f4ede4",
  "branco": "#ffffff",
  "preto": "#1b1b1b",
  "champagne": "#d9bfa8",
  "fúcsia": "#e11d74",
  "fucsia": "#e11d74",
  "rosa": "#f2a6c4",
  "vermelho": "#c62828",
  "azul": "#4a6fa5",
  "jeans": "#4a6fa5",
  "marrom": "#8b5e3c",
  "bege": "#d8c3a5",
  "areia": "#d8c3a5",
  "cinza": "#9a9a9a",
  "amarelo": "#e8c547"
};

function descobrirForma(produto) {
  const nome = produto.nome.toLowerCase();
  const achado = PALAVRAS_FORMA.find(([palavra]) => nome.includes(palavra));
  return achado ? achado[1] : FORMA_POR_CATEGORIA[produto.categoria] || "camiseta";
}

function descobrirCor(produto) {
  const texto = (produto.cor || "").toLowerCase();
  const nomeCor = Object.keys(CORES_PRODUTO).find((nome) => texto.includes(nome));
  return nomeCor ? CORES_PRODUTO[nomeCor] : "#fffbf7";
}

function criarIlustracao(produto) {
  const forma = FORMAS[descobrirForma(produto)];
  const cor = descobrirCor(produto);

  return `<svg viewBox="0 0 200 250" role="img" aria-label="${escaparHtml(produto.nome)}" fill="${cor}" stroke="#111111" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${forma}</svg>`;
}
