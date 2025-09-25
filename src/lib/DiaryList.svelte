<script>
  import { onMount } from 'svelte';
  import TagBadge from './TagBadge.svelte';

  let allEntries = [];
  let diaryEntries = [];
  let q = '';
  let selectedTag = null;

  onMount(async () => {
    const res = await fetch('./diary.json');
    allEntries = await res.json();
    diaryEntries = allEntries;
  });

  $: tags = [...new Set(allEntries.flatMap(e => e.tags || []))].sort();

  $: (() => {
    let filtered = allEntries;

    if (selectedTag) {
      filtered = filtered.filter(e => (e.tags || []).includes(selectedTag));
    }

    if (q.trim()) {
      const lowerQuery = q.trim().toLowerCase();
      filtered = filtered.filter(e => 
        (e.title?.toLowerCase() || '').includes(lowerQuery) ||
        (e.subtitle?.toLowerCase() || '').includes(lowerQuery) ||
        (e.content?.toLowerCase() || '').includes(lowerQuery)
      );
    }

    diaryEntries = filtered;
  })();

  function selectTag(tag) {
    if (selectedTag === tag) {
      selectedTag = null; // Toggle off
    } else {
      selectedTag = tag;
    }
  }
</script>

<section class="mx-auto max-w-7xl">
  <div class="mb-8 rounded-2xl bg-gray-800 text-white p-8 ring-1 ring-gray-700 shadow-lg">
    <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">비하인드</h1>
    <p class="mt-2 text-gray-400 text-base">
      원초아가 하는 말들
    </p>
    <div class="mt-6 relative">
      <input
        type="search"
        placeholder="제목, 내용, 태그로 검색"
        bind:value={q}
        class="w-full sm:w-[36rem] rounded-xl bg-gray-700/80 text-gray-200 placeholder-gray-400
               ring-1 ring-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none px-4 py-3 transition-colors"
      />
    </div>
  </div>

  {#if tags.length > 0}
    <div class="mb-6 flex flex-wrap items-center gap-2">
      <span class="font-medium text-gray-700 mr-2">태그:</span>
      <button 
        on:click={() => selectTag(null)}
        class="px-3 py-1 text-sm rounded-full transition-colors "
        class:bg-indigo-600={!selectedTag}
        class:text-white={!selectedTag}
        class:bg-gray-200={selectedTag}
        class:text-gray-700={selectedTag}
      >
        전체
      </button>
      {#each tags as tag}
        <button 
          on:click={() => selectTag(tag)}
          class="px-3 py-1 text-sm rounded-full transition-colors"
          class:bg-indigo-600={selectedTag === tag}
          class:text-white={selectedTag === tag}
          class:bg-gray-200={selectedTag !== tag}
          class:text-gray-700={selectedTag !== tag}
        >
          {tag}
        </button>
      {/each}
    </div>
  {/if}

  <div class="space-y-6">
    {#each diaryEntries as entry (entry.id)}
      <a href={`#/diary/${entry.id}`} class="block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
        <h2 class="text-2xl font-bold text-gray-800">{entry.title}</h2>
        <p class="text-md text-gray-600 mt-1">{entry.subtitle}</p>
        <div class="flex items-center justify-between mt-4">
          <p class="text-sm text-gray-500">{entry.date}</p>
          {#if entry.tags && entry.tags.length > 0}
            <div class="flex gap-2">
              {#each entry.tags as tag}
                <TagBadge label = {tag} />
              {/each}
            </div>
          {/if}
        </div>
      </a>
    {:else}
      <div class="text-center py-12">
        <p class="text-gray-500">표시할 비하인드가 없습니다.</p>
      </div>
    {/each}
  </div>
</section>