---
{
    "title": "About the Blog (Technicals)"
}
---

This blog was made entirely without AI assistance. It's very simple and consists of only a handful of dependencies, those being:
 - lit: for handling page templating using native web components.
 - marked: for parsing markdown into html

There is no bundler or build step. The entire webpage lives at the index `/` but lots of links do redirect to other pages. I found a hack online by [rafgraph](https://github.com/rafgraph/spa-github-pages/tree/gh-pages) which is very simple and works perfectly for my needs.

### Single Page App Hack

A single page app (SPA) is a frontend application that handles the routing on the client side. 
This allows the developer to treat the server strictly like an api data layer and the frontend as the templating and view factory layer. 
The simplest way to configure the server to get this behavior is to have a wild card route `/*` that always serves the frontend bundle and an api route `/api/*` that controls your standard server CRUD operations. 

Unfortunatly, there is no way to configure github pages to do this. 
It simply routes your path directly to a file in a directory of your chosing. 
There is no router you can configure.

However, we can supply our own 404 page.
If the user hits a page that github pages can't serve, because a file doesn't map to that route, the 404 page is served.
We can then have our custom 404 page redirect to our SPA bundle at `/` with a search parameter for the name of the page.
In the case of this blog `/foo` is redirected to `/?article=foo`.
The bundle is then loaded, the router is constructured, and the article with that name is pulled from the posts folder.
Tada! 
A very primitive spa.

The most glaring issue with this is we always assume that a route points to an article. 
For my case that's fine, all the pages in this blog are article.
For a real web application that would be a non started and funny enough I've worked on a project that made this decision and later regretted it.
