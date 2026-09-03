// super simple router, just for managing the blog page

import { frontmatter } from "./frontmatter.js";

export class Route {
    load;
    path;
    constructor(path, load) {
        this.load = load;
        this.path = path;
    }
}

export class BlogRouteController {
    constructor(host) {
        this.host = host;
        host.addController(this);
        this.navigation = window.navigation;
        this.content = "";

        this.navigation.addEventListener('navigate', this.handleNavigationEvent.bind(this));
        this.navigation.reload();
    }

    handleNavigationEvent(event) {
        if (!event.canIntercept) {
            return;
        }

        // We shouldn't intercept fragment navigations or downloads.
        if (event.hashChange || event.downloadRequest !== null) {
            return;
        }

        const url = new URL(event.destination.url);
        let params = url.searchParams;
        let articlePath = '/posts/404.md';
        if (params.size === 0) {
            // load the index
            articlePath = '/posts/index.md';
        } else {
            let articleParam = params.get("article");
            if(articleParam) articlePath = `/posts/${articleParam}.md`;
        }

        let setContent = (raw) => {
            const {content, meta} = frontmatter(raw);
            this.content = content;
            this.meta = meta;
            (meta, content);
            this.host.requestUpdate();
        }

        event.intercept({
            async handler() {
                // replace our content with the content of the route
                try {
                    const response = await fetch(articlePath);
                    if (response.status === 404) {
                        throw new Error("mising");
                    }
                    const content = await response.text();
                    setContent(content);
                } catch {
                    const response = await fetch('/posts/404.md');
                    const content = await response.text();
                    setContent(content);
                }
            }
        });
    }
}