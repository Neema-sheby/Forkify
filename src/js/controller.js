import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchResultsView from './views/searchResultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipies = async function () {
  try {
    const id = window.location.hash.slice(1);
    //console.log(id);

    if (!id) return; // can avoid errors

    // 0).LOADING SPINNER
    recipeView.renderSpinner();

    // 1) UPDATING BOOKMARKS

    bookmarkView.update(model.state.bookmarks);

    // 2) RESULTS VIEW TO MARK SELECTED SEARCH RESULT

    searchResultsView.update(model.getSearchResultPage());

    // 3 LOADING RECIPE FROM module.js
    await model.loadRecipe(id);

    // 4  RENDERING RECIPE
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

// SEARCH RESULT IMPLEMENTATION
const controlSearchResults = async function () {
  try {
    searchResultsView.renderSpinner();

    // 1)Get Search query
    const query = searchView.getQuery();

    if (!query) return;

    //2)Load Search result
    await model.loadSearchResults(query);

    //3)Render results as per pagination
    //searchResultsView.render(model.state.search.results);

    searchResultsView.render(model.getSearchResultPage());

    //4) Render Pagination

    paginationView.render(model.state.search);
  } catch (err) {
    searchResultsView.renderError();
  }
};

// CONTROL PAGINATION
const controlPagination = function (goToPage) {
  // Render results for next page
  searchResultsView.render(model.getSearchResultPage(goToPage));

  // Render Pagination : Next page
  paginationView.render(model.state.search);
};

// CONTROL SERVINGS
const controlServings = function (newServings) {
  // Update ingredient quantity
  model.updateServings(newServings);
  //Update Recipe view

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

// CONTROL BOOKMARKS - ADD OR DELETE

const controlAddBookmark = function () {
  // 1. ADD OR REMOVE BOOKMARKS
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe);
  }

  //2. UPDATE RECIPE VIEW
  recipeView.update(model.state.recipe);

  //3. RENDER THE BOOKMARKS
  bookmarkView.render(model.state.bookmarks);
};

// RENDER THE BOOKMARKS SAVED IN LOCAL STORAGE
const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

// UPLOAD NEW RECIPE DATA
const controlAddRecipe = async function (newRecipe) {
  try {
    //SHOW LOADING SPINNER
    addRecipeView.renderSpinner();

    // UPLOAD NEW RECIPE DATA
    await model.uploadRecipe(newRecipe);

    // UPDATE THE RECIPE VIEW
    recipeView.render(model.state.recipe);

    // RENDER THE BOOKMARK
    bookmarkView.render(model.state.bookmarks);

    // DELAY CLOSING THE FORM
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    // CHANGE id IN URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // DISPLAY SUCCESS MESSAGE
    addRecipeView.renderSuccessMessage();
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

//PUBLISHER- SUBSCRIBER PATTERN (Recipe view)
const init = function () {
  bookmarkView.addHandlerbookmark(controlBookmarks);
  recipeView.addHandlerRender(controlRecipies);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerbookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
