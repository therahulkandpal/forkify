import { API_URL, RES_PER_PAGE, FORKIFY_KEY } from './config.js';
import { ajax } from './helpers.js';

export const state = {
  recipe: {},
  bookmarks: [],
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
};

function createRecipeObject(data) {
  const { recipe } = data.data; // Destructuring recipe out of recipeData.data
  return {
    image: recipe.image_url,
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
}

export async function loadRecipe(recipeId) {
  try {
    const recipeData = await ajax(`${API_URL}${recipeId}?key=${FORKIFY_KEY}`);
    state.recipe = createRecipeObject(recipeData);

    if (state.bookmarks.some(bookmark => bookmark.id === recipeId))
      state.recipe.isBookmarked = true;
    else state.recipe.isBookmarked = false;
  } catch (err) {
    throw err;
  }
}

export async function loadSearchResults(query) {
  try {
    state.search.query = query;
    const searchResults = await ajax(
      `${API_URL}?search=${query}&key=${FORKIFY_KEY}`
    );

    state.search.results = searchResults.data.recipes.map(recipe => {
      return {
        image: recipe.image_url,
        id: recipe.id,
        publisher: recipe.publisher,
        title: recipe.title,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
}

export function getSearchResultsPage(page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
}

export function updateServings(numServings) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * numServings) / state.recipe.servings)
  );
  state.recipe.servings = numServings;
}

export function addBookmark(recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.isBookmarked = true;

  storeBookmarks();
}

export function removeBookmark(recipeId) {
  const index = state.bookmarks.findIndex(recipe => recipe.id === recipeId);
  state.bookmarks.splice(index, 1);

  if (recipeId === state.recipe.id) state.recipe.isBookmarked = false;

  storeBookmarks();
}

function storeBookmarks() {
  localStorage.setItem('forkifyBookmarks', JSON.stringify(state.bookmarks));
}

export async function uploadRecipe(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1])
      .map(ingredient => {
        const ingredientArr = ingredient[1].split(',').map(ing => ing.trim());
        if (ingredientArr.length !== 3)
          throw new Error(
            'Incorrect Ingredient Format! Please user the correct format'
          );
        const [quantity, unit, description] = ingredientArr;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });
    const recipe = {
      image_url: newRecipe.image,
      cooking_time: newRecipe.cookingTime,
      id: newRecipe.id,
      publisher: newRecipe.publisher,
      servings: newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,
      ingredients,
    };

    const uploadedData = await ajax(`${API_URL}?key=${FORKIFY_KEY}`, recipe);
    state.recipe = createRecipeObject(uploadedData);
    addBookmark(state.recipe);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

(function () {
  const savedBookmarks = localStorage.getItem('forkifyBookmarks');
  if (savedBookmarks) state.bookmarks = JSON.parse(savedBookmarks);
})();
