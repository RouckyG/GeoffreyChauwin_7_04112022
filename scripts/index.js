const allIngredients = [];
const allAppliances = [];
const allTools = [];
const AllRecipes = [];
const Recipes = [];

const Filters = {
    ingredient : [],
    appliance : [],
    tool : []
}

const activatedFilters = [];

const searchInput = document.querySelector(".search_input input");

// add a filter when user write in the search bar
function addSearch(){
    if(searchInput.value.length >= 3){
        removeSearchFilter();
        addSearchFilter(searchInput.value, "search", true)
    }
    else {
        removeSearchFilter();
        updateRecipeList();
        displayActivatedFilters();
    }
    // displayFilterlist("search", Filters["search"]);
}

// update the activated Filters list by adding the one the user clicked on
function addSearchFilter(item, itemType, isTyped = false){
    const filter = {"item" : item, "itemType" : itemType, "isTyped" : isTyped}

    activatedFilters.push(filter);

    const filterInput = document.querySelector(`.filter_${itemType} input`);

    updateRecipeList();

    displayActivatedFilters();
    // updateSearchFilter(filterInput,itemType);
}

function removeSearchFilter(){
    if(activatedFilters.findIndex((filter) => filter.itemType === "search") >= 0){
        activatedFilters.splice(activatedFilters.findIndex((filter) => filter.itemType === "search"),1)
    }
}

// add a filter when user enter a word in the search bar
function addFilter(element, itemType, isTyped = true){
    if(element.value.length >= 3){
        addActivatedFilters(element.value, itemType, isTyped);
        element.value = "";
        displayFilterlist(itemType, Filters[itemType]);
    }
}

searchInput.addEventListener("keyup", ()=> {addSearch(searchInput, "search", true)});

const filters = document.querySelectorAll(".filter");

// hide all filters dropdown
function hideFiltersDropdown(){
    filters.forEach((filter) => {
        filter.querySelector("ul").style.display = "none";
    })
}

// search a filter in a filter's dropdown
function updateSearchFilter(element, itemType){
    hideFiltersDropdown();
    if(element.value.length >= 3){

        const oldItems = Filters[itemType];
        const newItems = [];

        oldItems.forEach((item) => {
            if(item.includes(element.value)){
                newItems.push(item);
            }
        })

        displayFilterlist(itemType, newItems)
    }
    else{
        displayFilterlist(itemType, Filters[itemType])
    }
}

// add the event listener on all arrows for show the dropdown list and hide the others
filters.forEach((filter) => {
    const arrow = filter.querySelector("button");
    const dropdown = filter.querySelector(".filter_dropdown ul");

    arrow.addEventListener("click", ()=>{
        if(dropdown.style.display !== "flex"){
            hideFiltersDropdown()
            dropdown.style.display = "flex";
        }
        else{
            dropdown.style.display = "none";
        }
    })

    const filterInput = filter.querySelector(".filter_input input");
    const itemType = filter.classList[1].split("_")[1];
    filterInput.addEventListener("keyup", (e)=> {

    updateSearchFilter(filterInput, itemType);
    });
})

// get the recipe from the json file
async function getRecipes() {
    const response = await fetch("data/recipes.json");
    const data = await response.json();

    return data;
}

function doesStringInclude(filter, item){
    recipeName = item.toLowerCase().split('');
    let isSame = 0;

    for(let i = 0 ; i < recipeName.length ; i++){
        if(recipeName[i] === filter[isSame]){
            isSame++;

            if(isSame === filter.length){
                return true;
            }
        }
        else{
            isSame = 0;
        }
    }

    return false;
}

// use one filter all Recipes and return the filtered list of recipes
function isRecipesInFilter(filter, recipeList){
    const newRecipeList = [];

    for(let i2 = 0 ; i2 < recipeList.length ; i2++){
        let recipe = recipeList[i2];

        if(filter.itemType === "ingredient" ){
            for(let i3 = 0 ; i3 < recipe.ingredients.length; i3++){
                let ingredient = recipe.ingredients[i3];

                if(filter.isTyped && ingredient.ingredient.toLowerCase.includes(filter.item) && !newRecipeList.includes(recipe)){
                    newRecipeList.push(recipe);
                }
                else if (ingredient.ingredient.toLowerCase() === filter.item && !newRecipeList.includes(recipe)) {
                    newRecipeList.push(recipe);
                }
            }
        }
        else if(filter.itemType === "appliance"){
            if (filter.isTyped && recipe.appliance.toLowerCase().includes(filter.item) && !newRecipeList.includes(recipe)){
                newRecipeList.push(recipe);
            }
            else if (recipe.appliance.toLowerCase() === filter.item && !newRecipeList.includes(recipe)) {
                newRecipeList.push(recipe);
            }
        }
        else if(filter.itemType === "tool"){
            if (recipe.ustensils.join(' ').toLowerCase().includes(filter.item) && !newRecipeList.includes(recipe)) {
                newRecipeList.push(recipe);
            }
            else {
                recipe.ustensils.forEach((ustensil) => {
                    if (filter.isTyped && ustensil.toLowerCase().includes(filter.item) && !newRecipeList.includes(recipe)){
                        newRecipeList.push(recipe);
                    }
                })
            }
        }
        else if(filter.itemType === "search"){
            for(let i3 = 0 ; i3 < recipeList.length; i3++){

                if(newRecipeList[i3] !== recipe){
                    if(doesStringInclude(filter.item, recipe.name)
                    || doesStringInclude(filter.item, recipe.description)
                    || doesStringInclude(filter.item, recipe.appliance)){
                        newRecipeList.push(recipe);
                        break;
                    }
                    else{
                        for(let i4 = 0 ; i4 < recipe.ustensils.length ; i4++){
                            if(doesStringInclude(filter.item, recipe.ustensils[i4])){
                                newRecipeList.push(recipe);
                                break;
                            }
                        }
                        for(let i4 = 0 ; i4 < recipe.ingredients.length ; i4++){
                            if(doesStringInclude(filter.item, recipe.ingredients[i4].ingredient)){
                                newRecipeList.push(recipe);
                                break;
                            }
                        }
                    }
                }
                else{
                    break;
                }
            }
        }
    }
    return newRecipeList;
}

// use all filters on all Recipes and return the final filtered list of recipes
function filterRecipes(filterList, recipeList){

    let newRecipeList = [...recipeList];
    const newFilterList = [...filterList];

    if(newFilterList.length > 0) {
        for(let i = 0 ; i< newFilterList.length ; i++){
            let filter = newFilterList[i];

            newRecipeList = [...isRecipesInFilter(filter, newRecipeList)]
        }
    }

    return newRecipeList;

}

// update the temporary Recipe List by filtering it with the activated filters
function updateRecipeList(){

    const newRecipeList = filterRecipes([...activatedFilters], AllRecipes);

    Recipes.splice(0,Recipes.length);
    Recipes.push(...newRecipeList)

    updateFilters(newRecipeList)
    displayRecipes(Recipes);

}

// update the activated Filters list by adding the one the user clicked on
function addActivatedFilters(item, itemType, isTyped = false){
    const filter = {"item" : item, "itemType" : itemType, "isTyped" : isTyped}

    activatedFilters.push(filter);

    const filterInput = document.querySelector(`.filter_${itemType} input`);
    filterInput.value = ""; 

    updateRecipeList();

    displayActivatedFilters();
    updateSearchFilter(filterInput,itemType);
}

// update the activated Filters list by removing the one the user clicked on
function removeActivatedFilters(item){
    
    activatedFilters.splice(activatedFilters.findIndex((filter) => filter.item === item),1);

    updateRecipeList();
    displayActivatedFilters();
}

// display the activated Filters tags
function displayActivatedFilters(){
    const activatedFiltersList = document.querySelector(".tags")
    activatedFiltersList.innerHTML = "";

    activatedFilters.forEach((filter) => {
        const filterSpan = document.createElement("span");
        filterSpan.classList.add("tag", "tag_"+filter.itemType);
        activatedFiltersList.appendChild(filterSpan);

        const p = document.createElement("p");
        p.innerHTML = filter.item;
        filterSpan.appendChild(p);

        const a = document.createElement("a");
        a.addEventListener("click", (e) => {
            e.preventDefault();
            removeActivatedFilters(filter.item, filter.itemType);
        })
        filterSpan.appendChild(a);

        const i = document.createElement("i");
        i.classList.add("fa-regular", "fa-circle-xmark")
        a.appendChild(i);
    })
}

// update the list of ingredients, appliances and tools
function updateFilters(recipes){

    Filters.ingredient.splice(0,Filters.ingredient.length);
    Filters.appliance.splice(0,Filters.appliance.length);
    Filters.tool.splice(0,Filters.tool.length);

    const alreadyActive = [];
    
    activatedFilters.forEach((activatedFilter) => {
        alreadyActive.push(activatedFilter.item)
    })

    recipes.forEach((recipe) =>{

        recipe.ingredients.forEach((ingredient)=>{
            if(!Filters.ingredient.includes(ingredient.ingredient.toLowerCase()) 
            && !Filters.ingredient.includes(ingredient.ingredient.toLowerCase().substring(0, ingredient.ingredient.length - 1))
            && !Filters.ingredient.includes(ingredient.ingredient.toLowerCase()+"s")
            && !alreadyActive.includes(ingredient.ingredient.toLowerCase())){
                Filters.ingredient.push(ingredient.ingredient.toLowerCase());
            }
        })

        if(!Filters.appliance.includes(recipe.appliance.toLowerCase())
        && !alreadyActive.includes(recipe.appliance.toLowerCase())){
            Filters.appliance.push(recipe.appliance.toLowerCase());
        }

        recipe.ustensils.forEach((tool)=>{
            if(!Filters.tool.includes(tool.toLowerCase())
            && !alreadyActive.includes(tool.toLowerCase())){
                Filters.tool.push(tool.toLowerCase());
            }
        })
    });

    displayFilterLists()
}

// display data of each filter
function displayFilterLists(){

    const filters = [["ingredient", Filters.ingredient], ["appliance", Filters["appliance"]], ["tool", Filters["tool"]]];

    filters.forEach((filter)=> {
        displayFilterlist(filter[0], filter[1], false)
    })
}

// display data of a filter
function displayFilterlist(itemsType, items, isDisplayed = true){
    if(itemsType !== "search"){
        const filterDropdown = document.querySelector(`.filter_${itemsType} .filter_dropdown ul`);
        
        if(isDisplayed){
            filterDropdown.style.display = "flex";
        }
        filterDropdown.innerHTML = "";
        
        items.forEach((item)=>{
            const li = document.createElement("li");
            li.innerHTML = item;
            li.addEventListener("click", ()=>{addActivatedFilters(item, itemsType)});
            filterDropdown.appendChild(li);
        })
    }
}

// display data of each recipes
function displayRecipes(recipes) {
    const recipesSection = document.querySelector(".recipes");

    recipesSection.innerHTML = "";

    recipes.forEach((recipe) => {
        const recipeModel = recipeFactory(recipe);
        const recipeCardDOM = recipeModel.getRecipeCardDOM();
        recipesSection.appendChild(recipeCardDOM);
    });
}

// start all functions allowing the display of the page's element
async function init() {
    const { recipes } = await getRecipes();

    AllRecipes.push(...recipes);
    Recipes.push(...AllRecipes);

    updateFilters(AllRecipes);
    hideFiltersDropdown()
    
    allIngredients.push(...Filters.ingredient);
    allAppliances.push(...Filters.appliance);
    allTools.push(...Filters.tool);

    displayRecipes(AllRecipes);
    document.querySelectorAll(".filter_input")
}

init();
