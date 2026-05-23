<script lang="ts">
  import { untrack } from 'svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const snippet1 = `
// Declare reactive state
let count = $state(0);

// Derived value — recomputes whenever count changes
let doubled = $derived(count * 2);
  `;

  const snippet2 = `
import { untrack } from 'svelte';

let log = $state<string[]>([]);

$effect(() => {
  // Reading \`count\` makes this effect depend on it.
  const entry = \`count changed → \${count}\`;

  // untrack() reads \`log\` without adding it as a dependency,
  // preventing an infinite loop (effect writes log → log changes → effect re-runs).
  log = untrack(() => [...log, entry].slice(-6));
});
  `;

  const snippet3 = `
<!-- Template reads reactive state directly — no subscription needed -->
<button onclick={() => count--}>−</button>
<strong>{count}</strong>
<button onclick={() => count++}>+</button>

<!-- $derived updates automatically -->
<dd>{doubled}</dd>
  `;

  let count = $state(0);
  let doubled = $derived(count * 2);
  let log = $state<string[]>([]);

  $effect(() => {
    const entry = `count changed → ${count}`;
    log = untrack(() => [...log, entry].slice(-6));
  });
</script>

<h1>Reactivity</h1>
<p class="lede">
  This page demonstrates the three reactivity primitives at the heart of Svelte 5.
  <code>$state</code> declares a reactive variable, <code>$derived</code> computes
  a value that recalculates whenever its inputs change, and <code>$effect</code>
  runs side effects in response to state changes. Together they replace Svelte 4's
  implicit <code>$:</code> labels with explicit, traceable wiring. Use the counter
  below to watch all three runes react in real time, and see <code>untrack</code>
  used to break what would otherwise be an infinite update loop.
</p>

<div class="row">
  <button onclick={() => count--}>−</button>
  <strong class="num">{count}</strong>
  <button onclick={() => count++}>+</button>
  <button class="ghost" onclick={() => (count = 0)}>reset</button>
</div>

<dl>
  <dt><code>$state</code></dt>
  <dd>{count}</dd>
  <dt><code>$derived</code> (count × 2)</dt>
  <dd>{doubled}</dd>
</dl>

<section>
  <h3><code>$effect</code> log</h3>
  {#if log.length === 0}
    <p class="muted">Change the counter to see effects fire.</p>
  {:else}
    <ul>
      {#each log as entry, i (i + entry)}
        <li>{entry}</li>
      {/each}
    </ul>
  {/if}
</section>

<hr class="divider" />
<section class="snippets">
  <h2>Code</h2>
  <CodeBlock file="routes/reactivity/+page.svelte" lang="ts" code={snippet1} />
  <CodeBlock file="routes/reactivity/+page.svelte" lang="ts" code={snippet2} />
  <CodeBlock file="routes/reactivity/+page.svelte" lang="svelte" code={snippet3} />
</section>

<style>
  .divider { border: none; border-top: 1px solid var(--border); margin: 2rem 0 1.5rem; }
  .snippets h2 { margin: 0 0 0.5rem; font-size: 1.2rem; }
  .lede { color: var(--muted); }
  .row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 1rem 0;
  }
  .num { font-size: 1.6rem; min-width: 3ch; text-align: center; }
  dl {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 0.4rem 1rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    margin: 1rem 0;
  }
  dt { color: var(--muted); }
  dd { margin: 0; font-weight: 600; }
  ul { padding-left: 1.2rem; color: var(--muted); }
  .muted { color: var(--muted); }
</style>
