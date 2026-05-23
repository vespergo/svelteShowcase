<script lang="ts">
  import { base } from '$app/paths';
  const demos = [
    {
      href: '/reactivity',
      title: 'Reactivity',
      blurb: '$state, $derived, $effect — Svelte 5 runes in action.'
    },
    {
      href: '/forms',
      title: 'Forms & Validation',
      blurb: '$derived for live validation rules. Touch tracking keeps errors polite.'
    },
    {
      href: '/lifecycle',
      title: 'Lifecycle',
      blurb: '$effect cleanup, onMount, onDestroy — setup and teardown co-located.'
    },
    {
      href: '/transitions',
      title: 'Transitions',
      blurb: 'fade / fly / slide and animate:flip on a reorderable list.'
    },
    {
      href: '/stores',
      title: 'Shared State',
      blurb: 'A reactive cart shared across sibling components.'
    },
    {
      href: '/composition',
      title: 'Composition',
      blurb: 'bind:value forms, snippets, and reusable components.'
    },
    {
      href: '/css',
      title: 'CSS Techniques',
      blurb: 'Scoped styles, custom properties, dynamic classes, responsive grid, dark mode — no UI library.'
    },
    {
      href: '/setup',
      title: 'Setup & Installation',
      blurb: 'Scaffold, file structure, config files, $lib alias, load functions, and key packages.'
    }
  ];
</script>

<section class="hero">
  <h1>Svelte 5, by example.</h1>
  <p>
    A hands-on tour of Svelte 5 and SvelteKit 2, organized as eight focused pages.
    Each one isolates a single feature area — reactivity runes, form validation,
    lifecycle and effects, transitions, shared state, component composition, CSS
    techniques, and project setup — and pairs a small interactive demo with the
    exact source that powers it. No UI libraries, no extra abstractions: every
    line is something you'd write in a real project. Pick a tile below to jump
    in, or read the <a href="{base}/about">About</a> page for an overview of every
    demo and the rune system that ties them together.
  </p>
</section>

<div class="grid">
  {#each demos as demo}
    <a class="tile" href="{base}{demo.href}">
      <h3>{demo.title}</h3>
      <p>{demo.blurb}</p>
      <span class="arrow">→</span>
    </a>
  {/each}
</div>

<style>
  .hero { margin-bottom: 1.5rem; }
  .hero h1 { font-size: 2rem; margin: 0 0 0.5rem; }
  .hero p { color: var(--muted); margin: 0; }

  .grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
  .tile {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1rem 1.25rem;
    color: var(--text);
    position: relative;
    transition: transform 120ms ease, border-color 120ms ease;
  }
  .tile:hover {
    text-decoration: none;
    transform: translateY(-2px);
    border-color: var(--accent);
  }
  .tile h3 { margin: 0 0 0.25rem; }
  .tile p { margin: 0; color: var(--muted); font-size: 0.9rem; }
  .arrow {
    position: absolute;
    top: 1rem;
    right: 1rem;
    color: var(--accent);
    font-size: 1.1rem;
  }
</style>
