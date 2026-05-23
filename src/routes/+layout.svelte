<script lang="ts">
  import '../app.css';
  import { fade } from 'svelte/transition';
  import { page } from '$app/state';
  import NavLink from '$lib/components/NavLink.svelte';

  let { children } = $props();
</script>

<div class="shell">
  <header class="topbar">
    <a class="brand" href="/">Svelte Showcase</a>
    <nav>
      <NavLink href="/reactivity">Reactivity</NavLink>
      <NavLink href="/forms">Forms</NavLink>
      <NavLink href="/lifecycle">Lifecycle</NavLink>
      <NavLink href="/transitions">Transitions</NavLink>
      <NavLink href="/stores">Stores</NavLink>
      <NavLink href="/composition">Composition</NavLink>
      <NavLink href="/css">CSS</NavLink>
      <NavLink href="/setup">Setup</NavLink>
      <NavLink href="/about">About</NavLink>
    </nav>
  </header>

  <main>
    {#key page.url.pathname}
      <div in:fade={{ duration: 180 }}>
        {@render children()}
      </div>
    {/key}
  </main>

  <footer class="bottom">Built with SvelteKit + Svelte 5 runes</footer>
</div>

<style>
  .shell {
    max-width: 960px;
    margin: 0 auto;
    padding: 1.5rem 1.25rem 3rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    min-height: 100vh;
  }
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
  }
  .brand {
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--text);
  }
  .brand:hover { text-decoration: none; color: var(--accent); }
  nav { display: flex; gap: 0.25rem; flex-wrap: wrap; }
  main { flex: 1; }
  .bottom {
    color: var(--muted);
    font-size: 0.85rem;
    border-top: 1px solid var(--border);
    padding-top: 1rem;
  }
</style>
