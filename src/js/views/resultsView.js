import icons from 'url:../../img/icons.svg';
import View from './view';
import previewView from './previewView';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipe found for given query. Please try again! :(`;
  _successMessage = ``;

  _generateMarkup() {
    return this._data
      .map(searchResult => previewView.render(searchResult, false))
      .join('');
  }
}

export default new ResultsView();
