// Importaciones con nombres de archivo corregidos y rutas relativas
import { loadJSON, loadYAML } from './dataLoader.js';
import { renderGameCards, renderDetailView } from './uiRender.js'; // Corregido: uiRender.js
import { setupEventListeners } from './eventHandler.js'; // Corregido: eventHandler.js

document.addEventListener('DOMContentLoaded', async () => {
    // Estado inicial de la aplicación
    const appState = {
        games: [],               // Lista de juegos cargados desde el JSON
        config: {},              // Configuración cargada desde el YAML
        currentFilter: 'todos',  // Filtro inicial (todos los juegos)
        currentPage: 1,          // Página inicial para la paginación
        currentView: 'cards',    // Vista inicial ('cards' o 'detail')
        selectedGameId: null     // ID del juego seleccionado para la vista de detalles
    };

    try {
        // Carga de datos con rutas relativas
        appState.games = await loadJSON('data/games.json');
        appState.config = await loadYAML('data/config.yaml');

        // --- Aplicar configuraciones iniciales desde config.yaml ---
        // Tema visual (claro/oscuro)
        if (appState.config.visual && appState.config.visual.theme) {
            document.body.setAttribute('data-bs-theme', appState.config.visual.theme);
        }
        // Idioma (si afecta a algún atributo lang)
        if (appState.config.language) {
            document.documentElement.lang = appState.config.language;
        }
        // Ocultar imágenes si está configurado (aunque uiRender ya lo maneja)
        if (appState.config.visual && !appState.config.visual.showImages) {
            console.log("Configuración: No mostrar imágenes.");
        }

    } catch (error) {
        // Manejo de errores si falla la carga de datos
        console.error('Error loading initial data:', error);
        const gameGrid = document.getElementById('gameGrid');
        if (gameGrid) {
            gameGrid.innerHTML = '<p class="text-danger text-center">Error loading game data. Please try again later.</p>';
        }
        return; // Detiene la ejecución si los datos no cargan
    }

    /**
     * Función principal para actualizar la vista según el estado actual.
     */
    function updateView() {
        const gameGrid = document.getElementById('gameGrid');
        const detailView = document.getElementById('detailView');

        if (appState.currentView === 'cards') {
            // Mostrar la vista de tarjetas
            gameGrid.style.display = 'flex';
            detailView.style.display = 'none';

            // Filtrar juegos según el estado actual
            const filteredGames = appState.games.filter(game =>
                appState.currentFilter === 'todos' || game.genre.toLowerCase() === appState.currentFilter.toLowerCase()
            );

            // Renderizar las tarjetas de juego
            renderGameCards(filteredGames, appState.config);
        } else if (appState.currentView === 'detail') {
            // Mostrar la vista de detalles
            gameGrid.style.display = 'none';
            detailView.style.display = 'block';

            // Renderizar la vista de detalles del juego seleccionado
            renderDetailView(appState.selectedGameId, appState.games, appState.config);
        }
    }

    /**
     * Configura los listeners de eventos para manejar interacciones.
     */
    function setupDetailListeners() {
        const gameGrid = document.getElementById('gameGrid');

        // Delegación de eventos para los botones "View Details"
        gameGrid.addEventListener('click', (event) => {
            if (event.target.tagName === 'A' && event.target.href.includes('#detail')) {
                event.preventDefault();
                const gameId = event.target.href.split('#detail/')[1];
                appState.currentView = 'detail';
                appState.selectedGameId = gameId;
                updateView();
            }
        });

        // Listener para volver a la vista de tarjetas desde la vista de detalles
        const detailView = document.getElementById('detailView');
        detailView.addEventListener('click', (event) => {
            if (event.target.id === 'backToCards') {
                appState.currentView = 'cards';
                appState.selectedGameId = null;
                updateView();
            }
        });
    }

    // Configurar los listeners de eventos (filtros, paginación, clics en tarjetas, etc.)
    setupEventListeners(appState, updateView);
    setupDetailListeners();

    // Llamada inicial para mostrar los juegos al cargar la página
    updateView();
});
// dark-mode.js
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Check for user's preference in local storage
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';

    // Apply dark mode if it was previously enabled
    if (isDarkMode) {
        body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }

    // Toggle dark mode on switch change
    darkModeToggle.addEventListener('change', () => {
        body.classList.toggle('dark-mode');

        // Store user's preference in local storage
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });
});

// This is the main.js file, responsible for loading and displaying the games.
// It's currently commented out, so it won't affect the website.

// import { load } from 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js'; // Import the js-yaml library for parsing YAML.

// document.addEventListener('DOMContentLoaded', () => { // Wait for the HTML to be fully loaded.
//     const gameGrid = document.getElementById('gameGrid'); // Get the element where the game cards will be displayed.

//     // Function to fetch and parse YAML data.
//     const fetchYamlData = async () => {
//         try {
//             const response = await fetch('data.yaml'); // Fetch the data.yaml file.
//             const yamlText = await response.text(); // Get the text content of the YAML file.
//             return load(yamlText); // Parse the YAML text into a JavaScript object.
//         } catch (error) {
//             console.error('Error fetching or parsing YAML:', error); // Log an error if something goes wrong.
//             return null; // Return null if there's an error.
//         }
//     };

//     // Function to fetch and parse JSON data.
//     const fetchJsonData = async () => {
//         try {
//             const response = await fetch('data/games.json'); // Fetch the games.json file.
//             return await response.json(); // Parse the JSON data into a JavaScript array of objects.
//         } catch (error) {
//             console.error('Error fetching or parsing JSON:', error); // Log an error if something goes wrong.
//             return []; // Return an empty array if there's an error.
//         }
//     };

//     // Function to create a game card.
//     const createGameCard = (game) => {
//         const card = document.createElement('div'); // Create a new div element.
//         card.classList.add('col'); // Add the 'col' class for Bootstrap grid layout.
//         card.innerHTML = ` // Set the HTML content of the card.
//             <div class="card h-100">
//                 <img src="${game.image}" class="card-img-top" alt="${game.title}">
//                 <div class="card-body">
//                     <h5 class="card-title">${game.title}</h5>
//                     <p class="card-text">${game.description}</p>
//                     <p class="card-text"><small class="text-muted">Genre: ${game.genre}</small></p>
//                 </div>
//             </div>
//         `;
//         return card; // Return the created card element.
//     };

//     // Function to display games.
//     const displayGames = async () => {
//         const yamlData = await fetchYamlData(); // Fetch the YAML data.
//         const allGames = await fetchJsonData(); // Fetch the JSON data.

//         if (!yamlData) { // Check if the YAML data was loaded successfully.
//             console.error('YAML data is missing or invalid.'); // Log an error if it wasn't.
//             return; // Exit the function if there's no YAML data.
//         }

//         const maxGamesToDisplay = yamlData.display.maxGames || 6; // Get the maximum number of games to display from YAML, or default to 6.
//         const gameIdsToDisplay = yamlData.display.gameIds || []; // Get the list of game IDs to display from YAML, or default to an empty array.

//         const gamesToDisplay = allGames.filter(game => // Filter the games based on the IDs in YAML.
//             gameIdsToDisplay.includes(game.id) // Keep only the games whose IDs are in the gameIdsToDisplay array.
//         ).slice(0, maxGamesToDisplay); // Limit the number of games to display to maxGamesToDisplay.

//         gamesToDisplay.forEach(game => { // Loop through the games to display.
//             const card = createGameCard(game); // Create a card for each game.
//             gameGrid.appendChild(card); // Add the card to the gameGrid element.
//         });
//     };

//     // Initial display of games.
//     displayGames(); // Call the displayGames function to start the process.
// });

// Explanation :
// - This file is written in JavaScript, the language of the web.
// - The '//' symbol indicates a single-line comment.
// - '/*' and '*/' are used for multi-line comments.
// - 'import' is used to bring in external libraries, like js-yaml.
// - 'async' and 'await' are used for asynchronous operations (like fetching files).
// - 'fetch' is used to get data from files or URLs.
// - 'document.getElementById' is used to find elements in the HTML.
// - 'createElement' is used to create new HTML elements.
// - 'classList.add' is used to add CSS classes to elements.
// - 'innerHTML' is used to set the HTML content of an element.
// - 'filter' is used to create a new array with elements that meet a certain condition.
// - 'slice' is used to get a portion of an array.
// - 'forEach' is used to loop through an array.
// - 'appendChild' is used to add an element to another element.
// - If you want to use this file, you need to remove the '//' from the start of each line.
