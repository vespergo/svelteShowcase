<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const snippet1 = `
<!-- Svelte rewrites every selector in <style> to include a unique attribute,
     so .card here only targets .card elements in THIS component. -->

<div class="card">Scoped card</div>

<style>
  /* Compiles to something like: .card.svelte-abc123 { ... } */
  .card { background: papayawhip; border-radius: 8px; }

  /* Escape the scope when you need to reach into child components */
  :global(.third-party-class) { color: red; }
</style>
  `;

  const snippet2 = `
<!-- Set custom properties inline using Svelte's reactive style attribute.
     All children that read --demo-accent automatically pick up the change. -->

<script>
  let accent = $state('#c2410c');
  let radius = $state(8);
<\/script>

<div style="--demo-accent:{accent}; --demo-radius:{radius}px">
  <button class="themed-btn">Uses --demo-accent</button>
</div>

<style>
  /* Tokens defined at :root are available everywhere */
  :root { --accent: #c2410c; --radius: 8px; }

  .themed-btn {
    background: var(--demo-accent);
    border-radius: var(--demo-radius);
  }
</style>
  `;

  const snippet3 = `
<!-- class:name={condition} toggles a class based on a boolean expression.
     Stack multiple directives to compose variants without string concatenation. -->

<button
  class="btn"
  class:sm={size === 'sm'}
  class:lg={size === 'lg'}
  class:outline={variant === 'outline'}
  class:pressed
>
  Click me
</button>

<style>
  .btn         { background: var(--accent); color: white; padding: 0.45rem 1rem; }
  .btn.sm      { font-size: 0.8rem; padding: 0.25rem 0.6rem; }
  .btn.lg      { font-size: 1.1rem; padding: 0.65rem 1.4rem; }
  .btn.outline { background: transparent; color: var(--accent); border: 2px solid; }
  .btn.pressed { transform: scale(0.95); }
</style>
  `;

  const snippet4 = `
<!-- repeat(auto-fit, minmax()) fills a row with as many columns as fit
     then wraps — responsive with zero media queries. -->

<div class="grid" style="--col-min:{colMin}px">
  {#each cards as card}
    <div class="card">{card}</div>
  {/each}
</div>

<style>
  .grid {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fit, minmax(var(--col-min), 1fr));
  }
</style>
  `;

  const snippet5 = `
<!-- Define two sets of custom properties — one per theme.
     Toggle a data attribute to switch the entire sub-tree at once. -->

<script>
  let darkMode = $state(false);
<\/script>

<div data-theme={darkMode ? 'dark' : 'light'}>
  <button onclick={() => (darkMode = !darkMode)}>Toggle</button>
  <p class="body-text">Adapts to the active theme.</p>
</div>

<style>
  [data-theme="light"] {
    --bg: #f5f3ef;
    --text: #2a2724;
    --surface: #ffffff;
  }
  [data-theme="dark"] {
    --bg: #1a1917;
    --text: #e8e2d9;
    --surface: #27251f;
  }

  /* Children just read the variables — no theme-aware code needed */
  .body-text { background: var(--surface); color: var(--text); }
</style>
  `;

  // ── Scoped styles demo ───────────────────────────────────────────────────
  // nothing needed — Svelte scoping is automatic

  // ── Custom properties live editor ────────────────────────────────────────
  let accent = $state('#c2410c');
  let radius = $state(8);
  let space = $state(12);

  // ── Dynamic classes ───────────────────────────────────────────────────────
  let size: 'sm' | 'md' | 'lg' = $state('md');
  let variant: 'solid' | 'outline' | 'ghost' = $state('solid');
  let pressed = $state(false);

  // ── Dark mode toggle ─────────────────────────────────────────────────────
  let darkMode = $state(false);

  // ── Responsive grid ───────────────────────────────────────────────────────
  let colMin = $state(160);
  let cardCount = $state(6);
</script>

<h1>CSS Without a UI Library</h1>
<p class="lede">
  This page walks through the CSS features Svelte ships out of the box and the
  techniques you can lean on instead of pulling in a UI library. Every
  <code>&lt;style&gt;</code> block is automatically scoped to its component, so
  selectors like <code>h1</code> or <code>.card</code> never collide with
  anything else on the page. CSS custom properties carry your theme tokens,
  the <code>class:</code> directive toggles classes based on reactive state,
  and modern layout primitives — Grid, Flexbox, container queries — handle
  responsive design without breakpoints sprinkled through your markup. The
  demos below cover scoped styles, dynamic classes, a responsive grid, and a
  dark-mode toggle driven entirely by custom properties.
</p>

<!-- ── 1. Scoped styles ─────────────────────────────────────────────── -->
<section>
  <h2>1. Scoped styles by default</h2>
  <p class="body">
    Every <code>&lt;style&gt;</code> block is scoped to its component. Svelte
    adds a unique attribute (e.g. <code>svelte-abc123</code>) to each element
    and rewrites the selector to match, so <code>.card</code> here can't clash
    with <code>.card</code> in another component.
  </p>
  <div class="scope-demo">
    <div class="fake-card">I am a <code>.fake-card</code> in this component</div>
    <p class="body">
      Styles defined for <code>.fake-card</code> below won't affect any
      <code>.fake-card</code> rendered by a different component. No BEM, no
      CSS modules, no extra tooling.
    </p>
  </div>
  <p class="tip">
    Need to style a child component's internals? Use <code>:global(.selector)</code>
    — but reach for it sparingly; it escapes the scope guarantee.
  </p>
</section>

<!-- ── 2. CSS custom properties ─────────────────────────────────────── -->
<section>
  <h2>2. CSS custom properties for live theming</h2>
  <p class="body">
    Custom properties cascade like any CSS value, so a parent that sets
    <code>--accent</code> automatically themes every child that reads it.
    Svelte's inline <code>style</code> attribute lets you write them reactively.
  </p>
  <div
    class="prop-sandbox"
    style="--demo-accent:{accent}; --demo-radius:{radius}px; --demo-space:{space}px"
  >
    <div class="prop-controls">
      <label>
        <span>--demo-accent</span>
        <input type="color" bind:value={accent} />
        <code>{accent}</code>
      </label>
      <label>
        <span>--demo-radius ({radius}px)</span>
        <input type="range" min="0" max="24" bind:value={radius} />
      </label>
      <label>
        <span>--demo-space ({space}px)</span>
        <input type="range" min="4" max="32" bind:value={space} />
      </label>
    </div>
    <div class="prop-preview">
      <button class="themed-btn">Primary button</button>
      <button class="themed-btn ghost-themed">Ghost button</button>
      <div class="themed-card">
        <strong>Card title</strong>
        <p>Card body text that inherits the same spacing and radius tokens.</p>
      </div>
    </div>
  </div>
  <p class="tip">
    Define tokens at <code>:root</code> in <code>app.css</code> for
    site-wide defaults; override them on any ancestor element to theme a
    sub-tree — no JavaScript required.
  </p>
</section>

<!-- ── 3. Dynamic classes ────────────────────────────────────────────── -->
<section>
  <h2>3. Dynamic classes with the <code>class:</code> directive</h2>
  <p class="body">
    <code>class:name={"{"}condition{"}"}</code> toggles a class based on a boolean.
    Combine multiple directives to compose variants cleanly — no template-string
    juggling needed.
  </p>
  <div class="class-controls">
    <fieldset>
      <legend>Size</legend>
      {#each ['sm', 'md', 'lg'] as s}
        <label class="radio">
          <input type="radio" bind:group={size} value={s} />
          {s}
        </label>
      {/each}
    </fieldset>
    <fieldset>
      <legend>Variant</legend>
      {#each ['solid', 'outline', 'ghost'] as v}
        <label class="radio">
          <input type="radio" bind:group={variant} value={v} />
          {v}
        </label>
      {/each}
    </fieldset>
  </div>
  <div class="class-preview">
    <button
      class="dyn-btn"
      class:sm={size === 'sm'}
      class:lg={size === 'lg'}
      class:outline={variant === 'outline'}
      class:ghost={variant === 'ghost'}
      class:pressed
      onpointerdown={() => (pressed = true)}
      onpointerup={() => (pressed = false)}
      onpointerleave={() => (pressed = false)}
    >
      Click me
    </button>
    <code class="class-output">
      class="dyn-btn{size !== 'md' ? ' ' + size : ''}{variant !== 'solid' ? ' ' + variant : ''}{pressed ? ' pressed' : ''}"
    </code>
  </div>
</section>

<!-- ── 4. Responsive grid ────────────────────────────────────────────── -->
<section>
  <h2>4. Responsive grid — no breakpoints needed</h2>
  <p class="body">
    <code>grid-template-columns: repeat(auto-fit, minmax(Xpx, 1fr))</code>
    fills a row with as many columns as fit, then wraps — fully responsive with
    a single line of CSS and zero media queries.
  </p>
  <div class="grid-controls">
    <label>
      <span>min card width ({colMin}px)</span>
      <input type="range" min="80" max="280" bind:value={colMin} />
    </label>
    <label>
      <span>card count ({cardCount})</span>
      <input type="range" min="1" max="12" bind:value={cardCount} />
    </label>
  </div>
  <div class="auto-grid" style="--col-min:{colMin}px">
    {#each { length: cardCount } as _, i}
      <div class="grid-card">Card {i + 1}</div>
    {/each}
  </div>
</section>

<!-- ── 5. CSS-only transitions ───────────────────────────────────────── -->
<section>
  <h2>5. CSS transitions — no JavaScript</h2>
  <p class="body">
    The browser's own <code>transition</code> property handles hover and focus
    states smoothly. Reserve Svelte's <code>transition:</code> directive for
    enter/exit animations; use plain CSS for continuous interactive states.
  </p>
  <div class="transition-grid">
    <div class="t-card lift">
      <strong>Lift on hover</strong>
      <code>transform: translateY(-4px)</code>
    </div>
    <div class="t-card reveal">
      <strong>Reveal underline</strong>
      <code>width: 0 → 100%</code>
    </div>
    <div class="t-card fill">
      <strong>Fill background</strong>
      <code>background-size: 0 → 100%</code>
    </div>
    <div class="t-card scale">
      <strong>Scale icon</strong>
      <code>transform: scale(1.15)</code>
    </div>
  </div>
</section>

<!-- ── 6. Dark mode ──────────────────────────────────────────────────── -->
<section>
  <h2>6. Dark mode with a data attribute</h2>
  <p class="body">
    Define two sets of custom properties — one default, one under
    <code>[data-theme="dark"]</code>. Toggle the attribute with a single
    <code>$state</code> boolean. Works at any DOM level, not just
    <code>&lt;html&gt;</code>.
  </p>
  <div class="theme-sandbox" data-theme={darkMode ? 'dark' : 'light'}>
    <div class="theme-topbar">
      <span class="theme-brand">My App</span>
      <button class="theme-toggle" onclick={() => (darkMode = !darkMode)}>
        {darkMode ? '☀ Light' : '☾ Dark'}
      </button>
    </div>
    <div class="theme-content">
      <div class="theme-card">
        <h4>Article title</h4>
        <p>Body copy that adapts to the active theme through CSS custom properties alone — no class juggling, no JS style writes.</p>
        <button class="theme-btn">Read more</button>
      </div>
      <div class="theme-card">
        <h4>Another card</h4>
        <p>Both cards inherit the same tokens. Swap the root values and everything updates at once.</p>
        <button class="theme-btn ghost-theme">Dismiss</button>
      </div>
    </div>
  </div>
  <p class="tip">
    For a real app, read <code>prefers-color-scheme</code> on mount and let the
    user override it — the CSS stays identical, only the initial value differs.
  </p>
</section>

<hr class="divider" />
<section class="snippets">
  <h2>Code</h2>
  <CodeBlock file="any .svelte file" lang="svelte" code={snippet1} />
  <CodeBlock file="routes/css/+page.svelte" lang="svelte" code={snippet2} />
  <CodeBlock file="routes/css/+page.svelte" lang="svelte" code={snippet3} />
  <CodeBlock file="routes/css/+page.svelte" lang="svelte" code={snippet4} />
  <CodeBlock file="routes/css/+page.svelte" lang="svelte" code={snippet5} />
</section>

<style>
  .divider { border: none; border-top: 1px solid var(--border); margin: 2rem 0 1.5rem; }
  .snippets h2 { margin: 0 0 0.5rem; font-size: 1.2rem; }
  /* ── page chrome ───────────────────────────────────────────────────────── */
  .lede { color: var(--muted); font-size: 1.05rem; }
  section { margin: 2.25rem 0; }
  h2 { margin: 0 0 0.5rem; font-size: 1.2rem; }
  .body { color: var(--muted); max-width: 62ch; margin: 0 0 0.75rem; }
  .tip {
    margin-top: 0.75rem;
    padding: 0.6rem 0.9rem;
    background: var(--accent-soft);
    border-left: 3px solid var(--accent);
    border-radius: 0 6px 6px 0;
    font-size: 0.88rem;
    color: var(--muted);
    max-width: 62ch;
  }

  /* ── 1. scope demo ─────────────────────────────────────────────────────── */
  .scope-demo { margin: 0.75rem 0; }
  .fake-card {
    display: inline-block;
    padding: 0.6rem 1rem;
    background: var(--accent-soft);
    border: 2px dashed var(--accent);
    border-radius: 8px;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }

  /* ── 2. custom properties ──────────────────────────────────────────────── */
  .prop-sandbox {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1rem 1.25rem;
    margin: 0.75rem 0;
  }
  @media (max-width: 600px) { .prop-sandbox { grid-template-columns: 1fr; } }

  .prop-controls { display: flex; flex-direction: column; gap: 0.75rem; }
  .prop-controls label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.85rem;
    color: var(--muted);
  }
  .prop-controls label { flex-direction: row; align-items: center; flex-wrap: wrap; gap: 0.4rem; }
  .prop-controls span { min-width: 11rem; }
  .prop-controls input[type="color"] { width: 2.2rem; height: 1.8rem; border: none; padding: 0; cursor: pointer; background: none; }
  .prop-controls input[type="range"] { flex: 1; min-width: 80px; }

  .prop-preview { display: flex; flex-direction: column; gap: 0.75rem; justify-content: center; }
  .themed-btn {
    font: inherit;
    cursor: pointer;
    background: var(--demo-accent);
    color: white;
    border: 2px solid var(--demo-accent);
    padding: var(--demo-space) calc(var(--demo-space) * 2);
    border-radius: var(--demo-radius);
    transition: filter 150ms;
  }
  .themed-btn:hover { filter: brightness(1.1); }
  .ghost-themed {
    background: transparent;
    color: var(--demo-accent);
  }
  .themed-card {
    padding: var(--demo-space);
    border: 1px solid var(--demo-accent);
    border-radius: var(--demo-radius);
    font-size: 0.9rem;
  }
  .themed-card p { margin: 0.3rem 0 0; color: var(--muted); font-size: 0.85rem; }

  /* ── 3. dynamic classes ────────────────────────────────────────────────── */
  .class-controls {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin: 0.75rem 0;
  }
  fieldset {
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }
  legend { font-size: 0.85rem; color: var(--muted); padding: 0 0.25rem; }
  .radio { display: flex; align-items: center; gap: 0.3rem; font-size: 0.9rem; cursor: pointer; }

  .class-preview {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    margin: 0.75rem 0;
  }
  .dyn-btn {
    font: inherit;
    cursor: pointer;
    background: var(--accent);
    color: white;
    border: 2px solid var(--accent);
    padding: 0.45rem 1rem;
    border-radius: 6px;
    transition: background 150ms, transform 100ms, box-shadow 150ms, padding 150ms, font-size 150ms;
    user-select: none;
  }
  .dyn-btn:hover { filter: brightness(1.05); }
  .dyn-btn.sm { font-size: 0.8rem; padding: 0.25rem 0.6rem; }
  .dyn-btn.lg { font-size: 1.1rem; padding: 0.65rem 1.4rem; }
  .dyn-btn.outline { background: transparent; color: var(--accent); }
  .dyn-btn.ghost { background: transparent; color: var(--text); border-color: var(--border); }
  .dyn-btn.pressed { transform: scale(0.95); box-shadow: inset 0 2px 4px rgba(0,0,0,0.15); }

  .class-output {
    font-size: 0.82rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.4rem 0.75rem;
    color: var(--muted);
    white-space: pre-wrap;
    word-break: break-all;
  }

  /* ── 4. responsive grid ────────────────────────────────────────────────── */
  .grid-controls {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 0.75rem 0;
    max-width: 360px;
  }
  .grid-controls label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--muted);
  }
  .grid-controls span { min-width: 13rem; }
  .grid-controls input[type="range"] { flex: 1; }

  .auto-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--col-min), 1fr));
    gap: 0.75rem;
    margin: 0.75rem 0;
  }
  .grid-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
    font-size: 0.9rem;
    color: var(--muted);
    transition: border-color 200ms;
  }
  .grid-card:hover { border-color: var(--accent); color: var(--text); }

  /* ── 5. css transitions ────────────────────────────────────────────────── */
  .transition-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
    margin: 0.75rem 0;
  }
  .t-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-size: 0.88rem;
    cursor: default;
  }
  .t-card strong { font-size: 0.95rem; }
  .t-card code { font-size: 0.78rem; color: var(--muted); }

  /* lift */
  .lift { transition: transform 200ms ease, box-shadow 200ms ease; }
  .lift:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(0,0,0,0.08); }

  /* reveal underline */
  .reveal strong {
    display: inline-block;
    background-image: linear-gradient(var(--accent), var(--accent));
    background-size: 0 2px;
    background-repeat: no-repeat;
    background-position: left bottom;
    transition: background-size 250ms ease;
  }
  .reveal:hover strong { background-size: 100% 2px; }

  /* fill background */
  .fill {
    background-image: linear-gradient(var(--accent-soft), var(--accent-soft));
    background-size: 0% 100%;
    background-repeat: no-repeat;
    transition: background-size 300ms ease;
  }
  .fill:hover { background-size: 100% 100%; }

  /* scale */
  .scale strong {
    display: inline-block;
    transition: transform 200ms cubic-bezier(.34,1.56,.64,1);
  }
  .scale:hover strong { transform: scale(1.25); }

  /* ── 6. dark mode ──────────────────────────────────────────────────────── */
  .theme-sandbox {
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    margin: 0.75rem 0;
  }

  /* light defaults */
  .theme-sandbox[data-theme="light"] {
    --t-bg: #f5f3ef;
    --t-surface: #ffffff;
    --t-text: #2a2724;
    --t-muted: #6b655e;
    --t-border: #e2dcd2;
    --t-accent: #c2410c;
    --t-accent-soft: #fde9d9;
    --t-btn-text: white;
  }

  /* dark overrides — same tokens, different values */
  .theme-sandbox[data-theme="dark"] {
    --t-bg: #1a1917;
    --t-surface: #27251f;
    --t-text: #e8e2d9;
    --t-muted: #a09890;
    --t-border: #3a3630;
    --t-accent: #f97316;
    --t-accent-soft: #431407;
    --t-btn-text: white;
  }

  .theme-topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 1rem;
    background: var(--t-surface);
    border-bottom: 1px solid var(--t-border);
  }
  .theme-brand { font-weight: 700; color: var(--t-text); }
  .theme-toggle {
    font: inherit;
    font-size: 0.85rem;
    cursor: pointer;
    background: var(--t-accent-soft);
    color: var(--t-accent);
    border: 1px solid var(--t-border);
    padding: 0.3rem 0.7rem;
    border-radius: 6px;
    transition: background 250ms, color 250ms;
  }
  .theme-toggle:hover { filter: brightness(1.05); }

  .theme-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    padding: 1rem;
    background: var(--t-bg);
    transition: background 250ms, color 250ms;
  }
  .theme-card {
    background: var(--t-surface);
    border: 1px solid var(--t-border);
    border-radius: 8px;
    padding: 1rem;
    transition: background 250ms, border-color 250ms;
  }
  .theme-card h4 { margin: 0 0 0.4rem; color: var(--t-text); font-size: 1rem; }
  .theme-card p { margin: 0 0 0.75rem; color: var(--t-muted); font-size: 0.88rem; }
  .theme-btn {
    font: inherit;
    font-size: 0.85rem;
    cursor: pointer;
    background: var(--t-accent);
    color: var(--t-btn-text);
    border: 1px solid var(--t-accent);
    padding: 0.35rem 0.8rem;
    border-radius: 6px;
    transition: background 250ms, border-color 250ms, filter 150ms;
  }
  .theme-btn:hover { filter: brightness(1.08); }
  .ghost-theme {
    background: transparent;
    color: var(--t-muted);
    border-color: var(--t-border);
  }
</style>
