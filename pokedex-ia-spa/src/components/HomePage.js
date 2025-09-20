//Componente para la página de principal
export class HomePage {
    constructor(router = null) {
        this.router = router;
    }

    render() {
        const page = document.createElement("div");
        page.className = "page";
        page.innerHTML = `
            <section class="gradient-bg text-white py-20">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 class="text-5xl md:text-6xl font-bold mb-6">Pokédx IA</h1>
                    <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                        Explora el mundo Pokémon con tecnología de inteligencia artificial. 
                        Descubre, analiza y aprende sobre tus Pokémon favoritos.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <button id="explore-catalog-btn" class="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                            Explorar Catálogo
                        </button>
                        <button id="try-ai-btn" class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
                            Probar IA
                        </button>
                    </div>
                </div>
            </section>
            
            <section class="py-16 bg-white">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">Características</h2>
                    <div class="grid md:grid-cols-3 gap-8">
                        <div class="text-center p-6">
                            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <h3 class="text-xl font-semibold mb-2">Búsqueda Avanzada</h3>
                            <p class="text-gray-600">Encuentra cualquier Pokémon por nombre, tipo o número de la Pokédx.</p>
                        </div>
                        <div class="text-center p-6">
                            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                </svg>
                            </div>
                            <h3 class="text-xl font-semibold mb-2">Inteligencia Artificial</h3>
                            <p class="text-gray-600">Clasifica imágenes usando TensorFlow.js directamente en tu navegador.</p>
                        </div>
                        <div class="text-center p-6">
                            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                            <h3 class="text-xl font-semibold mb-2">Rápido y Responsive</h3>
                            <p class="text-gray-600">Diseño moderno que se adapta a todos los dispositivos.</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
        return page;
    }

    // Activar onMount()
    onMount() {        
        // Obtener el router de múltiples fuentes posibles
        const router = this.router || window.router || window.appRouter;
        
        if (!router) {
            console.error('Router not available in HomePage. Retrying in 100ms...');
            // Reintentar después de un pequeño delay
            setTimeout(() => this.setupButtons(), 100);
            return;
        }
        
        this.setupButtons(router);
    }
    //Configurar botones de HomePage
    setupButtons(router = null) {
        const finalRouter = router || this.router || window.router || window.appRouter;
        
        if (!finalRouter) {
            return;
        }
        
        const exploreCatalogBtn = document.getElementById("explore-catalog-btn");
        const tryAiBtn = document.getElementById("try-ai-btn");

        if (exploreCatalogBtn) {
            // Limpiar listeners previos
            exploreCatalogBtn.replaceWith(exploreCatalogBtn.cloneNode(true));
            const newExploreBtn = document.getElementById("explore-catalog-btn");
            
            newExploreBtn.addEventListener("click", (e) => {
                e.preventDefault();
                finalRouter.navigate("/catalog");
            });
        } else {
            console.error('Botón de exploración del catálogo no encontrado.');
        }

        if (tryAiBtn) {
            // Limpiar listeners previos
            tryAiBtn.replaceWith(tryAiBtn.cloneNode(true));
            const newTryAiBtn = document.getElementById("try-ai-btn");
            
            newTryAiBtn.addEventListener("click", (e) => {
                e.preventDefault();
                console.log('Navigate to AI detector clicked');
                finalRouter.navigate("/ai-detector");
            });
            
        } else {
            console.error('Botón de Probar IA no encontrado.');
        }
    }
}
