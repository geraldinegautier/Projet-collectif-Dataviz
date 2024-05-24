// Déclaration de variables globales
let tabMapType = new Map(); // Pour stocker les types de Pokémon et leur compteur
let tabMapTypeEntries = []; // Tableau pour stocker les entrées de la carte des types
let count = 0; // Compteur pour suivre le nombre de Pokémon affichés
let DivPage2 = []; // Tableau pour stocker les Pokémon affichés sur la page 2
let daata; // Variable pour stocker les données récupérées de l'API
let tab1 = []; // Tableau pour stocker les noms des types de Pokémon
let tab2 = []; // Tableau pour stocker le nombre de chaque type de Pokémon

// Récupération des données depuis l'API
fetch("https://pokebuildapi.fr/api/v1/pokemon/limit/100")
  .then(response => response.json())
  .then(data => {
    daata = data; // Stockage des données récupérées dans la variable daata
    choice(daata); // Appel de la fonction choice pour sélectionner et afficher les premiers Pokémon
    calculPourcent(daata); // Appel de la fonction calculPourcent pour calculer les pourcentages de types de Pokémon

  });

// Gestion de la saisie de recherche par l'utilisateur
const searchInput = document.getElementById('searchInput');

// Ajouter un gestionnaire d'événements pour l'événement d'entrée de texte
searchInput.addEventListener('input', function () {
  const searchValue = searchInput.value.toLowerCase(); // Récupérer la valeur de la recherche et la convertir en minuscules

  // Sélectionner tous les éléments de la classe "pokemon" (les div contenant les informations sur les Pokémon)
  const pokemons = document.querySelectorAll('.pokemon');

  // Parcourir tous les éléments Pokémon
  pokemons.forEach(pokemon => {
    const pokemonName = pokemon.querySelector('h2').textContent.toLowerCase(); // Récupérer le nom du Pokémon

    // Vérifier si le nom du Pokémon contient la valeur de recherche
    if (pokemonName.includes(searchValue)) {
      // Afficher le Pokémon si le nom correspond à la recherche
      pokemon.style.display = 'block';
    } else {
      // Masquer le Pokémon si le nom ne correspond pas à la recherche
      pokemon.style.display = 'none';
    }

  });
});

// Sélection de 9 Pokémon à afficher et appel de la fonction d'affichage
function choice(data) {
  let DivPage2 = []; // Réinitialisation du tableau DivPage2 à chaque appel de la fonction
  let n = count + 9;
  for (count; count < n; count++) {
    DivPage2.push(data[count]);
  }

  affichage(DivPage2); // Appel de la fonction d'affichage pour afficher les Pokémon sélectionnés

  if (count >= daata.length) {
    document.getElementById("boutonNext").style.display = "none"; // Masquer le bouton si tous les Pokémon ont été affichés
  }
  document.getElementById("buttonAll").addEventListener("click", function () {
    document.getElementById("boutonNext").style.display = "none"; //ici on récupère l'ID boutonNext et on le masque en fonction de ce qu'on a paramétré au dessus.
  });
}

// Fonction d'affichage des Pokémon dans l'interface utilisateur
function affichage(x) {
  x.forEach(pokemon => {
    //on veut afficher le resultat dans la page web
    const Div = document.createElement("div");
    Div.classList.add("pokemon");
    Div.innerHTML = `
            <center><img class="image" src="${pokemon.image}" /></center>
                <h2><center>${pokemon.name}</center></h2>
                <p id="type"><center>
                ${pokemon.apiTypes.map(type => `<span class="${type.name.toLowerCase()}">${type.name}</span> `).join('')} 
                </center></p>
            `;

    // Ajouter un gestionnaire d'événements de clic à l'élément div
    Div.addEventListener("click", () => {
      // Rediriger vers la page de détails du Pokémon
      window.location.href = `api1.html?id=${pokemon.id}`;
    });

    //va chercher tout ce qu'il y a dans Div et mets dans allPokemons
    document.getElementById("allPokemons").appendChild(Div);

  })
}

function triType(type, y) {
  let typeTab = []

  y.forEach(pokemon => {
    pokemon.apiTypes.forEach(pokemonType => {
      if (type === pokemonType.name) {
        typeTab.push(pokemon);
      }
    });
  });
  console.log("typetab ", typeTab)
  console.log("type ", type)
  document.getElementById("allPokemons").innerHTML = ""
  affichage(typeTab)
}

// Calcul des pourcentages de types de Pokémon
function calculPourcent(data) {
  let type = ["Poison", "Plante", "Feu", "Eau", "Insecte", "Normal", "Vol", "Électrik", "Sol", "Fée", "Combat", "Psy", "Roche", "Acier", "Glace", "Spectre"]

  // Initialiser le compteur pour chaque type à zéro
  for (let i = 0; i < type.length; i++) {
    tabMapType.set(type[i], 0);
  }

  // Itérer à travers chaque Pokémon et chaque type de Pokémon pour compter
  data.forEach(pokemon => {
    pokemon.apiTypes.forEach(pokemonType => {
      // Incrémenter le compteur pour le type de Pokémon actuel
      let currentCount = tabMapType.get(pokemonType.name);
      tabMapType.set(pokemonType.name, currentCount + 1);
    });
  });

  tabMapTypeEntries = Array.from(tabMapType.entries());
  tabMapTypeEntries.forEach(entry => {
    const key = entry[0];
    tab1.push(entry[0]); // Stockage des noms de types de Pokémon
    const value = entry[1];
    tab2.push(entry[1]); // Stockage du nombre de Pokémon de chaque type
  });
}

// Gestionnaire d'événement pour le bouton de visualisation des données
const btnDataViz = document.querySelector("#buttonDataViz");

btnDataViz.addEventListener("click", function () {
  document.getElementById("allPokemons").innerHTML = ""; // Réinitialisation de l'élément HTML contenant les Pokémon
  document.getElementById("chartContainer").innerHTML = ""; // Réinitialisation de l'élément HTML contenant le graphique
  document.getElementById("boutonNext").style.display = "none"; //ici on récupère l'ID boutonNext et on le masque en fonction de ce qu'on a paramétré au dessus.

  const chartContainer = document.getElementById("chartContainer");
  const myChart = document.createElement("canvas");; // Création de l'élément canvas pour le graphique
  myChart.id = "myChart";
  chartContainer.appendChild(myChart); // Ajout du canvas à l'élément HTML chartContainer

  const charData = {
    labels: tab1,
    data: tab2,
  };

  // Création du graphique à l'aide de Chart.js
  new Chart(myChart, {
    type: "doughnut",
    data: {
      labels: charData.labels,
      datasets: [
        {
          label: "pokemon type",
          data: charData.data
        }
      ]
    },
    options: {
      // Redimensionner le graphique doughnut
      responsive: true,
      maintainAspectRatio: false,
      // Afficher les étiquettes à droite du graphique
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: 'white',
            font: {
              weight: 'bold' // Rendre le texte de la légende en gras
            }
          }
        }
      }
    }
  });
});

// Fonction de tri des Pokémon par ordre alphabétique de A à Z
const boutonAZ = document.querySelector("#buttonAZ");

boutonAZ.addEventListener("click", function () {
  const tabTri = Array.from(daata);
  tabTri.sort(function (a, b) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  });
  document.getElementById("allPokemons").innerHTML = ""
  document.getElementById("chartContainer").innerHTML = ""
  document.getElementById("boutonNext").style.display = "none";
  affichage(tabTri);
});

// Fonction de tri des Pokémon par ordre alphabétique de Z à A
const boutonZA = document.querySelector("#buttonZA");

boutonZA.addEventListener("click", function () {
  const tabTri2 = Array.from(daata);
  tabTri2.sort(function (a, b) {
    if (a.name > b.name)
      return -1;
    if (a.name < b.name)
      return 1;
    return 0;
  });
  console.log("tabtri2 ", tabTri2)
  document.getElementById("allPokemons").innerHTML = ""
  document.getElementById("chartContainer").innerHTML = ""
  document.getElementById("boutonNext").style.display = "none";
  affichage(tabTri2);
});

//Tri par type
const typesSelect = document.querySelector("#types");

typesSelect.addEventListener("change", (event) => {
  //const result = document.querySelector(".result");
  triType(`${event.target.value}`, daata)

});

//Si on clique sur le bouton "charger d'autres pokemons", ça appelle la fonction choice
document.querySelector("#boutonNext").addEventListener("click", function () {
  choice(daata)
});
//Affiche tous les pokemons quand on clique sur All
document.querySelector("#buttonAll").addEventListener("click", function () {
  document.getElementById("allPokemons").innerHTML = ""
  document.getElementById("chartContainer").innerHTML = ""
  affichage(daata)
});

const audio = document.getElementById("myAudio");
const playPauseButton = document.getElementById("playPauseButton");

playPauseButton.addEventListener("click", function () {
  if (audio.paused) {
    // Si la musique est en pause, la jouer
    audio.play();
    playPauseButton.textContent = "Pause"; // Mettre à jour le texte du bouton
  } else {
    // Si la musique est en cours de lecture, la mettre en pause
    audio.pause();
    playPauseButton.textContent = "Lecture"; // Mettre à jour le texte du bouton
  }
});
