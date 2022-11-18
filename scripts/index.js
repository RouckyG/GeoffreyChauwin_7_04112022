const Ingredients = [];
const Appliances = [];
const Tools = [];

const activatedFilters = [];

const filters = document.querySelectorAll(".filter");

// hide all filters dropdown
async function hideFiltersDropdown(){
    filters.forEach((filter) => {
        filter.querySelector("ul").style.display = "none";
    })
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
})

// get the recipe from the json file
async function getRecipes() {
    const response = await fetch("data/recipes.json");
    const data = await response.json();

    return data;
}

// update the activated Filters list by adding or removing the one the user clicked on
async function addActivatedFilters(item, itemType){
    const filter = {"item" : item, "itemType" : itemType}

    activatedFilters.push(filter);

    displayActivatedFilters()
    console.log(activatedFilters);
}

// update the activated Filters list by adding or removing the one the user clicked on
async function removeActivatedFilters(item, itemType){
    const filter = {"item" : item, "itemType" : itemType}

    activatedFilters.splice(activatedFilters.indexOf(filter),1);

    displayActivatedFilters()
    console.log(activatedFilters);
}

// display the activated Filters tags
async function displayActivatedFilters(){
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

        // <span class="tag tag_search">
        //             <p>Coco</p>
        //             <a href="#"><i class="fa-regular fa-circle-xmark"></i></a>   
        //         </span>
    })
}

// ingredients, appliance, ustensils
async function getFilters(data){

    data.forEach((recipe) =>{

        // TODO remove plurial from ingredients const

        recipe.ingredients.forEach((ingredient)=>{
            if(!Ingredients.includes(ingredient.ingredient.toLowerCase()) 
            && !Ingredients.includes(ingredient.ingredient.toLowerCase().substring(0, ingredient.ingredient.length - 1))
            && !Ingredients.includes(ingredient.ingredient.toLowerCase()+"s")){
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
    // console.log("Ingredients",Ingredients.sort())
    // console.log("Appliances",Appliances)
    // console.log("Tools",Tools)
}

// display data of each filter
async function displayFilterLists(){

    const filters = [["ingredient", Ingredients], ["appliance", Appliances], ["tool", Tools]];

    filters.forEach((filter)=> {
        displayFilterlist(filter[0], filter[1])
    })
}

// display data of a filter
async function displayFilterlist(itemsType, items){
    const filterDropdown = document.querySelector(".filter_"+itemsType+" .filter_dropdown ul");

    items.forEach((item)=>{
        const li = document.createElement("li");
        li.innerHTML = item;
        li.addEventListener("click", ()=>{addActivatedFilters(item, itemsType)});
        filterDropdown.appendChild(li);
    })
}

// display data of each recipes
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

    displayFilterLists();
    displayRecipes(recipes);
    document.querySelectorAll(".filter_input")
}

init();
