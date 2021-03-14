import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  /**
   * Render te recieved object to the DOM
   * @param {object | Object[]} data The data to be rendered
   * @param {boolean} [render = true] If false, create markup string
   * @returns {undefined | string} A markup key is returned if render = false
   * @this {Object}View instance
   * @author Neema Sheby
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const markUp = this._generateMarkUp();

    if (!render) return markUp;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  // UPDATE RENDER (code to update only the txt OF DOM that needs to be updated )

  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkUp();

    //Creates a DocumentFragment object from the specified HTML formatted text, newMarkup

    const newDOM = document.createRange().createContextualFragment(newMarkup);

    // creates an array instance of newDOM text
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // creates an array instance of currentElements in the _parentElement DOM.
    const currElements = Array.from(this._parentElement.querySelectorAll('*'));

    //console.log(currElements, newElements);

    // Comparing current DOM with newOne for detecting changes using isequalnode.
    newElements.forEach((newEl, i) => {
      const currEl = currElements[i];
      //console.log(currEl, newEl.isEqualNode(currEl));

      //updates changed text
      if (
        !newEl.isEqualNode(currEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        //console.log('🎇🎇🎇', newEl.firstChild);

        currEl.textContent = newEl.textContent;
      }

      //updates changed attributes
      if (!newEl.isEqualNode(currEl)) {
        //console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr =>
          currEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  //CLEAR PARENT ELEMENT--------------------
  _clear() {
    this._parentElement.innerHTML = '';
  }

  // LOADING SPINNER------------------------
  renderSpinner() {
    const html = `<div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  // RENDER ERROR-----------------------------
  renderError(errorMessage = this._errorMessage) {
    const markup = `
      <div class="error">
          <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${errorMessage}</p>       
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // RENDER SUCCESS MESSAGE-----------------
  renderSuccessMessage(successMessage = this._successMessage) {
    const markup = `
      <div class="error">
          <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${successMessage}</p>       
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
