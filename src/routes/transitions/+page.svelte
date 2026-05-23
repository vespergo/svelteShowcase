<script lang="ts">
  import { fade, fly, slide } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const snippet1 = `
<!-- transition: applies the same animation on both enter and exit -->
{#if detailsOpen}
  <div transition:slide={{ duration: 250 }}>
    Collapses and expands automatically.
  </div>
{/if}

<!-- in: and out: let you use different animations for each direction -->
{#if panelOpen}
  <div in:fly={{ y: 16, duration: 250 }} out:fade={{ duration: 150 }}>
    Flies in, fades out.
  </div>
{/if}
  `;

  const snippet2 = `
import { flip } from 'svelte/animate';
import { fade } from 'svelte/transition';

// animate:flip smoothly repositions items when the list order changes.
// The key expression (item.id) tells Svelte which element is which
// so it can calculate the before/after positions and tween between them.
{#each items as item (item.id)}
  <li animate:flip={{ duration: 300 }} in:fade out:fade>
    {item.label}
  </li>
{/each}
  `;

  const snippet3 = `
type Item = { id: number; label: string };
let items = $state<Item[]>([
  { id: 1, label: 'Espresso' },
  { id: 2, label: 'Cortado' },
]);

function addItem() {
  items.push({ id: nextId++, label: 'Latte' });
}
function removeItem(id: number) {
  items = items.filter(i => i.id !== id);
}
function shuffle() {
  items = [...items].sort(() => Math.random() - 0.5);
}
  `;

  let panelOpen = $state(true);
  let detailsOpen = $state(false);

  type Item = { id: number; label: string };
  let nextId = 4;
  let items = $state<Item[]>([
    { id: 1, label: 'Espresso' },
    { id: 2, label: 'Cortado' },
    { id: 3, label: 'Flat white' }
  ]);

  function addItem() {
    const labels = ['Latte', 'Macchiato', 'Mocha', 'Americano', 'Cappuccino'];
    items.push({ id: nextId++, label: labels[Math.floor(Math.random() * labels.length)] });
  }
  function removeItem(id: number) {
    items = items.filter((i) => i.id !== id);
  }
  function shuffle() {
    items = [...items].sort(() => Math.random() - 0.5);
  }
</script>

<h1>Transitions &amp; Animations</h1>
<p class="lede">
  This page tours Svelte's built-in motion primitives. The
  <code>transition:</code> directive runs an animation both on enter and exit,
  while <code>in:</code> and <code>out:</code> let you pick different effects for
  each direction — useful when fading in feels right but sliding out feels better.
  For lists, <code>animate:flip</code> smoothly interpolates item positions when
  the underlying array reorders, giving you Material-style list reflow with no
  layout math. Use the controls below to mix <code>fade</code>, <code>fly</code>,
  and <code>slide</code> on a single element, then shuffle a keyed list to see
  FLIP animations in action.
</p>

<section>
  <h3>fly in / fade out</h3>
  <button onclick={() => (panelOpen = !panelOpen)}>
    {panelOpen ? 'Hide' : 'Show'} panel
  </button>
  {#if panelOpen}
    <div class="panel" in:fly={{ y: 16, duration: 250 }} out:fade={{ duration: 150 }}>
      I slide up on enter and fade on exit.
    </div>
  {/if}
</section>

<section>
  <h3>slide</h3>
  <button class="ghost" onclick={() => (detailsOpen = !detailsOpen)}>
    {detailsOpen ? 'Collapse' : 'Expand'} details
  </button>
  {#if detailsOpen}
    <div class="panel" transition:slide={{ duration: 250 }}>
      A natural collapsible — height animates automatically.
    </div>
  {/if}
</section>

<section>
  <h3>animate:flip on a keyed list</h3>
  <div class="row">
    <button onclick={addItem}>Add</button>
    <button class="ghost" onclick={shuffle}>Shuffle</button>
  </div>
  <ul class="list">
    {#each items as item (item.id)}
      <li animate:flip={{ duration: 300 }} in:fade out:fade>
        <span>{item.label}</span>
        <button class="ghost small" onclick={() => removeItem(item.id)}>remove</button>
      </li>
    {/each}
  </ul>
</section>

<hr class="divider" />
<section class="snippets">
  <h2>Code</h2>
  <CodeBlock file="routes/transitions/+page.svelte" lang="svelte" code={snippet1} />
  <CodeBlock file="routes/transitions/+page.svelte" lang="svelte" code={snippet2} />
  <CodeBlock file="routes/transitions/+page.svelte" lang="ts" code={snippet3} />
</section>

<style>
  .divider { border: none; border-top: 1px solid var(--border); margin: 2rem 0 1.5rem; }
  .snippets h2 { margin: 0 0 0.5rem; font-size: 1.2rem; }
  .lede { color: var(--muted); }
  section { margin: 1.5rem 0; }
  .panel {
    margin-top: 0.75rem;
    padding: 0.75rem 1rem;
    background: var(--accent-soft);
    border-radius: 8px;
  }
  .row { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; }
  .list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.5rem 0.75rem;
  }
  button.small { padding: 0.2rem 0.5rem; font-size: 0.85rem; }
</style>
