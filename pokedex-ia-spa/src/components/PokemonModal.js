export class PokemonModal {
    constructor() {
        this.isOpen = false;
        this.currentPokemon = null;
        this.modal = null;
        this.init();
    }

    init() {
        // Listen for modal open events
        window.addEventListener('openPokemonModal', (e) => {
            this.open(e.detail);
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    render() {
        if (this.modal) return this.modal;
        
        this.modal = document.createElement('div');
        this.modal.className = 'fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm hidden items-center justify-center z-50';
        this.modal.innerHTML = `
            <div class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto modal-content">
                <div id="modal-body">
                    <!-- Pokemon details will be inserted here -->
                </div>
            </div>
        `;

        // Close modal when clicking backdrop
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Prevent modal close when clicking content
        this.modal.querySelector('.modal-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });

        document.body.appendChild(this.modal);
        return this.modal;
    }

    open(pokemon) {
        this.currentPokemon = pokemon;
        if (!this.modal) this.render();
        
        this.updateContent();
        this.modal.classList.remove('hidden');
        this.modal.classList.add('flex');
        document.body.classList.add('overflow-hidden');
        this.isOpen = true;
    }

    close() {
        if (!this.modal) return;
        
        this.modal.classList.add('hidden');
        this.modal.classList.remove('flex');
        document.body.classList.remove('overflow-hidden');
        this.isOpen = false;
    }

    updateContent() {
        if (!this.currentPokemon) return;
        
        const modalBody = this.modal.querySelector('#modal-body');
        modalBody.innerHTML = `
            <div class="p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-3xl font-bold capitalize">${this.currentPokemon.name}</h2>
                    <button id="close-modal-btn" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>
                
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="text-center">
                        <img src="${this.currentPokemon.image}" alt="${this.currentPokemon.name}" 
                             class="w-64 h-64 object-contain mx-auto mb-4">
                        <div class="flex gap-2 justify-center">
                            ${this.currentPokemon.types.map(type => `
                                <span class="type-\${type} text-white px-3 py-1 rounded-full capitalize">\${type}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h3 class="font-semibold mb-2">Información Básica</h3>
                            <p><strong>Número:</strong> #${this.currentPokemon.id.toString().padStart(3, '0')}</p>
                            <p><strong>Altura:</strong> ${this.currentPokemon.height / 10} m</p>
                            <p><strong>Peso:</strong> ${this.currentPokemon.weight / 10} kg</p>
                        </div>
                        
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h3 class="font-semibold mb-2">Habilidades</h3>
                            <div class="flex flex-wrap gap-2">
                                ${this.currentPokemon.abilities.map(ability => `
                                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm capitalize">
                                        ${ability.ability.name}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h3 class="font-semibold mb-3">Estadísticas Base</h3>
                            <div class="space-y-2">
                                ${this.currentPokemon.stats.map(stat => `
                                    <div>
                                        <div class="flex justify-between text-sm mb-1">
                                            <span class="capitalize">${stat.stat.name.replace('-', ' ')}</span>
                                            <span>${stat.base_stat}</span>
                                        </div>
                                        <div class="w-full bg-gray-200 rounded-full h-2">
                                            <div class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
                                                 style="width: ${(stat.base_stat / 255) * 100}%"></div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Attach close button listener
        modalBody.querySelector('#close-modal-btn').addEventListener('click', () => {
            this.close();
        });
    }
};