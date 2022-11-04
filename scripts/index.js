async function getRecipes() {
    const response = await fetch("data/recipes.json");
    const data = await response.json();

    return data;
}

// display de data of each recipes
async function displayRecipes(recipes) {
    const recipesSection = document.querySelector(".recipes");

    recipes.forEach((recipe) => {
        const recipeModel = recipeFactory(recipe);
        const recipeCardDOM = recipeModel.getRecipeCardDOM();
        recipesSection.appendChild(recipeCardDOM);
    });
}

// start all functions allowing the display of the page's element
async function init() {
    const { recipes } = await getRecipes();
    displayRecipes(recipes);
}

init();
