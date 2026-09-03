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
            width: calc(100% - 20px);
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
            font-family: "IBM Plex Mono", monospace;
            font-weight: 400;
            font-style: normal;
            color: white;
            background-color: rgba(23, 63, 92, 255);
            padding-inline: 3px;
            border-radius: 3px;
        }

        iframe.hero {
            max-width: 700px;
            height: 300px;
        }
    `;

    constructor() {
        super();
        let routes = [
            genRoute('/', 'index'),
        ];
        this.router = new BlogRouteController(this, routes);
    }

    render() {
        return html`
            <div class="header">
                <a href="/">Blog</a>
                <a href="/?article=featured">Featured</a>
            </div>
            <article>
                ${this.#renderShaderHero(this.router.meta?.shaderHero)}
                <h1>${this.router.meta?.title}</h1>
                ${unsafeHTML(marked.parse(this.router.content))}
            </article>
        `;
    }

    #renderShaderHero(hero) {
        if (!hero) return html``;

        return html`<iframe class="hero" width="100%" height="100%" frameborder="0" src="${hero}"></iframe>`
    } 
}

customElements.define("n-blog", Blog);