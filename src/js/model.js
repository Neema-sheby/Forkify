import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, LOAD_PAGE_NUM, KEY } from './config.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: LOAD_PAGE_NUM,
  },
  bookmarks: [],
};
//import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }),
  };
};

// LOAD RECIPE
export const loadRecipe = async function (id) {
  try {
    //const data = await getJSON(`${API_URL}/${id}`);
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    console.log(state.recipe.ingredients);
    if (state.bookmarks.some(b => b.id === state.recipe.id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    //console.log(state.recipe);
  } catch (err) {
    console.log(`${err}, 👽👽👽`);
    throw err;
  }
};

//LOAD SERACH RESULTS
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    //const data = await getJSON(`${API_URL}?search=${query}`);
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

// PAGINATION
export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

// UPDATE SERVINGS
export const updateServings = function (newServings) {
  const ingds = state.recipe.ingredients;

  const newIngds = ingds.map(ing => {
    ing = {
      quantity: (ing.quantity / state.recipe.servings) * newServings,
      unit: ing.unit,
      description: ing.description,
    };

    return ing;
  });

  //update recipe servings and ingredients
  state.recipe.ingredients = newIngds;
  state.recipe.servings = newServings;
};

// STORE BOOKMARKS IN LOCAL STORAGE
const localStoreBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// ADD BOOKMARKS
export const addBookmark = function (recipe) {
  // add bookmarks
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  localStoreBookmarks();
};

// REMOVE BOOKMARKS
export const deleteBookmark = function (recipe) {
  // Delete bookmarks
  const index = state.bookmarks.findIndex(b => b.id === recipe.id);
  state.bookmarks.splice(index, 1);

  //Mark current recipe as not bookmarked

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = false;

  localStoreBookmarks();
};

// GET BOOKMARK FROM LOCAL STORAGE
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

// UPLOAD TO API
export const uploadRecipe = async function (newRecipe) {
  try {
    //console.log(newRecipe);
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] != '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity, unit, description };
      });

    const recipe = {
      // id: recipe.id,
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };
    //const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

init();

// CLEAR BOOKMARKS(FOE DEVELOPERS USE)
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
//clearBookmarks();
