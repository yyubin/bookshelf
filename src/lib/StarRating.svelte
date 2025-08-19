<script>
  export let value = 0;
  const MAX = 5;
  $: full = Math.max(0, Math.min(MAX, Math.floor(value)));
  $: empty = MAX - full;
</script>

<div class="flex items-center gap-1" aria-label={`평점 ${value} / 5`}>
  {#each Array(full) as _, i}
    <svg key={'f'+i} width="16" height="16" viewBox="0 0 24 24" class="fill-blue-500">
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z"/>
    </svg>
  {/each}
  {#each Array(empty) as _, i}
    <svg key={'e'+i} width="16" height="16" viewBox="0 0 24 24" class="fill-slate-300">
      <path d="M22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24Zm-10 6.11V5.12l1.65 3.51 3.87.33-2.93 2.54.9 3.84L12 15.35l-3.49 2 .9-3.84-2.93-2.54 3.87-.33L12 5.12v10.23Z"/>
    </svg>
  {/each}

  <span class="text-xs text-slate-600 ml-1">{value}/5</span>
</div>
