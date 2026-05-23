<script lang="ts">
  import { page } from '$app/state';
  import { base } from '$app/paths';
  import type { Snippet } from 'svelte';

  let { href, children }: { href: string; children: Snippet } = $props();

  let resolved = $derived(`${base}${href}`);
  let active = $derived(
    page.url.pathname === resolved || page.url.pathname === `${resolved}/`
  );
</script>

<a href={resolved} class:active aria-current={active ? 'page' : undefined}>
  {@render children()}
</a>

<style>
  a {
    padding: 0.4rem 0.75rem;
    border-radius: 6px;
    color: var(--text);
    font-weight: 500;
  }
  a:hover { background: var(--accent-soft); text-decoration: none; }
  a.active {
    background: var(--accent);
    color: white;
  }
</style>
