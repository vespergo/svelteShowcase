<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const snippet1 = `
// $effect runs after state changes and can return a cleanup function.
// The cleanup is called before the effect re-runs and when the component unmounts —
// so setup and teardown live side-by-side, no separate onDestroy needed.

let running = $state(true);
let seconds  = $state(0);

$effect(() => {
  if (!running) return;          // early-return skips setup when paused
  const id = setInterval(() => { seconds++; }, 1000);
  return () => clearInterval(id); // cleanup: runs when \`running\` flips or on unmount
});
  `;

  const snippet2 = `
// When a dependency changes, Svelte calls the old cleanup BEFORE re-running.
// Here, switching \`listenTarget\` automatically removes the stale listener
// and attaches a fresh one — no manual teardown required.

let listenTarget = $state('window');

$effect(() => {
  const target = listenTarget === 'window' ? window : document.body;
  function handler() { clickCount++; }
  target.addEventListener('click', handler);
  return () => target.removeEventListener('click', handler);
});
  `;

  const snippet3 = `
import { onMount, onDestroy } from 'svelte';

// onMount: fires once after the component is first inserted into the DOM.
// Useful when you need a real DOM reference or browser-only APIs.
onMount(() => {
  mountLog = [...mountLog, \`mounted at \${new Date().toLocaleTimeString()}\`];
});

// onDestroy: fires when the component is removed (e.g. navigating away).
// Prefer returning a cleanup from $effect for most cases.
onDestroy(() => {
  console.log('component destroyed');
});
  `;

  // ── $effect clock ────────────────────────────────────────────────────────
  let running = $state(true);
  let seconds = $state(0);
  let time = $state(new Date());

  $effect(() => {
    if (!running) return;
    const id = setInterval(() => {
      seconds += 1;
      time = new Date();
    }, 1000);
    return () => clearInterval(id); // cleanup runs when running→false or component unmounts
  });

  // ── onMount / onDestroy ──────────────────────────────────────────────────
  let mountLog = $state<string[]>([]);

  onMount(() => {
    mountLog = [...mountLog, `onMount fired at ${new Date().toLocaleTimeString()}`];
  });

  onDestroy(() => {
    // This fires when navigating away — visible in devtools console
    console.log('lifecycle page destroyed');
  });

  // ── $effect cleanup demo ─────────────────────────────────────────────────
  let listenTarget = $state('window');
  let clickCount = $state(0);

  $effect(() => {
    const target = listenTarget === 'window' ? window : document.body;
    function handler() { clickCount++; }
    target.addEventListener('click', handler);
    return () => target.removeEventListener('click', handler);
    // each time listenTarget changes, old listener is removed before the new one is added
  });

  function pad(n: number) { return String(n).padStart(2, '0'); }
  const hms = $derived(
    `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`
  );
</script>

<h1>Lifecycle</h1>
<p class="lede">
  This page shows how component lifecycle works in Svelte 5. Most setup and
  teardown now lives inside <code>$effect</code> — when the effect re-runs or the
  component unmounts, the function it returns is called automatically, so timers,
  listeners, and subscriptions clean themselves up. The classic <code>onMount</code>
  and <code>onDestroy</code> hooks still exist for cases that need imperative DOM
  access or interop with non-reactive code. The demos below include a pausable
  clock, a swappable click listener, and a mount/destroy log so you can watch each
  hook fire in real time.
</p>

<section>
  <h3><code>$effect</code> with cleanup — live clock</h3>
  <p class="sub">
    The effect starts an interval when <code>running</code> is <code>true</code>.
    Returning a function tells Svelte to call it when the effect re-runs or the
    component unmounts — no separate <code>onDestroy</code> needed.
  </p>
  <div class="clock">{hms}</div>
  <div class="row">
    <button onclick={() => (running = !running)}>
      {running ? 'Pause' : 'Resume'}
    </button>
    <span class="muted">Elapsed: {seconds}s</span>
    <button class="ghost" onclick={() => { seconds = 0; }}>Reset count</button>
  </div>
  <pre class="snippet">$effect(() =&gt; {"{"}
  if (!running) return;
  const id = setInterval(() =&gt; {"{"} seconds++; {"}"}, 1000);
  return () =&gt; clearInterval(id); // cleanup
{"}"});</pre>
</section>

<section>
  <h3><code>$effect</code> re-runs on dependency change</h3>
  <p class="sub">
    Each time <code>listenTarget</code> changes, Svelte automatically calls the
    cleanup (removing the old listener) and re-runs the effect (adding the new one).
  </p>
  <div class="row">
    <label>
      Listen on
      <select bind:value={listenTarget}>
        <option value="window">window</option>
        <option value="body">document.body</option>
      </select>
    </label>
    <span class="muted">Clicks detected: <strong>{clickCount}</strong></span>
    <button class="ghost" onclick={() => (clickCount = 0)}>Reset</button>
  </div>
</section>

<section>
  <h3><code>onMount</code> &amp; <code>onDestroy</code></h3>
  <p class="sub">
    <code>onMount</code> runs after the component first renders in the DOM.
    <code>onDestroy</code> fires when it's removed — navigate away and check
    the console to see it.
  </p>
  <ul class="log">
    {#each mountLog as entry}
      <li>{entry}</li>
    {/each}
  </ul>
</section>

<hr class="divider" />
<section class="snippets">
  <h2>Code</h2>
  <CodeBlock file="routes/lifecycle/+page.svelte" lang="ts" code={snippet1} />
  <CodeBlock file="routes/lifecycle/+page.svelte" lang="ts" code={snippet2} />
  <CodeBlock file="routes/lifecycle/+page.svelte" lang="ts" code={snippet3} />
</section>

<style>
  .divider { border: none; border-top: 1px solid var(--border); margin: 2rem 0 1.5rem; }
  .snippets h2 { margin: 0 0 0.5rem; font-size: 1.2rem; }
  .lede { color: var(--muted); }
  section { margin: 1.75rem 0; }
  .sub { color: var(--muted); font-size: 0.9rem; max-width: 60ch; margin: 0.25rem 0 0.75rem; }

  .clock {
    font-size: 3rem;
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: 0.05em;
    margin: 0.5rem 0;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin: 0.75rem 0;
  }
  .muted { color: var(--muted); }

  .snippet {
    font-size: 0.85rem;
    margin-top: 0.75rem;
  }

  label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.9rem;
    color: var(--muted);
  }

  .log {
    list-style: none;
    padding: 0.75rem 1rem;
    margin: 0;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--muted);
    font-size: 0.9rem;
  }
  .log li::before { content: '▸ '; color: var(--accent); }
</style>
