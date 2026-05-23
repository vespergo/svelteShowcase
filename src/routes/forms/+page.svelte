<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const snippet1 = `
// Each field is its own $state variable.
// \`touched\` tracks whether the user has left each field,
// so errors only appear after first interaction.
let name     = $state('');
let email    = $state('');
let password = $state('');
let touched  = $state({ name: false, email: false, password: false });
  `;

  const snippet2 = `
// Validation is pure $derived — no imperative updates, no watchers.
// These recompute the instant the field values change.
const nameError = $derived(
  name.trim().length === 0   ? 'Required' :
  name.trim().length < 2     ? 'At least 2 characters' : ''
);
const emailError = $derived(
  email.length === 0                              ? 'Required' :
  !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)  ? 'Invalid email' : ''
);
const valid = $derived(!nameError && !emailError && !passwordError);
  `;

  const snippet3 = `
<!-- onblur flips the touched flag so errors appear only after leaving the field -->
<input
  bind:value={name}
  onblur={() => (touched.name = true)}
  class:error={touched.name && nameError}
/>
{#if touched.name && nameError}
  <span class="error-text">{nameError}</span>
{/if}

<!-- Submit is blocked until every $derived error is empty -->
<button type="submit" disabled={!valid}>Create account</button>
  `;

  let name = $state('');
  let email = $state('');
  let password = $state('');
  let touched = $state({ name: false, email: false, password: false });
  let submitted = $state(false);

  const nameError = $derived(
    name.trim().length === 0
      ? 'Required'
      : name.trim().length < 2
        ? 'At least 2 characters'
        : ''
  );
  const emailError = $derived(
    email.length === 0
      ? 'Required'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? 'Invalid email address'
        : ''
  );
  const passwordError = $derived(
    password.length === 0
      ? 'Required'
      : password.length < 8
        ? 'At least 8 characters'
        : ''
  );

  const strength = $derived(
    password.length === 0 ? 0
    : password.length < 8 ? 1
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 3
    : 2
  );

  const valid = $derived(!nameError && !emailError && !passwordError);

  function submit(e: Event) {
    e.preventDefault();
    touched = { name: true, email: true, password: true };
    if (valid) submitted = true;
  }

  function reset() {
    name = ''; email = ''; password = '';
    touched = { name: false, email: false, password: false };
    submitted = false;
  }
</script>

<h1>Forms &amp; Validation</h1>
<p class="lede">
  This page builds a sign-up form to show how Svelte 5 turns validation into
  declarative state instead of a tangle of event handlers. Each field is a
  <code>$state</code> variable; each error message is a <code>$derived</code>
  expression that recomputes the moment the input changes. A <code>touched</code>
  record keeps errors quiet until the user has actually visited a field, and the
  submit button stays disabled until every derived error is empty. The result
  is a fully reactive form with no manual subscriptions, watchers, or validation
  library.
</p>

{#if submitted}
  <div class="success">
    <strong>Submitted!</strong> Name: {name}, Email: {email}
    <button class="ghost" onclick={reset}>Reset</button>
  </div>
{:else}
  <form onsubmit={submit} novalidate>
    <div class="field">
      <label for="name">Name</label>
      <input
        id="name"
        bind:value={name}
        onblur={() => (touched.name = true)}
        class:error={touched.name && nameError}
        placeholder="Ada Lovelace"
      />
      {#if touched.name && nameError}
        <span class="hint error-text">{nameError}</span>
      {:else if name.trim().length >= 2}
        <span class="hint ok-text">Looks good</span>
      {/if}
    </div>

    <div class="field">
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        bind:value={email}
        onblur={() => (touched.email = true)}
        class:error={touched.email && emailError}
        placeholder="ada@example.com"
      />
      {#if touched.email && emailError}
        <span class="hint error-text">{emailError}</span>
      {:else if email && !emailError}
        <span class="hint ok-text">Valid email</span>
      {/if}
    </div>

    <div class="field">
      <label for="pw">Password</label>
      <input
        id="pw"
        type="password"
        bind:value={password}
        onblur={() => (touched.password = true)}
        class:error={touched.password && passwordError}
        placeholder="········"
      />
      {#if password.length > 0}
        <div class="strength-bar">
          <div class="bar s{strength}"></div>
        </div>
        <span class="hint" class:error-text={strength < 2} class:ok-text={strength === 3}>
          {['', 'Too short', 'Moderate', 'Strong'][strength]}
        </span>
      {:else if touched.password && passwordError}
        <span class="hint error-text">{passwordError}</span>
      {/if}
    </div>

    <div class="row">
      <button type="submit" disabled={!valid && (touched.name || touched.email || touched.password)}>
        Create account
      </button>
      <span class="status">
        {#if valid}All fields valid — ready to submit.{:else}Fill in the form above.{/if}
      </span>
    </div>
  </form>
{/if}

<section class="explainer">
  <h3>How it works</h3>
  <dl>
    <dt><code>$state</code></dt>
    <dd>Tracks each field value and the <code>touched</code> record.</dd>
    <dt><code>$derived</code></dt>
    <dd>Computes <code>nameError</code>, <code>emailError</code>, <code>passwordError</code>, and <code>valid</code> — synchronously, no manual updates.</dd>
    <dt><code>onblur</code></dt>
    <dd>Flips a touched flag so errors only show after the user leaves a field.</dd>
  </dl>
</section>

<hr class="divider" />
<section class="snippets">
  <h2>Code</h2>
  <CodeBlock file="routes/forms/+page.svelte" lang="ts" code={snippet1} />
  <CodeBlock file="routes/forms/+page.svelte" lang="ts" code={snippet2} />
  <CodeBlock file="routes/forms/+page.svelte" lang="svelte" code={snippet3} />
</section>

<style>
  .divider { border: none; border-top: 1px solid var(--border); margin: 2rem 0 1.5rem; }
  .snippets h2 { margin: 0 0 0.5rem; font-size: 1.2rem; }
  .lede { color: var(--muted); }
  form { display: flex; flex-direction: column; gap: 1rem; max-width: 360px; margin: 1.25rem 0; }
  .field { display: flex; flex-direction: column; gap: 0.25rem; }
  label { font-size: 0.9rem; font-weight: 600; }
  input.error { border-color: #dc2626; outline-color: #dc2626; }
  .hint { font-size: 0.82rem; }
  .error-text { color: #dc2626; }
  .ok-text { color: #16a34a; }

  .strength-bar {
    height: 4px;
    background: var(--border);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 0.25rem;
  }
  .bar { height: 100%; border-radius: 2px; transition: width 200ms, background 200ms; }
  .bar.s0 { width: 0; }
  .bar.s1 { width: 33%; background: #dc2626; }
  .bar.s2 { width: 66%; background: #f59e0b; }
  .bar.s3 { width: 100%; background: #16a34a; }

  .row { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
  .status { font-size: 0.85rem; color: var(--muted); }
  button:disabled { opacity: 0.4; cursor: not-allowed; filter: none; }

  .success {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: #dcfce7;
    border: 1px solid #86efac;
    border-radius: 8px;
    margin: 1rem 0;
    color: #166534;
  }

  .explainer {
    margin-top: 2rem;
    padding: 1rem 1.25rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
  }
  .explainer h3 { margin: 0 0 0.75rem; }
  dl {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 0.4rem 1rem;
    margin: 0;
  }
  dt { color: var(--muted); }
  dd { margin: 0; }
</style>
