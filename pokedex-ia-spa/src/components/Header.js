// Component: Header
export class Header {
    //Constructor de la clase
    constructor() {
        this.isMobileMenuOpen = false;
        this.onNavigate = null;
        this.headerElement = null;
    }

    //Método para renderizar el componente
    render() {
        this.headerElement = document.createElement('header');
        this.headerElement.className = 'gradient-bg shadow-lg sticky top-0 z-50';
        this.headerElement.innerHTML = `
            <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 flex items-center">
                            <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3">
                            <img src='https://cdn-icons-png.flaticon.com/512/188/188987.png'>
                            </div>
                            <h1 class="text-white font-bold text-xl">Pokédx IA</h1>
                        </div>
                    </div>
                    
                    <div class="hidden md:block">
                        <div class="ml-10 flex items-baseline space-x-4">
                            <button type="button" data-route="/" class="nav-link text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-transparent border-0 cursor-pointer">Inicio</button>
                            <button type="button" data-route="/catalog" class="nav-link text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-transparent border-0 cursor-pointer">Catálogo</button>
                            <button type="button" data-route="/ai-detector" class="nav-link text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-transparent border-0 cursor-pointer">Detector IA</button>
                        </div>
                    </div>
                    
                    <div class="md:hidden">
                        <button type="button" id="mobile-menu-btn" class="text-white hover:text-gray-200 focus:outline-none focus:text-gray-200">
                            <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div id="mobile-menu" class="md:hidden hidden">
                    <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <button type="button" data-route="/" class="nav-link text-white hover:text-gray-200 block px-3 py-2 rounded-md text-base font-medium w-full text-left bg-transparent border-0 cursor-pointer">Inicio</button>
                        <button type="button" data-route="/catalog" class="nav-link text-white hover:text-gray-200 block px-3 py-2 rounded-md text-base font-medium w-full text-left bg-transparent border-0 cursor-pointer">Catálogo</button>
                        <button type="button" data-route="/ai-detector" class="nav-link text-white hover:text-gray-200 block px-3 py-2 rounded-md text-base font-medium w-full text-left bg-transparent border-0 cursor-pointer">Detector IA</button>
                    </div>
                </div>
            </nav>
        `;
        
        return this.headerElement; 
    }

    //Método para configurar el componente
    onMount() {        
        if (!this.headerElement) {
            console.error('Header element not found. It must be rendered first.');
            return;
        }

        this.setupButtons();
        this.setupMobileMenu();
        
        console.log('Header navigation configured successfully');
    }

    setupButtons() {
        // Botones de navegación
        const navButtons = this.headerElement.querySelectorAll('[data-route]');

        navButtons.forEach((button, index) => {
            const route = button.dataset.route;
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Verificar onNavigate al momento del click
                if (this.onNavigate && typeof this.onNavigate === 'function') {
                    console.log('Llamando this.onNavigate');
                    this.onNavigate(route);
                } else {
                                        
                    // Fallback: usar router global
                    if (window.router && typeof window.router.navigate === 'function') {
                        console.log('Usando window.router fallback');
                        window.router.navigate(route);
                    } else if (window.appRouter && typeof window.appRouter.navigate === 'function') {
                        console.log('Usando window.appRouter fallback');
                        window.appRouter.navigate(route);
                    } else {
                        console.error('No hay método de navegación disponible');
                    }
                }
                
                this.closeMobileMenu();
            });
        });
    }

    //Configuración del menú para dispositivos moviles.
    setupMobileMenu() {
        // Mobile menu toggle
        const mobileMenuBtn = this.headerElement.querySelector('#mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMobileMenu();
            });
        }
    }

    // Método para configurar navegación DESPUÉS del onMount
    setNavigationHandler(navFunction) {
        this.onNavigate = navFunction;
        
        // Verificar que el handler fue asignado correctamente
        console.log('Navigation handler set:', !!this.onNavigate);
    }

    toggleMobileMenu() {
        const mobileMenu = this.headerElement.querySelector('#mobile-menu');
        if (mobileMenu) {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
            mobileMenu.classList.toggle('hidden', !this.isMobileMenuOpen);
        }
    }

    closeMobileMenu() {
        const mobileMenu = this.headerElement.querySelector('#mobile-menu');
        if (mobileMenu) {
            this.isMobileMenuOpen = false;
            mobileMenu.classList.add('hidden');
        }
    }
}