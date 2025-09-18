export class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
    }

    addRoute(path, handler) {
        this.routes.set(path, handler);
    }

    navigate(path) {
        history.pushState(null, null, path);
        this.handleRoute(path);
    }

    handleRoute(path = window.location.pathname) {
        const handler = this.routes.get(path) || this.routes.get('/');
        this.currentRoute = path;
        handler();
    }

    init() {
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });
        
        // Handle initial load
        this.handleRoute();
    }
}