const Ingredients = [];
const Appliances = [];
const Tools = [];

async function getRecipes() {
    const response = await fetch("data/recipes.json");
    const data = await response.json();

    return data;
}

// ingredients, appliance, ustensils
async function getFilters(data){

    data.forEach((recipe) =>{

        // TODO remove plurial from ingredients const

        recipe.ingredients.forEach((ingredient)=>{
            if(!Ingredients.includes(ingredient.ingredient.toLowerCase()) && !Ingredients.includes(ingredient.ingredient.toLowerCase().substring(0, ingredient.ingredient.length - 1))){
                Ingredients.push(ingredient.ingredient.toLowerCase());
            }
        })

        if(!Appliances.includes(recipe.appliance.toLowerCase())){
            Appliances.push(recipe.appliance.toLowerCase());
        }

        recipe.ustensils.forEach((tool)=>{
            if(!Tools.includes(tool.toLowerCase())){
                Tools.push(tool.toLowerCase());
            }
        })
    });
    console.log("Ingredients",Ingredients.sort())
    console.log("Appliances",Appliances)
    console.log("Tools",Tools)
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
    getFilters(recipes);
    displayRecipes(recipes);
}

init();
