import View from './view';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _successMessage = 'Recipe was successfully updated';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnClose = document.querySelector('.btn--close-modal');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerCloseWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  // SUBMIT FORM
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = this.querySelector('.upload__btn').querySelector('span');

      if (!btn) return;
      const dataArr = [...new FormData(this)];

      const data = Object.fromEntries(dataArr);

      handler(data);
    });
  }
  _generateMarkUp() {
    /* return `
    <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input value="TESTDATA" required name="title" type="${_data.title}" />
          <label>URL</label>
          <input value="${
            _data.sourceUrl
          }" required name="sourceUrl" type="text" />
          <label>Image URL</label>
          <input value="${_data.image}" required name="image" type="text" />
          <label>Publisher</label>
          <input value="${
            _data.publisher
          }" required name="publisher" type="text" />
          <label>Prep time</label>
          <input value="${
            _data.cookingTime
          }" required name="cookingTime" type="number" />
          <label>Servings</label>
          <input value="${
            _data.servings
          }" required name="servings" type="number" />
        </div>
        <div class="upload__column">
        <h3 class="upload__heading">Ingredients</h3>
        ${_data.ingredients.map((ing, i) =>
          this._generateMarkUpIngredient(ing, i).join('')
        )}
        </div>
        <button class="btn upload__btn">
          <svg>
            <use href="src/img/icons.svg#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>
    `; */
  }

  /* _generateMarkUpIngredient(ing) {
    return `
          <label>Ingredient ${i}</label>
          <input
            value="${ing.quantity},${ing.unit},${ing.description}"
            type="text"
            required
            name="ingredient-${i}"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
    `;
  }*/
}

export default new AddRecipeView();
