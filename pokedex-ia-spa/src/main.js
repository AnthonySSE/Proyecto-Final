import { AppStore } from './store/AppStore.js';
import { Router } from './services/Router.js';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { HomePage } from './components/HomePage.js';
import { CatalogPage } from './components/CatalogPage.js';
import { AIDetectorPage } from './components/AIDetectorPage.js';
import { PokemonModal } from './components/PokemonModal.js';

class App {
    constructor() {
        this.store = new AppStore();
        this.router = new Router();
        this.pokemonModal = new PokemonModal();
        
        // Crear componentes
        this.components = {
            header: new Header(),
            footer: new Footer(),
            homePage: new HomePage(this.router),
            catalogPage: new CatalogPage(),
            aiDetectorPage: new AIDetectorPage()
        };
        
        // Hacer disponibles globalmente
        window.router = this.router;
        window.appRouter = this.router;
        window.pokemonModal = this.pokemonModal;

        this.init();
    }

    init() {
        console.log('Inicializando app...');
        
        // Renderizar modal primero
        this.pokemonModal.render();
        
        this.setupComponents();
        this.setupRoutes();
        this.router.init();
        
        console.log('SPA Inicializada exitosamente!');
    }

    setupComponents() {
        console.log('Configurando compoenentes...');
        
        // Verificar que los elementos del DOM existen
        const headerContainer = document.getElementById('header-container');
        const footerContainer = document.getElementById('footer-container');
        
        if (!headerContainer || !footerContainer) {
            console.error('No encontró los componentes requeridos en el DOM');
            return;
        }
        
        // Verificar que los componentes existen
        if (!this.components.header || !this.components.footer) {
            console.error('Los componentes header o footer no existen-.');
            return;
        }
        
        // Mount persistent components
        console.log('Montando el header...');
        headerContainer.appendChild(this.components.header.render());
        
        console.log('Montando el footer...');
        footerContainer.appendChild(this.components.footer.render());
        
        // Llamar onMount() PRIMERO para configurar los event listeners...
        console.log('Llamando al header en onMount...');
        this.components.header.onMount();

        // LUEGO configurar la navegación usando el método setNavigationHandler...
        console.log('Configurando la navegación...');
        this.components.header.setNavigationHandler((route) => {
            console.log(`Navegando hacía: ${route}`);
            this.router.navigate(route);
        });
        
        // También asignar directamente por compatibilidad
        this.components.header.onNavigate = (route) => {
            console.log(`Navegando directamente hacía: ${route}`);
            this.router.navigate(route);
        };
        
        console.log('Los compoenentes fueron configurados y montados de forma satisfactoria.');
    }

    setupRoutes() {
        // Configuración de rutas
        
        this.router.addRoute('/', () => {
            console.log('Route: Home');
            this.renderPage('homePage');
        });
        
        this.router.addRoute('/catalog', () => {
            console.log('Route: Catalog');
            this.renderPage('catalogPage');
        });
        
        this.router.addRoute('/ai-detector', () => {
            console.log('Route: AI Detector');
            this.renderPage('aiDetectorPage');
        });
        
        console.log('Rutas configuradas');
    }

    //Renderizando páginas:
    renderPage(componentName) {
        console.log(`Renderizando página: ${componentName}`);
        
        const mainContent = document.getElementById('main-content');
        
        if (!mainContent) {
            console.error('El contendor del contenido principal no fue encontrado.');
            return;
        }
        
        const component = this.components[componentName];
        
        if (!component) {
            console.error(`El componente '${componentName}' no fue encontrado`);
            console.log('Componentes disponibles:', Object.keys(this.components));
            return;
        }
        
        try {
            mainContent.innerHTML = '';
            const pageElement = component.render();
            mainContent.appendChild(pageElement);
            
            // Call onMount si existe
            if (component.onMount && typeof component.onMount === 'function') {
                console.log(`Llamando onMount para ${componentName}`);
                component.onMount();
            }
            
            console.log(`La pagina ha sido renderizada con exito: '${componentName}'`);
            
        } catch (error) {
            console.error(`Error renderizando: ${componentName}:`, error);
        }
    }
}

// Inicializando la app si el DOM está listo.
document.addEventListener('DOMContentLoaded', () => {
    console.log('Contenido del DOM cargado. Inicializando app...');
    
    try {
        new App();
    } catch (error) {
        console.error('Falla al inicializar la app:', error);
        console.error('Detalles del error:', error.stack);
    }
});