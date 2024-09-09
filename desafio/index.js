var idAnimal = document.getElementById("idanimal");
var numberanimais = document.getElementById("numberanimais");
var res = document.getElementById("resposta");

let recintos = [
  {
    numero: 1,
    bioma: "savana",
    tamanho: 10,
    animaisExistentes: [{ tipo: "macaco", quantidade: 2 }],
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

  // Corrige pluralidade
  if (nomeAnimais.endsWith('s')) {
    nomeAnimais = nomeAnimais.slice(0, -1);
  }
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

function verificarRecintos(animal, quantidade) {
  return recintos.filter((recinto) => {
    // Verifica se o bioma do recinto é adequado para o animal
    let biomacompativeis = animal.bioma.split("ou").map(b => b.trim().toLowerCase());
    let biomaadequado =
      biomacompativeis.includes(recinto.bioma.toLowerCase()) ||
      (recinto.bioma.includes("e") &&
        biomacompativeis.some(b => recinto.bioma.toLowerCase().includes(b)));
    
    if (!biomaadequado) return false;

    // Calcula o espaço ocupado no recinto
    let espacoOcupado = recinto.animaisExistentes.reduce((total, a) => {
      let animalExistente = animais.find(
        (anim) => anim.especie.toLowerCase() === a.tipo.toLowerCase()
      );
      return (
        total + (animalExistente ? a.quantidade * animalExistente.tamanho : 0)
      );
    }, 0);

    // Calcula o espaço necessário para o novo animal
    let espacoNecessario = quantidade * animal.tamanho;
    let espacoLivre = recinto.tamanho - espacoOcupado;

    // Verifica se o recinto tem espaço suficiente
    if (espacoLivre < espacoNecessario) return false;

    // Verifica regras específicas para determinados animais
    if (animal.especie === 'macaco') {
      let macacosExistentes = recinto.animaisExistentes.find(a => a.tipo.toLowerCase() === 'macaco');
      if (macacosExistentes && macacosExistentes.quantidade > 0) {
        return true;
      }
      return quantidade > 1;
    }

    if (animal.especie === "hipopotamo") {
      if (recinto.bioma !== "savana e rio") return false;
    }
    return true;
  }).map(r => `Recinto ${r.numero} (espaço livre: ${r.tamanho - r.animaisExistentes.reduce((total, a) => {
    let animalExistente = animais.find(
      (anim) => anim.especie.toLowerCase() === a.tipo.toLowerCase()
    );
    return total + (animalExistente ? a.quantidade * animalExistente.tamanho : 0);
  }, 0)} total: ${r.tamanho})`);
}

function verificar() {
  let resultadoInfos = infosinternas(idAnimal, numberanimais);
  if (resultadoInfos.erro) {
    res.innerHTML = `Erro: ${resultadoInfos.erro}`;
    return;
  }
  let recintosViaveis = verificarRecintos(resultadoInfos.animal, resultadoInfos.quantidade);
  if (recintosViaveis.length === 0) {
    res.innerHTML = "Não há recinto viável";
  } else {
    res.innerHTML = recintosViaveis.join("<br>");
  }
}
