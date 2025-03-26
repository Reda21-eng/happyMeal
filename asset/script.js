let state = {
    recipes: [],
    favorites: JSON.parse(localStorage.getItem('favorites')) || [],
    shoppingList: JSON.parse(localStorage.getItem('shoppingList')) || [],
    planning: JSON.parse(localStorage.getItem('planning')) || {},
    currentPage: 1
};

// Initialisation
window.addEventListener('DOMContentLoaded', async () => {
    await loadRecipes();
    showSection('home');
    renderRandomRecipes();
    renderPlanning();
});

async function loadRecipes() {
    try {
        const response = await fetch('recettes.json');
        state.recipes = await response.json();
        console.log(recipes);
    } catch (error) {
        console.error('Erreur de chargement des recettes:', error);
    }
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
    
    if(sectionId === 'recipes') renderAllRecipes();
    if(sectionId === 'shopping') renderShoppingList();
}

// Gestion de la recherche
document.getElementById('searchInput').addEventListener('input', function() {
    const term = this.value.toLowerCase();
    const results = state.recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(term) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(term))
    );
    showAutocomplete(results);
});

function showAutocomplete(results) {
    const container = document.getElementById('autocompleteList');
    container.innerHTML = results.slice(0, 5).map(recipe => `
        <div class="autocomplete-item" onclick="showRecipeModal('${recipe.id}')">
            ${recipe.name} - ${recipe.ingredients.slice(0, 2).join(', ')}...
        </div>
    `).join('');
}

// Gestion des recettes
function renderRandomRecipes() {
    const randomRecipes = [...state.recipes].sort(() => 0.5 - Math.random()).slice(0, 6);
    document.getElementById('randomRecipes').innerHTML = randomRecipes.map(recipeCard).join('');
}

function renderAllRecipes() {
    const start = (state.currentPage - 1) * 9;
    const paginated = state.recipes.slice(start, start + 9);
    document.getElementById('allRecipes').innerHTML = paginated.map(recipeCard).join('');
    renderPagination();
}

function recipeCard(recipe) {
    return `
        <div class="recipe-card" onclick="showRecipeModal('${recipe.id}')">
            ${state.favorites.includes(recipe.id) ? '<div class="favorite-star">⭐</div>' : ''}
            <h3>${recipe.name}</h3>
            <p>⏱ ${recipe.duration} min</p>
            <p>🍴 ${recipe.ingredients.length} ingrédients</p>
        </div>
    `;
}

// Gestion de la modale
function showRecipeModal(id) {
    const recipe = state.recipes.find(r => r.id === id);
    const modal = document.getElementById('recipeModal');
    modal.style.display = 'flex';
    
    document.getElementById('recipeDetail').innerHTML = `
        <h2>${recipe.name}</h2>
        <button class="btn ${state.favorites.includes(id) ? 'btn-danger' : 'btn-primary'}" 
                onclick="toggleFavorite('${id}')">
            ${state.favorites.includes(id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        </button>
        
        <h3>🍳 Ingrédients</h3>
        <ul>
            ${recipe.ingredients.map(ing => `
                <li class="ingredient-item">
                    ${ing}
                    <button class="btn btn-primary" onclick="addToShoppingList('${ing}')">+</button>
                </li>
            `).join('')}
        </ul>
        
        <h3>📝 Préparation</h3>
        <ol>
            ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
        </ol>
        
        <button class="btn btn-danger" onclick="closeModal()">Fermer</button>
    `;
}

function closeModal() {
    document.getElementById('recipeModal').style.display = 'none';
}

// Gestion des favoris
function toggleFavorite(id) {
    const index = state.favorites.indexOf(id);
    if(index === -1) {
        state.favorites.push(id);
    } else {
        state.favorites.splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(state.favorites));
    renderAllRecipes();
    closeModal();
}

// Gestion de la liste de courses
function addToShoppingList(ingredient) {
    if(!state.shoppingList.includes(ingredient)) {
        state.shoppingList.push(ingredient);
        localStorage.setItem('shoppingList', JSON.stringify(state.shoppingList));
        renderShoppingList();
    }
}

function renderShoppingList() {
    document.getElementById('shoppingItems').innerHTML = state.shoppingList.map(item => `
        <div class="ingredient-item">
            ${item}
            <button class="btn btn-danger" onclick="removeShoppingItem('${item}')">×</button>
        </div>
    `).join('');
}

function removeShoppingItem(item) {
    state.shoppingList = state.shoppingList.filter(i => i !== item);
    localStorage.setItem('shoppingList', JSON.stringify(state.shoppingList));
    renderShoppingList();
}

function exportShoppingList() {
    const blob = new Blob([state.shoppingList.join('\n')], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'liste_de_courses.txt';
    link.click();
}

function clearShoppingList() {
    state.shoppingList = [];
    localStorage.setItem('shoppingList', JSON.stringify(state.shoppingList));
    renderShoppingList();
}

// Ajoutez ici les fonctions pour la pagination et le planning
document.addEventListener("DOMContentLoaded",() =>{
    async function fetchData (){
        let query = await fetch('./data.json')
        let response = await query.json()
        console.log(response,'result')
        console.log(response)['data'][3]
    }
     let submit = document.getElementById('submit')   
    
    submit.addEventListener('click',() =>{
        console.log("clické")
        fetchData()
    })
})
