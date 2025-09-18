export class PokemonCard {
    constructor(pokemon) {
        this.pokemon = pokemon;
    }

    render() {
        const card = document.createElement('div');
        card.className = 'pokemon-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl';
        card.innerHTML = `
            <div class="aspect-square bg-gray-100 flex items-center justify-center">
                <img src="${this.pokemon.image}" alt="${this.pokemon.name}" 
                     class="w-32 h-32 object-contain" loading="lazy">
            </div>
            <div class="p-4">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="font-semibold text-lg capitalize">${this.pokemon.name}</h3>
                    <span class="text-gray-500 text-sm">#${this.pokemon.id.toString().padStart(3, '0')}</span>
                </div>
                <div class="flex gap-2">
                    ${this.pokemon.types.map(type => `
                        <span class="type-${type} text-white text-xs px-2 py-1 rounded-full capitalize">${type}</span>
                    `).join('')}
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('openPokemonModal', { 
                detail: this.pokemon 
            }));
        });

        return card;
    }
};
