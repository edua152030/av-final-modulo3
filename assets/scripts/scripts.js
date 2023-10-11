const charactersList = document.getElementById('charactersList');
const searchCharactersByName = document.getElementById('searchCharactersByName');
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');
const characterModalBody = document.getElementById('characterModalBody');

let response;
let currentPage = 1;
let isLoading = false;

async function loadCharacters(page = 1, name = '') {
  try {
    isLoading = true;

    const params = {
      name,
      page,
    };

    response = await api.get('/character', { params });
    const cards = response.data.results;

    prevPage.disabled = true;
    nextPage.disabled = true;

    charactersList.innerHTML = '';

    cards.forEach((character, index) => {
      const card = document.createElement('div');
      card.classList.add('characters-card');
      card.innerHTML = `
        <div>
          <img class="characters-image" src="${character.image}" data-bs-toggle="modal" data-bs-target="#exampleModal-${index}" data-character='${JSON.stringify(character)}'>
        </div>
        <div>
          <h2>${character.name}</h2>
          <p>${character.status} - ${character.origin.name}</p>
        </div>

        <!-- Modal -->
        <div class="modal fade animation3" id="exampleModal-${index}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Rick Morty Card</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <!-- Use character details here -->
                <img class="characters-image animation1" src="${character.image}">
                <h2>${character.name}</h2>
                <p class="animation2">Status: ${character.status}</p>
                <p>Origin: ${character.origin.name}</p>
              </div>
            </div>
          </div>
        </div>
      `;
      charactersList.appendChild(card);
      prevPage.disabled = response.data.info.prev ? false : true;
      nextPage.disabled = response.data.info.next ? false : true;
    });
  } catch (error) {
    console.log('Erro ao buscar personagens.', error);
  } finally {
    isLoading = false;
  }
}

loadCharacters();

searchCharactersByName.addEventListener('input', () => {
  currentPage = 1;
  loadCharacters(currentPage, searchCharactersByName.value);
});

prevPage.addEventListener('click', () => {
  if (currentPage > 1 && !isLoading) {
    currentPage--;
    loadCharacters(currentPage);
  }
});

nextPage.addEventListener('click', () => {
  if (currentPage < response.data.info.pages && !isLoading) {
    currentPage++;
    loadCharacters(currentPage);
  }
});
