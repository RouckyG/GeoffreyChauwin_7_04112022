function recipeFactory(data) {
    const { id, name, servings, ingredients, time, description, appliance, ustensils } = data;

    function getRecipeCardDOM(){
        const article = document.createElement( "article" );
        article.classList.add("recipe");

        const img = document.createElement( "img" );
        img.classList.add("recipe_picture");
        // img.setAttribute( "src" , picture);
        // img.setAttribute( "alt" , "Picture of " + name);
        article.appendChild(img);

        const detail = document.createElement( "div" );
        detail.classList.add("recipe_detail");
        article.appendChild(detail);

        detail.appendChild(getRecipeHeaderDOM());

        detail.appendChild(getRecipeMainDOM());

        return article;
    }

    function getRecipeHeaderDOM(){
        const header = document.createElement( "div" );
        header.classList.add("recipe_header");

        const title = document.createElement( "h2" );
        title.classList.add("recipe_title");
        title.textContent = name;
        header.appendChild(title);

        const timeContainer = document.createElement( "div" );
        timeContainer.classList.add("recipe_time");
        header.appendChild(timeContainer);

        const timeIcon = document.createElement( "i" );
        timeIcon.classList.add("fa-regular", "fa-clock");
        timeContainer.appendChild(timeIcon);

        const recipeTime = document.createElement( "p" );
        recipeTime.textContent = time + " min";
        timeContainer.appendChild(recipeTime);

        return header;
    }

    function getRecipeMainDOM(){
        const main = document.createElement( "div" );
        main.classList.add("recipe_main");

        const ingredientsList = document.createElement( "ul" );
        ingredientsList.classList.add("recipe_ingredients");
        main.appendChild(ingredientsList);

        ingredients.forEach((ingredient) => {
            ingredientsList.appendChild(getIngredientDOM(ingredient));
        })

        const steps = document.createElement( "p" );
        steps.classList.add("recipe_steps");
        steps.textContent = description;
        main.appendChild(steps);

        return main;
    }

    function getIngredientDOM(data){
        const { ingredient, quantity, unit } = data;

        const li = document.createElement( "li" );

        li.innerHTML = "<span> "+ ingredient + (quantity? ": </span>" + quantity + " " + (unit ? unit : "") : "</span>");

        return li;
    }
    return { id, name, servings, ingredients, time, description, appliance, ustensils, getRecipeCardDOM }
}