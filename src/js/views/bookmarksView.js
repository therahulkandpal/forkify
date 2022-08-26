import icons from 'url:../../img/icons.svg';
import View from './view';
import previewView from './previewView';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it :)`;
  _successMessage = ``;

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }

  addHandlerRender(subscriberHandler) {
    window.addEventListener('load', subscriberHandler);
  }
}

export default new BookmarksView();
