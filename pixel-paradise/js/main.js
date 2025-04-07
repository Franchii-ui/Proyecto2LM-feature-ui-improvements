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
