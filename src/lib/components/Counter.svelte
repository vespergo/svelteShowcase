<script lang="ts">
  let {
    label = 'Counter',
    step = 1,
    value = $bindable(0)
  }: { label?: string; step?: number; value?: number } = $props();
</script>

<div class="counter">
  <span class="label">{label}</span>
  <button class="ghost" onclick={() => (value -= step)} aria-label="decrement">−</button>
  <strong>{value}</strong>
  <button class="ghost" onclick={() => (value += step)} aria-label="increment">+</button>
</div>

<style>
  .counter {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
  }
  .label { color: var(--muted); font-size: 0.9rem; }
  strong { min-width: 2ch; text-align: center; }
</style>
