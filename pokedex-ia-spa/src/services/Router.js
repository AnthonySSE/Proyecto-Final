export class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
    }

    addRoute(path, handler) {
        this.routes.set(path, handler);
    }

    navigate(path) {
        //  Solo actualiza el historial
        history.pushState(null, null, path); 
        this.handleRoute(); // Ahora el handleRoute maneja el ruteo.
    }

    handleRoute(path = window.location.pathname) {
        // Añadimos una verificación para evitar la renderización si la ruta es la misma.
        if (this.currentRoute === path) {
            return;
        }

        const handler = this.routes.get(path) || this.routes.get("/");
        if (handler) {
            this.currentRoute = path;
            handler();
        } else {
            console.error('Ruta no encontrada:', path);
        }
    }

    init() {
        // Llamando a handleRoute cuando cambia la ruta
        window.addEventListener("popstate", () => {
            this.handleRoute();
        });
        
        // La primera renderización se hace cuando la página se carga
        this.handleRoute(); 
    }
}