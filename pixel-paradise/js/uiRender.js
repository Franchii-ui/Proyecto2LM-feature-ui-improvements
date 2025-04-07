/**
 * Renderiza las tarjetas de juegos en el contenedor principal.
 * @param {Array} games - Lista de juegos a renderizar.
 * @param {Object} config - Configuración de la aplicación (por ejemplo, si mostrar imágenes).
 */
function renderGameCards(games, config) {
    const gameGrid = document.getElementById('gameGrid');
    gameGrid.innerHTML = ''; // Limpia el contenedor antes de renderizar

    // Itera sobre cada juego y crea una tarjeta
    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'col'; // Clase de Bootstrap para diseño responsivo
        card.innerHTML = `
            <div class="card h-100">
                ${config.visual.showImages ? `<img src="${game.image}" class="card-img-top" alt="${game.title}">` : ''}
                <div class="card-body">
                    <h5 class="card-title">${game.title}</h5>
                    <p class="card-text">${game.description}</p>
                    <a href="#detail/${game.id}" class="btn btn-primary">View Details</a>
                </div>
            </div>
        `;
        gameGrid.appendChild(card); // Añade la tarjeta al contenedor
    });
}

/**
 * Renderiza la vista de detalles de un juego específico.
 * @param {string} gameId - ID del juego a mostrar en detalle.
 * @param {Array} games - Lista de juegos disponibles.
 * @param {Object} config - Configuración de la aplicación (por ejemplo, si mostrar imágenes).
 */
function renderDetailView(gameId, games, config) {
    const game = games.find(g => g.id === gameId); // Encuentra el juego por su ID
    const detailViewContainer = document.getElementById('detailView');
    detailViewContainer.innerHTML = `
        <h2>${game.title}</h2>
        <p>${game.description}</p>
        ${config.visual.showImages ? `<img src="${game.image}" alt="${game.title}">` : ''}
        <button id="backToCards" class="btn btn-secondary mt-3">Back to Cards</button>
    `;
}



export { renderGameCards, renderDetailView };