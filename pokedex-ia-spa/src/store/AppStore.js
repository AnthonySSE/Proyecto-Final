export class AppStore {
    constructor() {
        this.state = {
            currentPage: 'home',
            pokemonData: [],
            filteredPokemon: [],
            aiModel: null,
            isModelLoading: false,
            searchTerm: '',
            typeFilter: ''
        };
        this.listeners = [];
    }

    getState() {
        return { ...this.state };
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifyListeners();
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(listener => listener !== callback);
        };
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.state));
    }
}