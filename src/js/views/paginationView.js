import View from './view.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2
import { Fraction } from 'fractional';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkUp() {
    const currPage = Number(this._data.page);

    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //Page1 and there are no other pages
    if (currPage === 1 && numPages === 1) {
      return '';
    }
    //Page1 and there are other pages
    if (currPage === 1 && numPages > 1) {
      return this._markUpRight(currPage + 1);
    }

    //Last Page
    if (currPage === numPages) {
      return this._markUpLeft(currPage - 1);
    }

    //Other pages
    if (currPage < numPages) {
      console.log('nnn' + currPage);
      return this._markUpLeft(currPage - 1) + this._markUpRight(currPage + 1);
    }
  }

  _markUpLeft(page) {
    return `
         <button data-goto = "${page}" class="btn--inline pagination__btn--prev">
            <span>${page}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
          </button>
    `;
  }
  // added a data attribute data-goto
  // The data-* attribute is used to store custom data private to the page or application.
  // This is used to acces data from the particular page
  _markUpRight(page) {
    return `
          <button data-goto = "${page}" class="btn--inline pagination__btn--next">
            <span>${page}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
    `;
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      //const page = btn.querySelector('span').innerHTML;

      const goToPage = +btn.dataset.goto;
      console.log(goToPage);

      handler(goToPage);
    });
  }
}

export default new PaginationView();
//this._parentElement.getElementsByTagName('SPAN')[0]
