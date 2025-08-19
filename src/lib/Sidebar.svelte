<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let books = [];
  export let currentView;
  export let selectedTag = null;

  // 태그 개수 집계
  $: tagCounts = books.reduce((acc, b) => {
    (b.tags ?? []).forEach(t => acc[t] = (acc[t] ?? 0) + 1);
    return acc;
  }, {});
  // 정렬: 개수 내림차순 → 이름 오름차순
  $: tags = Object.entries(tagCounts)
    .sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0]));

  function selectView(view, tag = null) {
    dispatch('navClick', { view, tag });
  }
</script>

<aside class="w-72 shrink-0 bg-gradient-to-b from-gray-600 to-gray-700 text-white p-6 sticky top-0 h-screen">
  <div class="mb-8">
    <div class="flex items-center gap-3">
      <div class="h-10 w-10 rounded-xl bg-white/15 backdrop-blur ring-1 ring-white/20 grid place-items-center">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" class="text-white">
          <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5Z" stroke="currentColor" stroke-width="1.6"/>
          <path d="M8 5h8" stroke="currentColor" stroke-width="1.6" />
        </svg>
      </div>
      <h1 class="text-lg font-semibold tracking-tight">비카이브</h1>
    </div>
    <p class="mt-2 text-white/80 text-sm leading-relaxed">
      2024년 후반 부터의 독서 기록을 아카이빙 합니다.
    </p>
  </div>
  
  <div class="mb-6">
    <button
      class="w-full flex items-center justify-between px-3 py-2 rounded-lg transition
             hover:bg-white/10 hover:ring-1 hover:ring-white/20
             {currentView === 'about' ? 'bg-white/20 ring-1 ring-white/30' : ''}"
      on:click={() => selectView('about')}
      aria-current={currentView === 'about' ? 'page' : undefined}
    >
      <span class="font-medium">이 사이트에 관해</span>
      <span></span>
    </button>
  </div>

  <div class="mb-2">
    <button
      class="w-full flex items-center justify-between px-3 py-2 rounded-lg transition
             hover:bg-white/10 hover:ring-1 hover:ring-white/20
             {currentView === 'list' && selectedTag === null ? 'bg-white/20 ring-1 ring-white/30' : ''}"
      on:click={() => selectView('list')}
      aria-current={currentView === 'list' && selectedTag === null ? 'page' : undefined}
    >
      <span class="font-medium">전체</span>
      <span class="text-xs px-2 py-0.5 rounded-full bg-white/20">{books.length}</span>
    </button>
  </div>

  <nav class="space-y-1 overflow-auto pr-1" style="max-height: calc(100vh - 260px);">
    {#if tags.length === 0}
      <div class="text-white/70 text-sm px-1">태그가 없습니다.</div>
    {:else}
      {#each tags as [tag, count]}
        <button
          class="w-full flex items-center justify-between px-3 py-2 rounded-lg transition
                 hover:bg-white/10 hover:ring-1 hover:ring-white/20
                 {currentView === 'list' && selectedTag === tag ? 'bg-white/20 ring-1 ring-white/30' : ''}"
          on:click={() => selectView('list', tag)}
          aria-current={currentView === 'list' && selectedTag === tag ? 'page' : undefined}
        >
          <span class="font-medium truncate">{tag}</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-white/20">{count}</span>
        </button>
      {/each}
    {/if}
  </nav>

  <div class="absolute bottom-6 left-6 right-6">
    <div class="rounded-xl bg-white/10 p-4 ring-1 ring-white/20">
      <p class="text-sm text-white/85">
        태그를 클릭하면 해당 태그가 포함된 책만 보여줍니다.
      </p>
    </div>
  </div>
</aside>