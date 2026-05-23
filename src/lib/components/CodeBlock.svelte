<script lang="ts">
  let {
    code,
    file = '',
    lang = ''
  }: { code: string; file?: string; lang?: string } = $props();

  let copied = $state(false);

  async function copy() {
    await navigator.clipboard.writeText(code.trim());
    copied = true;
    setTimeout(() => (copied = false), 1800);
  }
</script>

<div class="code-block">
  <div class="code-header">
    <span class="meta">
      {#if file}<span class="filename">{file}</span>{/if}
      {#if lang}<span class="lang">{lang}</span>{/if}
    </span>
    <button class="copy" onclick={copy} aria-label="Copy code">
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  </div>
  <pre><code>{code.trim()}</code></pre>
</div>

<style>
  .code-block {
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #3a3630;
    margin: 0.75rem 0;
    font-size: 0.85rem;
  }
  .code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.4rem 0.9rem;
    background: #27251f;
    border-bottom: 1px solid #3a3630;
  }
  .meta { display: flex; gap: 0.5rem; align-items: center; }
  .filename {
    color: #a09890;
    font-family: ui-monospace, Menlo, Consolas, monospace;
    font-size: 0.82rem;
  }
  .lang {
    font-size: 0.75rem;
    color: #6b655e;
    background: #1a1917;
    border: 1px solid #3a3630;
    border-radius: 4px;
    padding: 0.1rem 0.4rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .copy {
    font: inherit;
    font-size: 0.78rem;
    cursor: pointer;
    background: transparent;
    color: #a09890;
    border: 1px solid #3a3630;
    border-radius: 5px;
    padding: 0.2rem 0.55rem;
    transition: color 150ms, border-color 150ms;
  }
  .copy:hover { color: #e8e2d9; border-color: #6b655e; filter: none; }

  pre {
    margin: 0;
    padding: 1rem 1.1rem;
    background: #1a1917;
    color: #e8e2d9;
    overflow-x: auto;
    border-radius: 0;
    /* override app.css */
    font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  }
  code {
    background: none;
    padding: 0;
    border-radius: 0;
    color: inherit;
    font-size: inherit;
  }
</style>
