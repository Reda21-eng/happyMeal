const data = require('./data.json');  // Importation des données JSON
let currentPage = 1;
const recipesPerPage = 9;

// Fonction pour récupérer des recettes aléatoires
function getRandomRecipes() {
    const randomRecipes = [];
    const shuffledRecipes = [...data.recipes];
    for (let i = 0; i < 4; i++) {
        randomRecipes.push(shuffledRecipes.splice(Math.floor(Math.random() * shuffledRecipes.length), 1)[0]);
    }
    return randomRecipes;
}

// Fonction pour afficher les recettes aléatoires
function displayRandomRecipes() {
    const randomRecipes = getRandomRecipes();
    const recipesContainer = document.getElementById('recipes-list');
    recipesContainer.innerHTML = '';
    
    randomRecipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <h3>${recipe.name}</h3>
            <img src="${recipe.image}" alt="${recipe.name}" />
            <button onclick="viewRecipeDetails(${recipe.id})">Voir Détails</button>
        `;
        recipesContainer.appendChild(recipeCard);
    });
}

// Fonction pour afficher une recette détaillée
function viewRecipeDetails(recipeId) {
    const recipe = data.recipes.find(r => r.id === recipeId);
    const recipeDetails = `
        <h2>${recipe.name}</h2>
        <p>${recipe.duration} minutes</p>
        <ul>
            ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
        <h3>Étapes:</h3>
        <ol>
            ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
        </ol>
    `;
    alert(recipeDetails); // Cette ligne peut être remplacée par une autre logique d'affichage plus conviviale
}

// Fonction pour la recherche avec autocomplétion
function searchRecipes(event) {
    const searchQuery = event.target.value.toLowerCase();
    const results = data.recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchQuery) ||
        recipe.ingredients.some(ingredient =>
            ingredient.toLowerCase().includes(searchQuery)
        )
    );
    displaySearchResults(results);
}

// Affichage des résultats de recherche
function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = '';
    results.forEach(result => {
        const li = document.createElement('li');
        li.textContent = result.name;
        searchResultsContainer.appendChild(li);
    });
}

// Charger la page d'accueil
window.onload = function() {
    displayRandomRecipes();
    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('input', searchRecipes);
};
