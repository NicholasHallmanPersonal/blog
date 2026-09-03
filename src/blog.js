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
            display: flex;
            flex-direction: column;
        }
        h1, h2, h3, h4, h5, h6 {
            font-family: "Merriweather", serif; 
        }
        .header {
            position: sticky;
            z-index: 999;
            top: 0px;
            backdrop-filter: blur(5px);
            background-color: rgba(255,255,255,.4);
            width: calc(100% - 20px);
            height: 40px;
            display: flex;
            flex-direction: row;
            border-bottom: solid 1px white;
            align-items: center;
            justify-content: space-between;
            padding-inline: 10px;
            gap: 10px;
        }

        .header a {
            color: black;
        }

        article {
            max-width: 700px;
            min-width: 300px;
            width: calc(100% - 20px);
            padding-inline: 10px;
            margin-inline: auto;
        }

        .categories {
            display: flex;
            flex-direction: row;
            gap: 10px;
            align-items: center;
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

        canvas#hero {
            max-width: 720px;
            width: 100%;
            height: 200px;
            margin-inline: auto;
            overflow: hidden;
        }

        .move-up {
            margin-top: -45px;
            color: white;
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
        const hasHero = !!this.router.meta?.shaderHeroCode
        return html`
            <div class="header">
                <a href="/">Blog</a>
                <div class="categories">
                    <a href="/?article=featured">Featured</a>
                    <a href="/?article=frontend">Frontend</a>
                </div>
            </div>
            ${this.#renderShaderHero(this.router.meta?.shaderHeroCode)}
            <article>
                <h1 class="${hasHero ? 'move-up' : ''}">${this.router.meta?.title}</h1>
                ${unsafeHTML(marked.parse(this.router.content))}
            </article>
        `;
    }

    #renderShaderHero(hero) {
        if (!hero) return html``;

        return html`<canvas width="100%" height="100%" id="hero"></canvas>`
    } 

    updated() {
        super.updated();

        let image = this.router?.meta?.shaderHeroCode;
        if (!image) {
            this.toy?.cleanup();
            this.toy = undefined;
            return;
        }
        let canvas = this.shadowRoot.querySelector('#hero');
        let article = this.shadowRoot.querySelector('article');
        // multiply by 2 for super sampling
        canvas.width = (article.getBoundingClientRect().width + 20) * 2;
        canvas.height = canvas.getBoundingClientRect().height * 2;
        this.toy = new ShaderToyLite(canvas);
        this.toy.setCommon('');
        this.toy.setImage({source: image});
        this.toy.play();
    }
}

customElements.define("n-blog", Blog);