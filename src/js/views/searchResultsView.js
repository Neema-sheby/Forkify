import View from './view.js';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg';

class SearchResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe found for your query! Please try again ;)';
  _successMessage = '';

  _generateMarkUp() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new SearchResultsView();
