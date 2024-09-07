var idAnimal = document.getElementById("idanimal");
var numberanimais = document.getElementById("numberanimais");
let recintos = [
  {
    numero: 1,
    bioma: "savana",
    tamanho: 10,
    animaisExistentes: [{ tipo: "macacos", quantidade: 2 }],
  },
  {
    numero: 2,
    bioma: "floresta",
    tamanho: 5,
    animaisExistentes: [{ tipo: "vazio", quantidade: 0 }],
  },
  {
    numero: 3,
    bioma: "savana e rio",
    tamanho: 7,
    animaisExistentes: [{ tipo: "gazela", quantidade: 1 }],
  },
  {
    numero: 4,
    bioma: "rio",
    tamanho: 8,
    animaisExistentes: [{ tipo: "vazio", quantidade: 0 }],
  },
  {
    numero: 5,
    bioma: "savana",
    tamanho: 9,
    animaisExistentes: [{ tipo: "leão", quantidade: 1 }],
  },
];
let animais = [
  { especie: "leão", tamanho: 3, bioma: "savana" },
  { especie: "leopardo", tamanho: 2, bioma: "savana" },
  { especie: "crocodilo", tamanho: 3, bioma: "rio" },
  { especie: "macaco", tamanho: 1, bioma: "savana ou floresta" },
  { especie: "gazela", tamanho: 2, bioma: "savana" },
  { especie: "hipopotamo", tamanho: 4, bioma: "savana ou rio" },
];
function infosinternas(idAnimal, numberanimais) {
  let nomeAnimais = idAnimal.value.trim().toLowerCase();
  let animalexistente = animais.find(
    (animal) => animal.especie.toLowerCase() === nomeAnimais
  );
  if (!animalexistente) {
    return { erro: "Animal inválido" };
  }
  let quantidade = Number(numberanimais.value.trim());
  if (isNaN(quantidade) || quantidade <= 0) {
    return { erro: "Quantidade inválida" };
  }
  return { animal: animalexistente, quantidade: quantidade };
}

function verificar() {
  idAnimal.value = "";
  numberanimais.value = "";
  idAnimal.focus();

  let resultadoInfos = infosinternas(idAnimal, numberanimais);
  if (resultadoInfos.erro) {
    console.log({ erro: resultadoInfos.erro });
    return;
  }
}
