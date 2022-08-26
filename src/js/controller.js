import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // Polyfill everyhting
import 'regenerator-runtime/runtime'; // Polyfill async/await

// if (module.hot) {
//   module.hot.accept();
// }

async function controlRecipes() {
  try {
    const recipeId = window.location.hash.slice(1);
    if (!recipeId) return; // Guard Clause for a blank Id
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // Fetching Recipe
    await model.loadRecipe(recipeId);

    // rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError(error);
  }
}

async function controlSearchResults() {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage());

    paginationView.render(model.state.search);
  } catch (err) {
    recipeView.renderError();
  }
}

function pageController(page) {
  resultsView.render(model.getSearchResultsPage(page));
  paginationView.render(model.state.search);
}

function controlServings(numServings) {
  model.updateServings(numServings);

  // Calling an update method to just update the text elements on the DOM instead of re-rendering the entire screen
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

function controlAddBookmark() {
  if (!model.state.recipe.isBookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
}

function controlBookmarks() {
  bookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    addRecipeView.renderSuccess();

    bookmarksView.render(model.state.bookmarks);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    recipeView.render(model.state.recipe);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
}

(function () {
  // Event Subscriber
  bookmarksView.addHandlerRender(controlBookmarks);

  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);

  paginationView.addHandlerClick(pageController);

  addRecipeView.addHandlerUploadRecipe(controlAddRecipe);
})();
