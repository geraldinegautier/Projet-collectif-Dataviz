document.addEventListener("DOMContentLoaded", function() {
    // Récupérer l'ID du Pokémon à partir de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonId = urlParams.get('id');


    // Utiliser pokemonId pour récupérer les détails du Pokémon depuis votre API
    fetch(`https://pokebuildapi.fr/api/v1/pokemon/${pokemonId}`)
        .then(response => response.json())
        .then(pokemon => {
            // Créer un élément div pour afficher les détails du Pokémon
            const div = document.createElement("div");
            div.classList.add("pokemonDetails");
            div.innerHTML = `
                <center><img class="image" src="${pokemon.image}" /></center>
                <h2><center>${pokemon.name}</center></h2>
                <p><center>
                ${pokemon.apiTypes.map(type => `<span class="${type.name.toLowerCase()}">${type.name}</span> `).join('')} 
                </center></p>
                <div id="statsContainer">
                ${Object.entries(pokemon.stats).map(([statName, statValue]) => `<p class="centered">${statName}: ${statValue}</p>`).join('')}
            </div>
            `;

            // Ajouter l'élément div à la page HTML
            document.body.appendChild(div);
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la récupération des détails du Pokémon :', error);
        });
});