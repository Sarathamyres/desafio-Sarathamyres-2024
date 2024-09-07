function encontrarRecintosViaveis(tipoAnimal, quantidade) {
  // Dados dos recintos
  const recintos = [
      { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: { 'macaco': 3 } },
      { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: {} },
      { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: { 'gazela': 1 } },
      { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: {} },
      { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: { 'leão': 1 } },
  ];

  // Dados dos animais
  const animais = {
      'leão': { tamanho: 3, bioma: 'savana', carnívoro: true },
      'leopardo': { tamanho: 2, bioma: 'savana', carnívoro: true },
      'crocodilo': { tamanho: 3, bioma: 'rio', carnívoro: true },
      'macaco': { tamanho: 1, bioma: ['savana', 'floresta'], carnívoro: false },
      'gazela': { tamanho: 2, bioma: 'savana', carnívoro: false },
      'hipopotamo': { tamanho: 4, bioma: ['savana', 'rio'], carnívoro: false },
  };

  // Função para verificar se o animal é válido
  function animalValido(animal) {
      return Object.keys(animais).includes(animal);
  }

  // Função para verificar se a quantidade é válida
  function quantidadeValida(qtd) {
      return Number.isInteger(qtd) && qtd > 0;
  }

  // Verificação inicial de erros
  const tipoAnimalFormatado = tipoAnimal.toLowerCase();
  if (!animalValido(tipoAnimalFormatado)) {
      return { erro: "Animal inválido" };
  }
  if (!quantidadeValida(quantidade)) {
      return { erro: "Quantidade inválida" };
  }

  // Dados do animal solicitado
  const animal = animais[tipoAnimalFormatado];

  // Verificação de recintos viáveis
  const recintosViaveis = recintos.filter(recinto => {
      const biomasPermitidos = Array.isArray(animal.bioma) ? animal.bioma : [animal.bioma];
      const biomaCompatível = biomasPermitidos.includes(recinto.bioma);
      if (!biomaCompatível) return false;

      // Calcular o espaço necessário
      const tamanhoNecessario = quantidade * animal.tamanho + (Object.keys(recinto.animaisExistentes).length > 0 ? 1 : 0);

      // Calcular o espaço já ocupado pelos animais existentes
      const espacoOcupadoExistente = Object.keys(recinto.animaisExistentes).reduce((acc, especie) => {
          const especieDados = animais[especie];
          return acc + (especieDados ? especieDados.tamanho : 0);
      }, 0);

      // Calcular o espaço disponível
      const espaçoDisponível = recinto.tamanhoTotal - tamanhoNecessario - espacoOcupadoExistente;

      // Verificar regras adicionais
      if (animal.carnívoro) {
          // Carnívoros só podem estar com a própria espécie
          const outrosAnimais = Object.keys(recinto.animaisExistentes).filter(a => a !== tipoAnimalFormatado);
          if (outrosAnimais.length > 0) return false;
      }

      if (tipoAnimalFormatado === 'macaco' && quantidade > 1 && Object.keys(recinto.animaisExistentes).length === 0) {
          // Macacos precisam de pelo menos outro animal no recinto
          return false;
      }

      if (tipoAnimalFormatado === 'hipopotamo' && recinto.bioma !== 'savana e rio') {
          // Hipopótamos só podem compartilhar recintos com savana e rio
          return false;
      }

      return biomaCompatível && espaçoDisponível >= 0;
  }).map(recinto => ({
      numero: recinto.numero,
      espaçoLivre: recinto.tamanhoTotal - quantidade * animal.tamanho - (Object.keys(recinto.animaisExistentes).length > 0 ? 1 : 0),
      tamanhoTotal: recinto.tamanhoTotal
  }));

  // Resultado final
  if (recintosViaveis.length === 0) {
      return { erro: "Não há recinto viável" };
  }

  return {
      recintosViaveis: recintosViaveis.map(r => `Recinto ${r.numero} (espaço livre: ${r.espaçoLivre} total: ${r.tamanhoTotal})`)
  };
}

document.getElementById('zooForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const tipoAnimal = document.getElementById('animal').value.trim().toLowerCase();
  const quantidade = parseInt(document.getElementById('quantity').value, 10);

  const resultado = encontrarRecintosViaveis(tipoAnimal, quantidade);

  const output = document.getElementById('output');
  if (resultado.erro) {
      output.textContent = resultado.erro;
  } else {
      output.innerHTML = resultado.recintosViaveis.join('<br>');
  }
});
