// super simple router, just for managing the blog page

export class BlogRouteController {
    constructor(host, routes) {
        this.host = host;
        host.addController(this);
        this.navigation = window.navigation;
        this.routes = routes;

        this.navigation.addEventListener('navigate', (event) => {
            if (!event.canIntercept) {
                return;
            }

            // We shouldn't intercept fragment navigations or downloads.
            if (event.hashChange || event.downloadRequest !== null) {
                return;
            }

            const url = new URL(event.destination.url);
            const route = this.routes.find((route) => route.path === url.pathname);
            if (route) {
                event.intercept({
                    async handler() {
                        // replace our content with the content of the route
                        const content = await route.load();
                        this.content = content;
                    }
                });
            }
        });
    }
}