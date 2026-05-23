<script lang="ts">
  import type { Snippet } from 'svelte';
  let {
    title,
    body,
    footer
  }: { title: string; body: Snippet; footer?: Snippet } = $props();
</script>

<article class="card">
  <header><h3>{title}</h3></header>
  <div class="body">{@render body()}</div>
  {#if footer}
    <footer>{@render footer()}</footer>
  {/if}
</article>

<style>
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  header h3 { margin: 0; }
  footer {
    border-top: 1px solid var(--border);
    padding-top: 0.5rem;
    color: var(--muted);
    font-size: 0.9rem;
  }
</style>
