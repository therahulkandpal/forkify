import View from './view';
class SearchView extends View {
  #parentElement = document.querySelector('.search');

  #clearInput() {
    this.#parentElement.querySelector('.search__field').value = '';
  }

  getQuery() {
    const query = this.#parentElement
      .querySelector('.search__field')
      .value.trim();
    this.#clearInput();
    return query;
  }

  addHandlerSearch(subscriberHandler) {
    this.#parentElement.addEventListener('submit', function (event) {
      event.preventDefault();
      subscriberHandler();
    });
  }
}

export default new SearchView();
