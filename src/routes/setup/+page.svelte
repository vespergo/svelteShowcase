<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const s_scaffold = `
# Scaffold a new SvelteKit project
npm create svelte@latest my-app

# The CLI will ask:
#   Which Svelte app template?  → Skeleton project
#   Add type checking?          → Yes, using TypeScript syntax
#   Add ESLint / Prettier?      → optional, recommended

cd my-app
npm install
npm run dev
  `;

  const s_structure = `
my-app/
├── src/
│   ├── app.html          ← HTML shell — %sveltekit.head% and %sveltekit.body% are replaced at runtime
│   ├── app.css           ← global styles, imported in +layout.svelte
│   ├── app.d.ts          ← ambient TypeScript declarations (e.g. App.Locals)
│   ├── lib/              ← $lib alias points here — components, stores, utilities
│   │   └── components/
│   └── routes/           ← file-based routing
│       ├── +layout.svelte       ← wraps every page (nav, footer, global imports)
│       ├── +page.svelte         ← the "/" route
│       └── about/
│           └── +page.svelte     ← the "/about" route
├── static/               ← served as-is (favicon, fonts, images)
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
  `;

  const s_svelte_config = `
// svelte.config.js
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  // vitePreprocess enables TypeScript, PostCSS, etc. inside .svelte files
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto picks the right output for your deploy target
    // (Vercel, Netlify, Node, static…). Swap it for a specific adapter if needed.
    adapter: adapter()
  }
};
  `;

  const s_vite_config = `
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()]
  // Add other Vite plugins here (e.g. tailwindcss(), icons(), …)
});
  `;

  const s_app_html = `
<!-- src/app.html — the HTML shell for every page -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%   <!-- <title>, <meta>, <link> injected per-page -->
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
  `;

  const s_layout = `
<!-- src/routes/+layout.svelte — wraps every route -->
<script lang="ts">
  import '../app.css';        // global styles loaded once
  import { page } from '$app/state';   // reactive current-page info (Svelte 5 style)
  import Nav from '$lib/components/Nav.svelte';

  let { children } = $props();  // the current page's content
<\/script>

<Nav />

<main>
  {@render children()}   <!-- render the matched +page.svelte here -->
</main>
  `;

  const s_page = `
<!-- src/routes/about/+page.svelte — creates the /about route -->
<script lang="ts">
  let count = $state(0);
<\/script>

<h1>About</h1>
<button onclick={() => count++}>Clicked {count} times</button>

<style>
  /* Styles are scoped to this component automatically */
  h1 { color: tomato; }
</style>
  `;

  const s_lib_alias = `
// $lib is a built-in alias for src/lib — works in both .svelte and .ts files.
// No configuration needed; SvelteKit sets it up automatically.

import MyComponent from '$lib/components/MyComponent.svelte';
import { myStore } from '$lib/stores/myStore.svelte';
import { formatDate } from '$lib/utils';
  `;

  const s_runes_module = `
// src/lib/stores/counter.svelte.ts
// .svelte.ts files support runes outside of components.
// Export reactive state and it stays reactive wherever it's imported.

function createCounter() {
  let value = $state(0);
  return {
    get value() { return value; },
    increment() { value++; },
    reset() { value = 0; }
  };
}

export const counter = createCounter();
  `;

  const s_page_data = `
// src/routes/posts/+page.ts  (or +page.server.ts for server-only)
// The load function runs before the page renders and passes data as props.
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch('/api/posts');
  const posts = await res.json();
  return { posts };   // available as \`data.posts\` in +page.svelte
};

// src/routes/posts/+page.svelte
// <script lang="ts">
//   import type { PageData } from './$types';
//   let { data }: { data: PageData } = $props();
// <\/script>
// {#each data.posts as post}…{/each}
  `;

  const s_scripts = `
# package.json scripts
npm run dev          # start Vite dev server at http://localhost:5173
npm run build        # production build → .svelte-kit/output
npm run preview      # serve the production build locally
npm run check        # svelte-check — type-check .svelte files
npm run check:watch  # type-check in watch mode
  `;
</script>

<h1>Setup &amp; Installation</h1>
<p class="lede">
  This page is the end-to-end starter guide for a SvelteKit + Svelte 5 project.
  It walks you from prerequisites and the <code>npx sv create</code> scaffold
  command through the directory layout SvelteKit generates, then explains the
  config files that matter — <code>svelte.config.js</code>, <code>vite.config.ts</code>,
  and <code>tsconfig.json</code> — including the <code>$lib</code> alias and what
  the chosen adapter does. From there it covers file-based routing, the special
  <code>+page</code>, <code>+layout</code>, and <code>+server</code> files,
  <code>load</code> functions for data fetching, and the handful of packages
  worth knowing about for forms, validation, and deployment. By the end you
  should have enough context to set up a fresh project and find your way around it.
</p>

<!-- ── Prerequisites ──────────────────────────────────────────────────── -->
<section>
  <h2>Prerequisites</h2>
  <ul class="prereqs">
    <li>
      <strong>Node.js 18+</strong>
      <span>Check with <code>node -v</code>. Download from <code>nodejs.org</code> if needed.</span>
    </li>
    <li>
      <strong>npm 9+ / pnpm / Bun</strong>
      <span>Any of these work. Examples below use <code>npm</code>.</span>
    </li>
    <li>
      <strong>VS Code</strong> <em>(recommended)</em>
      <span>Install the <strong>Svelte for VS Code</strong> extension for syntax highlighting, type checking, and completions inside <code>.svelte</code> files.</span>
    </li>
  </ul>
</section>

<!-- ── Scaffold ───────────────────────────────────────────────────────── -->
<section>
  <h2>1. Scaffold a new project</h2>
  <p class="body">
    The official <code>create-svelte</code> CLI scaffolds a project with your
    choice of template, TypeScript, ESLint, and Prettier.
  </p>
  <CodeBlock lang="bash" code={s_scaffold} />
</section>

<!-- ── File structure ─────────────────────────────────────────────────── -->
<section>
  <h2>2. Project structure</h2>
  <p class="body">
    SvelteKit uses a file-based router. Everything inside
    <code>src/routes/</code> maps to a URL. A <code>+layout.svelte</code>
    wraps sibling and child routes; a <code>+page.svelte</code> renders a
    specific route.
  </p>
  <CodeBlock code={s_structure} />
</section>

<!-- ── Config files ───────────────────────────────────────────────────── -->
<section>
  <h2>3. Configuration files</h2>

  <h3>svelte.config.js</h3>
  <p class="body">
    Tells the Svelte compiler how to preprocess files and which
    <em>adapter</em> to use for deployment. Adapters transform the build
    output for a specific host (Vercel, Netlify, Node, static HTML…).
  </p>
  <CodeBlock file="svelte.config.js" lang="js" code={s_svelte_config} />

  <h3>vite.config.ts</h3>
  <p class="body">
    SvelteKit runs on top of Vite. The <code>sveltekit()</code> plugin
    hooks the router, SSR, and code-splitting into the Vite pipeline.
    Add other Vite plugins here (Tailwind, SVG icons, etc.).
  </p>
  <CodeBlock file="vite.config.ts" lang="ts" code={s_vite_config} />
</section>

<!-- ── HTML shell ─────────────────────────────────────────────────────── -->
<section>
  <h2>4. app.html — the HTML shell</h2>
  <p class="body">
    Every page is server-rendered into this template.
    <code>%sveltekit.head%</code> is replaced with per-page
    <code>&lt;title&gt;</code> and <code>&lt;meta&gt;</code> tags;
    <code>%sveltekit.body%</code> with the rendered HTML.
  </p>
  <CodeBlock file="src/app.html" lang="html" code={s_app_html} />
</section>

<!-- ── Layout & page ──────────────────────────────────────────────────── -->
<section>
  <h2>5. Layout and page files</h2>
  <p class="body">
    <code>+layout.svelte</code> wraps every route in its directory (and
    nested ones). Import global CSS here. Render the current page with
    <code>{'{@render children()}'}</code>.
  </p>
  <CodeBlock file="src/routes/+layout.svelte" lang="svelte" code={s_layout} />

  <p class="body" style="margin-top:1rem">
    <code>+page.svelte</code> is the route itself. Its <code>&lt;style&gt;</code>
    block is automatically scoped — no class naming convention required.
  </p>
  <CodeBlock file="src/routes/about/+page.svelte" lang="svelte" code={s_page} />
</section>

<!-- ── $lib alias ─────────────────────────────────────────────────────── -->
<section>
  <h2>6. The <code>$lib</code> alias</h2>
  <p class="body">
    <code>$lib</code> is a built-in path alias for <code>src/lib/</code>.
    Use it in any <code>.svelte</code>, <code>.ts</code>, or
    <code>.svelte.ts</code> file — no configuration needed.
  </p>
  <CodeBlock lang="ts" code={s_lib_alias} />
</section>

<!-- ── .svelte.ts rune modules ────────────────────────────────────────── -->
<section>
  <h2>7. Reactive modules with <code>.svelte.ts</code></h2>
  <p class="body">
    Files named <code>*.svelte.ts</code> (or <code>*.svelte.js</code>) can
    use runes outside of components. Reactive state exported from these
    files stays reactive wherever it's imported — no Svelte stores, no
    <code>writable()</code>.
  </p>
  <CodeBlock file="src/lib/stores/counter.svelte.ts" lang="ts" code={s_runes_module} />
</section>

<!-- ── Loading data ───────────────────────────────────────────────────── -->
<section>
  <h2>8. Loading data — <code>+page.ts</code></h2>
  <p class="body">
    A <code>+page.ts</code> (or <code>+page.server.ts</code> for
    server-only code) exports a <code>load</code> function that runs before
    the page renders. Its return value becomes the page's <code>data</code> prop.
  </p>
  <CodeBlock file="src/routes/posts/+page.ts" lang="ts" code={s_page_data} />
</section>

<!-- ── npm scripts ────────────────────────────────────────────────────── -->
<section>
  <h2>9. npm scripts</h2>
  <CodeBlock file="package.json" lang="bash" code={s_scripts} />
</section>

<!-- ── Key packages ───────────────────────────────────────────────────── -->
<section>
  <h2>10. Key packages</h2>
  <div class="pkg-grid">
    <div class="pkg">
      <strong>svelte</strong>
      <span>The compiler and runtime. Runes, transitions, animations.</span>
    </div>
    <div class="pkg">
      <strong>@sveltejs/kit</strong>
      <span>Router, SSR, load functions, adapters.</span>
    </div>
    <div class="pkg">
      <strong>@sveltejs/vite-plugin-svelte</strong>
      <span>Integrates the Svelte compiler with Vite's dev server and build.</span>
    </div>
    <div class="pkg">
      <strong>@sveltejs/adapter-auto</strong>
      <span>Detects your deploy environment and picks the right adapter automatically.</span>
    </div>
    <div class="pkg">
      <strong>svelte-check</strong>
      <span>Type-checks <code>.svelte</code> files using the TypeScript language server.</span>
    </div>
    <div class="pkg">
      <strong>vite</strong>
      <span>Dev server and bundler — HMR, tree-shaking, code splitting.</span>
    </div>
  </div>
</section>

<style>
  .lede { color: var(--muted); font-size: 1.05rem; }
  section { margin: 2rem 0; }
  h2 { margin: 0 0 0.5rem; font-size: 1.2rem; }
  h3 { margin: 1.25rem 0 0.35rem; font-size: 1rem; }
  .body { color: var(--muted); max-width: 65ch; margin: 0 0 0.5rem; }

  .prereqs {
    list-style: none;
    padding: 0;
    margin: 0.75rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .prereqs li {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    padding: 0.6rem 0.9rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
  }
  .prereqs strong { font-size: 0.95rem; }
  .prereqs span { font-size: 0.88rem; color: var(--muted); }
  .prereqs em { font-style: normal; font-size: 0.8rem; color: var(--accent); }

  .pkg-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 0.75rem;
    margin: 0.75rem 0;
  }
  .pkg {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem 1rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
  }
  .pkg strong { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 0.9rem; }
  .pkg span { font-size: 0.85rem; color: var(--muted); }
</style>
