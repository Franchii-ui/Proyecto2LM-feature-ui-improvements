/**
 * Carga un archivo JSON desde la ruta especificada.
 * @param {string} filePath - Ruta relativa al archivo JSON.
 * @returns {Promise<Object>} - Devuelve una promesa que resuelve con los datos JSON cargados.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
async function loadJSON(filePath) {
    const response = await fetch(filePath); // Realiza la solicitud al archivo JSON
    if (!response.ok) throw new Error(`Error loading JSON: ${response.status}`); // Verifica si la respuesta es válida
    return response.json(); // Devuelve los datos JSON como un objeto
}

/**
 * Carga un archivo YAML desde la ruta especificada.
 * @param {string} filePath - Ruta relativa al archivo YAML.
 * @returns {Promise<Object>} - Devuelve una promesa que resuelve con los datos YAML convertidos a JSON.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
async function loadYAML(filePath) {
    const response = await fetch(filePath); // Realiza la solicitud al archivo YAML
    if (!response.ok) throw new Error(`Error loading YAML: ${response.status}`); // Verifica si la respuesta es válida
    const yamlText = await response.text(); // Obtiene el contenido del archivo como texto
    return jsyaml.load(yamlText); // Convierte el texto YAML a un objeto JSON
}

// Exporta las funciones para que puedan ser utilizadas en otros módulos
export { loadJSON, loadYAML };