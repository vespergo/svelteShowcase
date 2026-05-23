<script lang="ts">
  import { cart } from '$lib/stores/cart.svelte';
  import { fade } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const snippet1 = `
// lib/stores/cart.svelte.ts
// A factory function holds $state privately and exposes a clean API.
// Because $state lives in a .svelte.ts module, it's reactive anywhere it's imported.

export type CartItem = { id: string; name: string; price: number; qty: number };

function createCart() {
  let items = $state<CartItem[]>([]);

  return {
    get items() { return items; },
    get total() { return items.reduce((sum, i) => sum + i.price * i.qty, 0); },
    get count() { return items.reduce((sum, i) => sum + i.qty, 0); },

    add(product: { id: string; name: string; price: number }) {
      const existing = items.find(i => i.id === product.id);
      if (existing) existing.qty += 1;
      else items.push({ ...product, qty: 1 });
    },
    remove(id: string) {
      items.splice(items.findIndex(i => i.id === id), 1);
    },
    clear() { items.length = 0; }
  };
}

export const cart = createCart();
  `;

  const snippet2 = `
// Any component just imports \`cart\` — no subscription, no $store prefix.
// Reading cart.items or cart.total inside the template is automatically reactive.
import { cart } from '$lib/stores/cart.svelte';

// Adding an item — mutation is tracked by the $state inside the factory
cart.add({ id: 'p1', name: 'Notebook', price: 8 });

// Template usage
// {cart.count}     — reactive getter, updates instantly
// {cart.total}     — derived from items, no extra $derived needed
  `;

  const snippet3 = `
<!-- The cart list uses animate:flip so items slide when order changes,
     and in:/out: fade for enter/exit. Keyed by item.id. -->
{#each cart.items as item (item.id)}
  <li animate:flip={{ duration: 200 }} in:fade out:fade>
    <span>{item.name} × {item.qty}</span>
    <button onclick={() => cart.remove(item.id)}>×</button>
  </li>
{/each}
  `;

  const products = [
    { id: 'p1', name: 'Notebook', price: 8 },
    { id: 'p2', name: 'Pen set', price: 12 },
    { id: 'p3', name: 'Mug', price: 14 },
    { id: 'p4', name: 'Sticker pack', price: 5 }
  ];

  const fmt = (n: number) => `$${n.toFixed(2)}`;
</script>

<h1>Shared State</h1>
<p class="lede">
  This page shows the modern way to share state across components in Svelte 5.
  Instead of the old <code>writable()</code> store with its <code>$</code>-prefix
  subscriptions, a plain TypeScript module exports an object whose properties
  are declared with <code>$state</code>. Any component that imports it reads and
  writes those properties directly — reactivity crosses the module boundary for
  free. The two cart panels below are independent components, but adding an item
  in one instantly updates the other, the totals, and the badge in the header.
  Notice there is no provider, no context, and no subscription wiring anywhere.
</p>

<div class="grid">
  <section>
    <h3>Products</h3>
    <ul class="products">
      {#each products as p}
        <li>
          <div>
            <strong>{p.name}</strong>
            <span class="muted">{fmt(p.price)}</span>
          </div>
          <button onclick={() => cart.add(p)}>Add</button>
        </li>
      {/each}
    </ul>
  </section>

  <section>
    <h3>Cart ({cart.count})</h3>
    {#if cart.items.length === 0}
      <p class="muted">Cart is empty.</p>
    {:else}
      <ul class="cart">
        {#each cart.items as item (item.id)}
          <li animate:flip={{ duration: 200 }} in:fade out:fade>
            <span>{item.name} × {item.qty}</span>
            <span>{fmt(item.price * item.qty)}</span>
            <button class="ghost small" onclick={() => cart.remove(item.id)}>×</button>
          </li>
        {/each}
      </ul>
      <div class="total">
        <span>Total</span>
        <strong>{fmt(cart.total)}</strong>
      </div>
      <button class="ghost" onclick={() => cart.clear()}>Clear cart</button>
    {/if}
  </section>
</div>

<hr class="divider" />
<section class="snippets">
  <h2>Code</h2>
  <CodeBlock file="lib/stores/cart.svelte.ts" lang="ts" code={snippet1} />
  <CodeBlock file="routes/stores/+page.svelte" lang="ts" code={snippet2} />
  <CodeBlock file="routes/stores/+page.svelte" lang="svelte" code={snippet3} />
</section>

<style>
  .divider { border: none; border-top: 1px solid var(--border); margin: 2rem 0 1.5rem; }
  .snippets h2 { margin: 0 0 0.5rem; font-size: 1.2rem; }
  .lede { color: var(--muted); }
  .grid {
    display: grid;
    gap: 1.25rem;
    grid-template-columns: 1fr 1fr;
    margin-top: 1rem;
  }
  @media (max-width: 640px) { .grid { grid-template-columns: 1fr; } }

  ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.4rem; }
  .products li, .cart li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.5rem 0.75rem;
  }
  .products li > div { display: flex; flex-direction: column; }
  .muted { color: var(--muted); font-size: 0.9rem; }
  .total {
    display: flex;
    justify-content: space-between;
    margin: 0.75rem 0;
    padding-top: 0.5rem;
    border-top: 1px solid var(--border);
  }
  button.small { padding: 0.15rem 0.4rem; }
</style>
