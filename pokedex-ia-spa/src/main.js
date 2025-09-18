import { AppStore } from './store/AppStore.js';
import { Router } from './services/Router.js';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { HomePage } from './components/HomePage.js';
import { CatalogPage } from './components/CatalogPage.js';
import { AIDetectorPage } from './components/AIDetectorPage.js';

class App {
    constructor() {
        this.store = new AppStore();
        this.router = new Router();
        this.components = {
            header: new Header(),
            footer: new Footer(),
            homePage: new HomePage(),
            catalogPage: new CatalogPage(),
            aiDetectorPage: new AIDetectorPage()
        };
        this.init();
    }

    init() {
        this.setupComponents();
        this.setupRoutes();
        this.router.init();
        console.log('Pokédex IA SPA initialized successfully!');
    }

    setupComponents() {
        // Mount persistent components
        document.getElementById('header-container').appendChild(this.components.header.render());
        document.getElementById('footer-container').appendChild(this.components.footer.render());
        
        // Setup component communication
        this.components.header.onNavigate = (route) => this.router.navigate(route);
    }

    setupRoutes() {
        this.router.addRoute('/', () => this.renderPage('homePage'));
        this.router.addRoute('/catalog', () => this.renderPage('catalogPage'));
        this.router.addRoute('/ai-detector', () => this.renderPage('aiDetectorPage'));
    }

    renderPage(componentName) {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = '';
        const component = this.components[componentName];
        mainContent.appendChild(component.render());
        component.onMount && component.onMount();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
