import icons from 'url:../../img/icons.svg';
import View from './view';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _buttonOpen = document.querySelector('.nav__btn--add-recipe');
  _buttonClose = document.querySelector('.btn--close-modal');

  _successMessage = `Recipe successfully uploaded!!`;

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _generateMarkup() {}

  _addHandlerShowWindow() {
    this._buttonOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    // this._buttonClose.addEventListener('click', this.toggleWindow.bind(this));
    // this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    [this._buttonClose, this._overlay].forEach(elemennt =>
      elemennt.addEventListener('click', this.toggleWindow.bind(this))
    );
  }

  addHandlerUploadRecipe(subscriberHandler) {
    this._parentElement.addEventListener('submit', function (event) {
      event.preventDefault();
      const recipeData = Object.fromEntries([...new FormData(this)]); // this here points tot the object on which the evet listener is called, that is the paret element
      subscriberHandler(recipeData);
    });
  }
}

export default new AddRecipeView();
