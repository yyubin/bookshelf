<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let books = [];
  export let currentView;
  export let selectedTag = null;

  $: tagCounts = books.reduce((acc, b) => {
    (b.tags ?? []).forEach(t => acc[t] = (acc[t] ?? 0) + 1);
    return acc;
  }, {});
  $: tags = Object.entries(tagCounts)
    .sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0]));

  function selectView(view, tag = null) {
    dispatch('navClick', { view, tag });
  }
</script>

<aside class="w-72 shrink-0 bg-gray-800 text-gray-200 p-6 sticky top-0 h-screen overflow-y-auto font-sans">
  <div class="mb-8">
    <div class="flex items-center gap-3">
      <div class="h-10 w-10 rounded-xl bg-gray-700 grid place-items-center flex-none">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" class="text-indigo-400">
          <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5Z" stroke="currentColor" stroke-width="1.6"/>
          <path d="M8 5h8" stroke="currentColor" stroke-width="1.6" />
        </svg>
      </div>
      <h1 class="text-xl font-bold tracking-tight text-gray-50">비카이브</h1>
    </div>
    <p class="mt-2 text-gray-400 text-sm leading-relaxed">
      2024년 후반부터의 독서 기록을 아카이빙 합니다.
    </p>
  </div>
  
  <div class="space-y-2 mb-6">
    <button
      class="w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors duration-200
             hover:bg-gray-700
             {currentView === 'about' ? 'bg-indigo-600 text-white' : ''}"
      on:click={() => selectView('about')}
      aria-current={currentView === 'about' ? 'page' : undefined}
    >
      <span class="font-medium">이 사이트에 관해</span>
      {#if currentView === 'about'}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
      {/if}
    </button>
  </div>

  <div class="space-y-2 mb-6">
    <button
      class="w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors duration-200
            hover:bg-gray-700
            {currentView === 'readingGarden' ? 'bg-indigo-600 text-white' : ''}"
      on:click={() => selectView('readingGarden')}
      aria-current={currentView === 'readingGarden' ? 'page' : undefined}
    >
      <span class="font-medium">독서 잔디</span>
      {#if currentView === 'readingGarden'}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
      {/if}
    </button>
  </div>

  <div class="mb-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
    <h2 class="px-2">독서 목록</h2>
  </div>

  <div class="space-y-2 pb-2">
    <button
      class="w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors duration-200
             hover:bg-gray-700
             {currentView === 'list' && selectedTag === null ? 'bg-indigo-600 text-white' : ''}"
      on:click={() => selectView('list')}
      aria-current={currentView === 'list' && selectedTag === null ? 'page' : undefined}
    >
      <span class="font-medium">전체</span>
      <span class="text-xs px-2 py-0.5 rounded-full {currentView === 'list' && selectedTag === null ? 'bg-white/30 text-white' : 'bg-gray-700 text-gray-400'}">{books.length}</span>
    </button>
  </div>

  <nav class="space-y-2 mb-6">
    {#if tags.length === 0}
      <div class="text-gray-500 text-sm px-4">태그가 없습니다.</div>
    {:else}
      {#each tags as [tag, count]}
        <button
          class="w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors duration-200
                 hover:bg-gray-700
                 {currentView === 'list' && selectedTag === tag ? 'bg-indigo-600 text-white' : ''}"
          on:click={() => selectView('list', tag)}
          aria-current={currentView === 'list' && selectedTag === tag ? 'page' : undefined}
        >
          <span class="font-medium truncate">{tag}</span>
          <span class="text-xs px-2 py-0.5 rounded-full {currentView === 'list' && selectedTag === tag ? 'bg-white/30 text-white' : 'bg-gray-700 text-gray-400'}">{count}</span>
        </button>
      {/each}
    {/if}
  </nav>

  <div class="mt-auto pt-6">
    <p class="text-xs text-gray-500 text-center">
      태그를 클릭하여 관련 책만 볼 수 있습니다.
    </p>
  </div>
</aside>