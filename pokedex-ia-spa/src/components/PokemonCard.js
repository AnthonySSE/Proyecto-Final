export class PokemonCard {
    //Construtor de la clase
    constructor(pokemon, modalInstance = null) {
        this.pokemon = pokemon;
        this.modalInstance = modalInstance;
    }
    // Renderizar el componente
    render() {
        const card = document.createElement("div");
        card.className = "pokemon-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl";
        card.innerHTML = `
            <div class="aspect-square bg-gray-100 flex items-center justify-center">
                <img src="${this.pokemon.image}" alt="${this.pokemon.name}" 
                     class="w-32 h-32 object-contain" loading="lazy">
            </div>
            <div class="p-4">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="font-semibold text-lg capitalize">${this.pokemon.name}</h3>
                    <span class="text-gray-500 text-sm">#${this.pokemon.id.toString().padStart(3, "0")}</span>
                </div>
                <div class="flex gap-2">
                    ${this.pokemon.types.map(type => `
                        <span class="type-${type} text-white text-xs px-2 py-1 rounded-full capitalize">${type}</span>
                    `).join("")}
                </div>
            </div>
        `;

        //Mejorar el manejo del click del modal
        card.addEventListener("click", (e) => {
            e.preventDefault();
            console.log(`Abiendo modal para ${this.pokemon.name}`);
            
            // Intentar múltiples formas de acceder al modal
            const modal = this.modalInstance || 
                         window.pokemonModal || 
                         window.modal ||
                         this.findModalInstance();
            
            if (modal && typeof modal.open === 'function') {
                modal.open(this.pokemon);
            } else {
                console.error('Instancia de Modal no encontrada o invalida');
                // Fallback: dispatchar evento personalizado
                this.dispatchModalEvent();
            }
        });

        return card;
    }
    
    // Buscar instancia del modal en el DOM o variables globales
    findModalInstance() {
        // Buscar en variables globales comunes
        const possibleNames = ['pokemonModal', 'modal', 'appModal'];
        
        for (const name of possibleNames) {
            if (window[name] && typeof window[name].open === 'function') {
                return window[name];
            }
        }
        
        return null;
    }
    
    // Fallback: disparar evento personalizado
    dispatchModalEvent() {
        const event = new CustomEvent('openPokemonModal', {
            detail: { pokemon: this.pokemon },
            bubbles: true
        });
        
        document.dispatchEvent(event);
        console.log(`Disprando evento personalizado para ${this.pokemon.name}`);
    }
}