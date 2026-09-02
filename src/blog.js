import { BlogRouteController, Route } from './router.js';
import { LitElement, css, html, unsafeHTML, marked } from './lib.js';

const genRoute = (path, filename) => new Route(path, async () => {
    let response = await fetch(`/posts/${filename}.md`);
    return response.text();
})

class Blog extends LitElement {

    static styles = css`
        :host {
            font-family: "Open Sans", sans-serif;
        }
        h1, h2, h3, h4, h5, h6 {
            font-family: "Merriweather", serif; 
        }
        .header {
            width: 100%;
            height: 40px;
            display: flex;
            flex-direction: row;
            border-bottom: solid 1px black;
            align-items: center;
            padding-inline: 10px;
            gap: 10px;
        }

        article {
            max-width: 700px;
            padding-inline: 10px;
            margin-inline: auto;
        }

        code {
            color: white;
            background-color: rgba(23, 63, 92, 255);
            padding-inline: 3px;
            border-radius: 3px;
        }
    `;

    constructor() {
        super();
        let routes = [
            genRoute('/', 'index'),
            genRoute('/?article=test', 'test'),
        ];
        this.router = new BlogRouteController(this, routes);
    }

    render() {
        return html`
            <div class="header">
                <a href="/">Blog</a>
                <a href="/featured">Featured</a>
            </div>
            <article>
                <h1>${this.router.meta?.title}</h1>
                ${unsafeHTML(marked.parse(this.router.content))}
            </article>
        `;
    }
}

customElements.define("n-blog", Blog);