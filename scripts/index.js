const allIngredients = [];
const allAppliances = [];
const allTools = [];

const Filters = {
    ingredient : allIngredients,
    appliance : allAppliances,
    tool : allTools
}

const activatedFilters = [];

const searchInput = document.querySelector(".search_input input");

// add a filter when user enter a word in the search bar
function addSearchFilters(element, itemType){
    if(element.value.length >= 2){
        addActivatedFilters(element.value, itemType);
        element.value = "";
    }
}

searchInput.addEventListener("keyup", (e)=> { if(e.key == "Enter"){addSearchFilters(searchInput, "search")} });

const searchIcon = document.querySelector(".search_input i");
searchIcon.addEventListener("click", () => addSearchFilters(searchInput, "search"));

const filters = document.querySelectorAll(".filter");

// hide all filters dropdown
function hideFiltersDropdown(){
    filters.forEach((filter) => {
        filter.querySelector("ul").style.display = "none";
    })
}

// search a filter in a filter's dropdown
function searchFilterItem(element, itemType){
    if(element.value.length >= 2){
        // addActivatedFilters(element.value, "search");
        // element.value = "";
        const oldItems = Filters[itemType];
        const newItems = [];

        oldItems.forEach((item) => {
            if(item.includes(element.value)){
                newItems.push(item);
            }
        })

        Filters[itemType] = newItems;
        displayFilterlist(itemType, newItems)
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

        if(e.key == "Enter"){
            addSearchFilters(filterInput, itemType);
        }
        else if(filterInput.value.length >= 2){
            searchFilterItem(filterInput, itemType);
        }
        else {
            displayFilterlist(itemType, Filters[itemType]);
        }
    });
})

// get the recipe from the json file
async function getRecipes() {
    const response = await fetch("data/recipes.json");
    const data = await response.json();

    return data;
}

// update the activated Filters list by adding the one the user clicked on
function addActivatedFilters(item, itemType){
    const filter = {"item" : item, "itemType" : itemType}

    activatedFilters.push(filter);

    displayActivatedFilters()
}

// update the activated Filters list by removing the one the user clicked on
function removeActivatedFilters(item, itemType){
    activatedFilters.splice(activatedFilters.findIndex((filter) => filter.item === item),1);

    displayActivatedFilters()
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

// ingredients, appliance, ustensils
function getFilters(data){

    data.forEach((recipe) =>{

        recipe.ingredients.forEach((ingredient)=>{
            if(!allIngredients.includes(ingredient.ingredient.toLowerCase()) 
            && !allIngredients.includes(ingredient.ingredient.toLowerCase().substring(0, ingredient.ingredient.length - 1))
            && !allIngredients.includes(ingredient.ingredient.toLowerCase()+"s")){
                allIngredients.push(ingredient.ingredient.toLowerCase());
            }
        })

        if(!allAppliances.includes(recipe.appliance.toLowerCase())){
            allAppliances.push(recipe.appliance.toLowerCase());
        }

        recipe.ustensils.forEach((tool)=>{
            if(!allTools.includes(tool.toLowerCase())){
                allTools.push(tool.toLowerCase());
            }
        })
    });
}

// display data of each filter
function displayFilterLists(){

    const filters = [["ingredient", allIngredients], ["appliance", allAppliances], ["tool", allTools]];

    filters.forEach((filter)=> {
        displayFilterlist(filter[0], filter[1])
    })
}

function updateFilterLists(){

    const filters = [["ingredient", Filters.ingredient], ["appliance", Filters.appliances], ["tool", Filters.tools]];

    filters.forEach((filter)=> {
        displayFilterlist(filter[0], filter[1])
    })
}

// display data of a filter
function displayFilterlist(itemsType, items){
    const filterDropdown = document.querySelector(".filter_"+itemsType+" .filter_dropdown ul");
    filterDropdown.innerHTML = "";
    items.forEach((item)=>{
        const li = document.createElement("li");
        li.innerHTML = item;
        li.addEventListener("click", ()=>{addActivatedFilters(item, itemsType)});
        filterDropdown.appendChild(li);
    })
}

// display data of each recipes
function displayRecipes(recipes) {
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

    displayFilterLists();
    displayRecipes(recipes);
    document.querySelectorAll(".filter_input")
}

init();
