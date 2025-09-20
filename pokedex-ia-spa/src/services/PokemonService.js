export class PokemonService {
  // Constructor
  constructor() {
    this.baseURL = "https://pokeapi.co/api/v2";
    this.cache = new Map();
  }
 // Fetch API para obtener los Pokémon
  async fetchPokemon(id) {
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }

    try {
      const response = await fetch(`${this.baseURL}/pokemon/${id}`);
      if (!response.ok) throw new Error("Pokemon not found");

      const pokemon = await response.json();
      const processedData = this.processPokemonData(pokemon);
      this.cache.set(id, processedData);
      return processedData;
    } catch (error) {
      console.error(`Error fetching Pokemon ${id}:`, error);
      return null;
    }
  }

  // Fetch API para obtener un lote de Pokémon
  async fetchPokemonBatch(start = 1, end = 150) {
    const promises = [];
    for (let i = start; i <= end; i++) {
      promises.push(this.fetchPokemon(i));
    }

    const results = await Promise.all(promises);
    return results.filter((pokemon) => pokemon !== null);
  }

  // Procesar los datos del Pokémon
  processPokemonData(pokemon) {
    return {
      id: pokemon.id,
      name: pokemon.name,
      image:
        pokemon.sprites.other["official-artwork"].front_default ||
        pokemon.sprites.front_default,
      types: pokemon.types.map((type) => type.type.name),
      height: pokemon.height,
      weight: pokemon.weight,
      stats: pokemon.stats,
      abilities: pokemon.abilities,
    };
  }

  // Filtrar los Pokémon
  filterPokemon(pokemonList, searchTerm = "", typeFilter = "") {
    return pokemonList.filter((pokemon) => {
      const matchesSearch =
        !searchTerm ||
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.id.toString().includes(searchTerm);

      const matchesType = !typeFilter || pokemon.types.includes(typeFilter);

      return matchesSearch && matchesType;
    });
  }
}
