import { PokemonService } from "../services/PokemonService.js";
import { PokemonCard } from "./PokemonCard.js";
import { debounce } from "../utils/helpers.js";

// Clase CatalogPage
export class CatalogPage {
  constructor() {
    this.pokemonService = new PokemonService();
    this.pokemonData = [];
    this.filteredPokemon = [];
    this.searchTerm = "";
    this.typeFilter = "";
    this.isLoading = false;
  }

  // Renderización de la página
  render() {
    const page = document.createElement("div");
    page.className = "catalog-page py-8 bg-gray-100 min-h-screen";
    page.innerHTML = `
            <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-8">
                    <h1 class="text-4xl font-bold text-gray-800 mb-4">Catálogo Pokémon</h1>
                    <p class="text-xl text-gray-600">Explora la primera generación de Pokémon</p>
                </div>
                
                <!-- Search and Filters -->
                <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex-1">
                            <input type="text" id="search-input" placeholder="Buscar Pokémon..." 
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        </div>
                        <div>
                            <select id="type-filter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                <option value="">Todos los tipos</option>
                                <option value="normal">Normal</option>
                                <option value="fire">Fuego</option>
                                <option value="water">Agua</option>
                                <option value="electric">Eléctrico</option>
                                <option value="grass">Planta</option>
                                <option value="ice">Hielo</option>
                                <option value="fighting">Lucha</option>
                                <option value="poison">Veneno</option>
                                <option value="ground">Tierra</option>
                                <option value="flying">Volador</option>
                                <option value="psychic">Psíquico</option>
                                <option value="bug">Bicho</option>
                                <option value="rock">Roca</option>
                                <option value="ghost">Fantasma</option>
                                <option value="dragon">Dragón</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <!-- Loading State -->
                <div id="loading-state" class="text-center py-12">
                    <div class="loading-pokeball w-16 h-16 mx-auto mb-4">
                        <div class="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p class="text-gray-600">Cargando Pokémon...</p>
                </div>
                
                <!-- Pokemon Grid -->
                <div id="pokemon-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <!-- Pokemon cards will be inserted here -->
                </div>
            </section>
        `;

    return page;
  }

  //Función de montaje para cargar los Pokémon
  async onMount() {
    if (!this.isDataLoaded) {
        await this.loadPokemon();
    } else {
        this.hideLoading();
        this.displayPokemon(this.pokemonData);
    }
    this.attachEventListeners();
    //Solo cargar si no hay datos o no se está cargando
    if (this.pokemonData.length === 0 && !this.isLoading) {
      await this.loadPokemon();
    } else if (this.pokemonData.length > 0) {
    // Si ya hay datos, mostrarlos inmediatamente
      this.displayPokemon(this.pokemonData);
    }
  }

  // Función para adjuntar los event listeners de la página
  attachEventListeners() {
    const searchInput = document.getElementById("search-input");
    const typeFilter = document.getElementById("type-filter");

    if (searchInput) {
      searchInput.addEventListener(
        "input",
        debounce((e) => {
          this.searchTerm = e.target.value;
          this.filterAndDisplayPokemon();
        }, 300)
      );
    }

    if (typeFilter) {
      typeFilter.addEventListener("change", (e) => {
        this.typeFilter = e.target.value;
        this.filterAndDisplayPokemon();
      });
    }
  }

  // Función de carga de Pokémon
  async loadPokemon() {
    //Prevenir múltiples cargas simultáneas
    if (this.isLoading) return;

    const loadingState = document.getElementById("loading-state");
    const pokemonGrid = document.getElementById("pokemon-grid");

    try {
      this.isLoading = true;
      loadingState.style.display = "block";
      pokemonGrid.innerHTML = "";

      this.pokemonData = await this.pokemonService.fetchPokemonBatch(1, 150);
      this.filterAndDisplayPokemon();
    } catch (error) {
      console.error("Error loading Pokemon:", error);
      pokemonGrid.innerHTML =
        '<div class="col-span-full text-center text-red-600">Error cargando Pokémon. Inténtalo de nuevo.</div>';
    } finally {
      this.isLoading = false;
      loadingState.style.display = "none";
    }
  }

  // Función para filtrar y mostrar Pokémon
  filterAndDisplayPokemon() {
    this.filteredPokemon = this.pokemonService.filterPokemon(
      this.pokemonData,
      this.searchTerm,
      this.typeFilter
    );
    this.displayPokemon(this.filteredPokemon);
  }

  // Función para mostrar Pokémon
  displayPokemon(pokemonList) {
    const pokemonGrid = document.getElementById("pokemon-grid");

    if (pokemonList.length === 0) {
      pokemonGrid.innerHTML =
        '<div class="col-span-full text-center text-gray-600">No se encontraron Pokémon con esos criterios.</div>';
      return;
    }

    pokemonGrid.innerHTML = "";
    pokemonList.forEach((pokemon) => {
      const pokemonCard = new PokemonCard(pokemon);
      pokemonGrid.appendChild(pokemonCard.render());
    });
  }
}
