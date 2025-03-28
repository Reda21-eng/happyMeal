// État initial
const state = {
    recipes: [],
    planning: JSON.parse(localStorage.getItem('planning')) || {}
};

// Jours de la semaine
const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

// Charger les recettes
async function loadRecipes() {
    try {
        const response = await fetch('data.json');
        state.recipes = await response.json();
    } catch (error) {
        console.error('Erreur lors du chargement des recettes:', error);
    }
}

// Afficher le planning
function renderPlanning() {
    const container = document.getElementById('planningGrid');
    if (!container) {
        console.error('Élément planningGrid non trouvé');
        return;
    }
    
    container.innerHTML = days.map(day => `
        <div class="day-card">
            <h3>${day}</h3>
            <select onchange="updatePlanning('${day}', this.value)">
                <option value="">Sélectionner une recette</option>
                ${state.recipes.map(recipe => `
                    <option value="${recipe.id}" ${state.planning[day] === recipe.id ? 'selected' : ''}>
                        ${recipe.name}
                    </option>
                `).join('')}
            </select>
        </div>
    `).join('');
}

// Mettre à jour le planning
function updatePlanning(day, recipeId) {
    if (recipeId) {
        state.planning[day] = recipeId;
    } else {
        delete state.planning[day];
    }
    localStorage.setItem('planning', JSON.stringify(state.planning));
    renderPlanning(); // Rafraîchir l'affichage
}

// Exporter le planning
function exportPlanning() {
    const blob = new Blob([state.planning.join('\n')], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'planning_des_repas".pdf';
    link.click();
}


// Vider le planning
function clearPlanning() {
    state.planning = {};
    localStorage.setItem('planning', JSON.stringify(state.planning));
    renderPlanning();
}

// Initialisation
async function init() {
    await loadRecipes();
    renderPlanning();
}

document.addEventListener('DOMContentLoaded', init);