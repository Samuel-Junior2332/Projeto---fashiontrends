const CHAVE_SESSAO = "fashiontrends_sessao";

const USUARIOS_CADASTRADOS = [
  { usuario: "bianca", senha: "fashion123", nome: "Bianca", perfil: "Analista de catálogo" },
  { usuario: "rafael", senha: "fashion123", nome: "Rafael", perfil: "Coordenador de marketing" }
];

function entrar(usuario, senha) {
  const encontrado = USUARIOS_CADASTRADOS.find((item) => {
    return item.usuario === usuario && item.senha === senha;
  });

  if (!encontrado) {
    return false;
  }

  const sessao = { usuario: encontrado.usuario, nome: encontrado.nome, perfil: encontrado.perfil };
  sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
  return true;
}

function usuarioLogado() {
  try {
    const texto = sessionStorage.getItem(CHAVE_SESSAO);
    return texto ? JSON.parse(texto) : null;
  } catch (erro) {
    return null;
  }
}

function sair() {
  sessionStorage.removeItem(CHAVE_SESSAO);
}
