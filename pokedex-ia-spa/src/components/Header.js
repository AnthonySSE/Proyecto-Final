export class Header {
    constructor() {
        this.isMobileMenuOpen = false;
        this.onNavigate = null;
    }

    render() {
        const header = document.createElement('header');
        header.className = 'gradient-bg shadow-lg sticky top-0 z-50';
        header.innerHTML = `
            <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 flex items-center">
                            <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                                <div class="w-4 h-4 bg-red-500 rounded-full"></div>
                            </div>
                            <h1 class="text-white font-bold text-xl">Pokédex IA</h1>
                        </div>
                    </div>
                    
                    <!-- Desktop Navigation -->
                    <div class="hidden md:block">
                        <div class="ml-10 flex items-baseline space-x-4">
                            <a href="#" data-route="/" class="nav-link text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors">Inicio</a>
                            <a href="#" data-route="/catalog" class="nav-link text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors">Catálogo</a>
                            <a href="#" data-route="/ai-detector" class="nav-link text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors">Detector IA</a>
                        </div>
                    </div>
                    
                    <!-- Mobile menu button -->
                    <div class="md:hidden">
                        <button id="mobile-menu-btn" class="text-white hover:text-gray-200 focus:outline-none focus:text-gray-200">
                            <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- Mobile Navigation -->
                <div id="mobile-menu" class="md:hidden hidden">
                    <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a href="#" data-route="/" class="nav-link text-white hover:text-gray-200 block px-3 py-2 rounded-md text-base font-medium">Inicio</a>
                        <a href="#" data-route="/catalog" class="nav-link text-white hover:text-gray-200 block px-3 py-2 rounded-md text-base font-medium">Catálogo</a>
                        <a href="#" data-route="/ai-detector" class="nav-link text-white hover:text-gray-200 block px-3 py-2 rounded-md text-base font-medium">Detector IA</a>
                    </div>
                </div>
            </nav>
        `;

        this.attachEventListeners(header);
        return header;
    }

    attachEventListeners(header) {
        // Navigation links
        header.querySelectorAll('[data-route]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const route = e.target.dataset.route;
                if (this.onNavigate) {
                    this.onNavigate(route);
                }
                this.closeMobileMenu();
            });
        });

        // Mobile menu toggle
        const mobileMenuBtn = header.querySelector('#mobile-menu-btn');
        mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        mobileMenu.classList.toggle('hidden', !this.isMobileMenuOpen);
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        this.isMobileMenuOpen = false;
        mobileMenu.classList.add('hidden');
    }
};