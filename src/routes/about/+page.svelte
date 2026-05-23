<script lang="ts">
  import { base } from '$app/paths';
  const pages = [
    {
      href: '/reactivity',
      title: 'Reactivity',
      icon: '⚡',
      what: '$state, $derived, $effect',
      desc: 'The heart of Svelte 5. $state declares reactive variables, $derived computes values from them automatically, and $effect runs side-effects whenever its dependencies change — with an optional cleanup return value.'
    },
    {
      href: '/forms',
      title: 'Forms & Validation',
      icon: '✅',
      what: '$derived for live validation, touched tracking',
      desc: 'All validation logic is expressed as $derived computations — no event handlers wiring errors together. A "touched" $state record prevents showing errors before the user has interacted with a field.'
    },
    {
      href: '/lifecycle',
      title: 'Lifecycle',
      icon: '♻️',
      what: '$effect cleanup, onMount, onDestroy',
      desc: 'In Svelte 5, returning a function from $effect replaces most onDestroy use-cases. The cleanup fires automatically when the effect re-runs or the component unmounts, keeping setup and teardown co-located.'
    },
    {
      href: '/transitions',
      title: 'Transitions & Animations',
      icon: '🎞️',
      what: 'transition:, in:, out:, animate:flip',
      desc: 'Svelte ships animation primitives built in. transition: handles both enter and exit, in:/out: let you differentiate them, and animate:flip smoothly repositions keyed list items when they reorder.'
    },
    {
      href: '/stores',
      title: 'Shared State',
      icon: '🔗',
      what: 'Rune-based store pattern across module boundaries',
      desc: 'Svelte 5 lets you export reactive state from plain .svelte.ts files. A class-like factory holds $state privately, exposes getters, and works anywhere — no writable() subscriptions needed.'
    },
    {
      href: '/composition',
      title: 'Composition',
      icon: '🧩',
      what: '$props, $bindable, bind:value, snippets',
      desc: 'Components declare props with $props(). Marking a prop $bindable lets the parent bind to it with bind:value — two-way data flow without custom events. Snippets replace slots for passing markup into components.'
    },
    {
      href: '/css',
      title: 'CSS Techniques',
      icon: '🎨',
      what: 'Scoped styles, custom properties, class:, responsive grid, dark mode',
      desc: 'Svelte scopes component styles automatically. Pair that with CSS custom properties for theming, the class: directive for dynamic variants, auto-fit grid for responsive layouts, and a data-theme attribute swap for dark mode — no UI library required.'
    },
    {
      href: '/setup',
      title: 'Setup & Installation',
      icon: '🛠️',
      what: 'Scaffold, project structure, config files, $lib, load functions',
      desc: 'A complete walkthrough: scaffold with create-svelte, understand the file layout, configure adapters, use the $lib alias, write .svelte.ts rune modules, and load server data — everything needed to start a real project.'
    }
  ];

  const runes = [
    { name: '$state', desc: 'Declares a reactive variable. Mutations are tracked deeply on objects and arrays.' },
    { name: '$derived', desc: 'Computes a value from other reactive state. Re-evaluates only when dependencies change.' },
    { name: '$effect', desc: 'Runs a side-effect after state changes. Return a function for cleanup.' },
    { name: '$props', desc: 'Destructures a component\'s incoming props with full TypeScript support.' },
    { name: '$bindable', desc: 'Marks a prop as two-way bindable so the parent can use bind:propName.' },
    { name: '$inspect', desc: 'Dev-only helper that logs reactive values to the console when they change.' }
  ];
</script>

<h1>About this showcase</h1>
<p class="lede">
  This site is a hands-on tour of <strong>Svelte 5</strong> and
  <strong>SvelteKit 2</strong>, built as a reference you can read end-to-end or
  jump into one topic at a time. Each page is deliberately narrow: it isolates a
  single feature area — reactivity, forms, lifecycle, transitions, shared state,
  composition, CSS, or project setup — and shows the smallest realistic demo
  along with the exact source that drives it. There are no wrapper libraries,
  utility frameworks, or abstractions on top of what Svelte already gives you,
  so every line of code is something you'd write in a real project. The
  remainder of this page summarizes what each demo covers and explains the
  rune-based reactivity model that ties them all together.
</p>

<section>
  <h2>The rune system</h2>
  <p class="body">
    Svelte 5 replaces magic compiler labels (<code>$:</code>, <code>export let</code>)
    with explicit <em>runes</em> — functions that start with <code>$</code> and are
    understood by the Svelte compiler. They work consistently in <code>.svelte</code>
    files and in <code>.svelte.ts</code> modules, making reactive logic portable.
  </p>
  <dl class="rune-grid">
    {#each runes as r}
      <dt><code>{r.name}</code></dt>
      <dd>{r.desc}</dd>
    {/each}
  </dl>
</section>

<section>
  <h2>Pages</h2>
  <div class="page-list">
    {#each pages as p}
      <a class="page-card" href="{base}{p.href}">
        <div class="page-header">
          <span class="icon">{p.icon}</span>
          <div>
            <strong>{p.title}</strong>
            <span class="tag">{p.what}</span>
          </div>
          <span class="arrow">→</span>
        </div>
        <p>{p.desc}</p>
      </a>
    {/each}
  </div>
</section>

<section>
  <h2>Stack</h2>
  <ul class="stack-list">
    <li><strong>Svelte 5</strong> — UI framework with the runes reactivity model</li>
    <li><strong>SvelteKit 2</strong> — file-based routing, SSR, adapters</li>
    <li><strong>Vite 5</strong> — dev server and bundler</li>
    <li><strong>TypeScript</strong> — full type coverage throughout</li>
    <li><strong>No UI library</strong> — all styles are hand-written CSS custom properties</li>
  </ul>
</section>

<style>
  .lede { color: var(--muted); font-size: 1.05rem; }
  section { margin: 2rem 0; }
  h2 { margin: 0 0 0.75rem; font-size: 1.3rem; }
  .body { color: var(--muted); max-width: 65ch; }

  .rune-grid {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 0.5rem 1.25rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1rem 1.25rem;
    margin: 0.75rem 0 0;
  }
  dt { color: var(--muted); white-space: nowrap; }
  dd { margin: 0; }

  .page-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .page-card {
    display: block;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1rem 1.25rem;
    color: var(--text);
    transition: border-color 120ms, transform 120ms;
  }
  .page-card:hover {
    text-decoration: none;
    border-color: var(--accent);
    transform: translateX(3px);
  }
  .page-header {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 0.4rem;
  }
  .page-header > div { flex: 1; display: flex; flex-direction: column; gap: 0.1rem; }
  .icon { font-size: 1.3rem; line-height: 1; margin-top: 0.1rem; }
  .tag { font-size: 0.8rem; color: var(--muted); font-family: ui-monospace, monospace; }
  .arrow { color: var(--accent); font-size: 1.1rem; margin-left: auto; }
  .page-card p { margin: 0; color: var(--muted); font-size: 0.9rem; max-width: 70ch; padding-left: 2.1rem; }

  .stack-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .stack-list li {
    padding: 0.5rem 0.75rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 0.95rem;
  }
  .stack-list li::before { content: '▸ '; color: var(--accent); }
</style>
