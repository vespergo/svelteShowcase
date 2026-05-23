<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import Counter from '$lib/components/Counter.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const snippet1 = `
// lib/components/Counter.svelte
// $props() destructures all incoming props with full TypeScript types.
// $bindable() marks \`value\` as two-way bindable — the parent can write back to it.

let {
  label = 'Counter',
  step  = 1,
  value = $bindable(0)
}: { label?: string; step?: number; value?: number } = $props();
  `;

  const snippet2 = `
// Parent component
// bind:value creates a two-way link — no custom events, no callbacks.
// When Counter increments \`value\`, the parent's variable updates automatically.

let coffeesToday = $state(2);
let pushUps      = $state(20);
  `;

  const snippet3 = `
<!-- Snippets replace slots. Declare with {#snippet name()} and render with {@render name()}. -->
<!-- Card.svelte expects a \`body\` snippet and an optional \`footer\` snippet. -->

<Card title="Bound counters">
  {#snippet body()}
    <Counter label="Coffees today" bind:value={coffeesToday} />
    <Counter label="Push-ups" step={5} bind:value={pushUps} />
    <p>Coffee × Push-ups = <strong>{coffeesToday * pushUps}</strong></p>
  {/snippet}
  {#snippet footer()}
    Both counters share state in the parent — no lifting needed.
  {/snippet}
</Card>
  `;

  const snippet4 = `
// lib/components/Card.svelte
// Snippets are typed as \`Snippet\` from 'svelte'.
// The component renders them with {@render body()} / {@render footer()}.

import type { Snippet } from 'svelte';

let {
  title,
  body,
  footer
}: { title: string; body: Snippet; footer?: Snippet } = $props();
  `;

  let profile = $state({
    name: 'Ada Lovelace',
    role: 'Engineer',
    remote: true,
    yearsExperience: 5
  });

  let coffeesToday = $state(2);
  let pushUps = $state(20);
</script>

<h1>Composition</h1>
<p class="lede">
  This page covers how to build and combine reusable components in Svelte 5.
  Child components declare their inputs with <code>$props</code>, opt specific
  props into two-way binding with <code>$bindable</code>, and accept reusable
  template fragments through <code>{@render}</code> snippets — the modern
  replacement for named slots. The demos below include a <code>Counter</code>
  whose value binds back to the parent with <code>bind:value</code>, and a
  <code>Card</code> whose header and footer are passed in as snippets so a single
  component can render in many shapes without prop bloat.
</p>

<div class="grid">
  <Card title="Live form">
    {#snippet body()}
      <form>
        <label>
          Name
          <input bind:value={profile.name} />
        </label>
        <label>
          Role
          <select bind:value={profile.role}>
            <option>Engineer</option>
            <option>Designer</option>
            <option>PM</option>
          </select>
        </label>
        <label class="check">
          <input type="checkbox" bind:checked={profile.remote} />
          Remote
        </label>
        <label>
          Years experience
          <input type="number" min="0" bind:value={profile.yearsExperience} />
        </label>
      </form>
    {/snippet}
    {#snippet footer()}
      Edits propagate up via <code>bind:</code> — no event plumbing needed.
    {/snippet}
  </Card>

  <Card title="Bound counters (reused component)">
    {#snippet body()}
      <p class="muted">
        One component, three bindings. Parent state stays in sync because
        <code>value</code> is declared <code>$bindable</code>.
      </p>
      <div class="counters">
        <Counter label="Coffees today" bind:value={coffeesToday} />
        <Counter label="Push-ups" step={5} bind:value={pushUps} />
      </div>
      <p>Coffee × Push-ups = <strong>{coffeesToday * pushUps}</strong></p>
    {/snippet}
  </Card>

  <Card title="Live JSON preview">
    {#snippet body()}
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    {/snippet}
    {#snippet footer()}Updates as you type.{/snippet}
  </Card>
</div>

<hr class="divider" />
<section class="snippets">
  <h2>Code</h2>
  <CodeBlock file="lib/components/Counter.svelte" lang="ts" code={snippet1} />
  <CodeBlock file="routes/composition/+page.svelte" lang="ts" code={snippet2} />
  <CodeBlock file="routes/composition/+page.svelte" lang="svelte" code={snippet3} />
  <CodeBlock file="lib/components/Card.svelte" lang="ts" code={snippet4} />
</section>

<style>
  .divider { border: none; border-top: 1px solid var(--border); margin: 2rem 0 1.5rem; }
  .snippets h2 { margin: 0 0 0.5rem; font-size: 1.2rem; }
  .lede { color: var(--muted); }
  .grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    margin-top: 1rem;
  }
  form { display: flex; flex-direction: column; gap: 0.6rem; }
  label { display: flex; flex-direction: column; font-size: 0.9rem; color: var(--muted); gap: 0.2rem; }
  label.check { flex-direction: row; align-items: center; gap: 0.5rem; }
  .counters { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0.5rem 0; }
  .muted { color: var(--muted); }
</style>
