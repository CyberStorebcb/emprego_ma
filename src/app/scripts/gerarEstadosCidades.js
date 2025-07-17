const fs = require("fs");

// Carregue os arquivos
const estados = require("../Estados.json");
const cidades = require("../Cidades.json");

// Crie o objeto agrupado
const estadosCidades = estados.map((estado) => {
  const cidadesDoEstado = cidades
    .filter((cidade) => cidade.Estado === estado.ID)
    .map((cidade) => cidade.Nome);

  return {
    sigla: estado.Sigla,
    nome: estado.Nome,
    cidades: cidadesDoEstado,
  };
});

// Salve no formato esperado pelo React
fs.writeFileSync(
  "../estadosCidades.json",
  JSON.stringify({ estados: estadosCidades }, null, 2),
  "utf8"
);

console.log("Arquivo estadosCidades.json gerado com sucesso!");