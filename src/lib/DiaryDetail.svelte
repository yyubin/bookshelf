<script>
  import { onMount } from 'svelte';
  import { marked } from 'marked';
  import TagBadge from './TagBadge.svelte';

  export let id;
  let entry = null;
  let prevEntry = null;
  let nextEntry = null;

  async function loadEntry(currentId) {
    const res = await fetch('./diary.json');
    const entries = await res.json();

    const currentIndex = entries.findIndex(e => e.id === currentId);

    if (currentIndex === -1) {
      entry = null;
      prevEntry = null;
      nextEntry = null;
      return;
    }

    const currentEntry = entries[currentIndex];

    // mdFile 필드가 있으면 해당 파일을 fetch하여 content로 설정
    if (currentEntry.mdFile) {
      try {
        const mdRes = await fetch(currentEntry.mdFile);
        const mdContent = await mdRes.text();
        entry = { ...currentEntry, content: mdContent };
      } catch (error) {
        console.error('Failed to load markdown file:', error);
        entry = { ...currentEntry, content: '마크다운 파일을 불러오는데 실패했습니다.' };
      }
    } else {
      entry = currentEntry;
    }

    prevEntry = currentIndex > 0 ? entries[currentIndex - 1] : null;
    nextEntry = currentIndex < entries.length - 1 ? entries[currentIndex + 1] : null;
  }

  // id prop이 변경될 때마다 함수를 다시 호출합니다.
  $: loadEntry(id);

</script>

<style>
  .prose-content {
    color: rgb(31 41 55);
    line-height: 1.625;
  }

  .prose-content :global(h1) {
    font-size: 1.875rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    margin-top: 2rem;
    color: rgb(17 24 39);
  }

  .prose-content :global(h1:first-child) {
    margin-top: 0;
  }

  .prose-content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    margin-top: 1.5rem;
    color: rgb(17 24 39);
  }

  .prose-content :global(h3) {
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
    margin-top: 1.25rem;
    color: rgb(17 24 39);
  }

  .prose-content :global(p) {
    margin-bottom: 1rem;
    font-size: 1rem;
    line-height: 1.75;
  }

  .prose-content :global(ul) {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
    list-style-type: disc;
  }

  .prose-content :global(ol) {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
    list-style-type: decimal;
  }

  .prose-content :global(li) {
    margin-bottom: 0.25rem;
  }

  .prose-content :global(blockquote) {
    border-left: 4px solid rgb(165 180 252);
    padding-left: 1rem;
    font-style: italic;
    color: rgb(55 65 81);
    margin-bottom: 1rem;
  }

  .prose-content :global(pre) {
    background-color: rgb(243 244 246);
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
    overflow-x: auto;
    font-size: 0.875rem;
  }

  .prose-content :global(code) {
    background-color: rgb(243 244 246);
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Inconsolata, "Liberation Mono", "Consolas", monospace;
  }

  .prose-content :global(pre code) {
    background-color: transparent;
    padding: 0;
  }

  .prose-content :global(a) {
    color: rgb(79 70 229);
    text-decoration: underline;
  }

  .prose-content :global(a:hover) {
    color: rgb(67 56 202);
  }

  .prose-content :global(strong) {
    font-weight: 600;
  }

  .prose-content :global(em) {
    font-style: italic;
  }
</style>

<article class="bg-white rounded-2xl shadow-xl p-8 sm:p-12 mx-auto max-w-4xl">
  {#if entry}
    <header class="mb-8 text-center">
      <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">{entry.title}</h1>
      <p class="mt-4 text-base text-gray-500">{entry.subtitle}</p>
      <p class="mt-4 text-base text-gray-500">{entry.date}</p>
      {#if entry.tags && entry.tags.length > 0}
        <div class="mt-4 flex justify-center gap-2">
          {#each entry.tags as tag}
            <TagBadge label={tag} />
          {/each}
        </div>
      {/if}
    </header>
    <div class="prose-content max-w-none">
      {@html marked(entry.content)}
    </div>
    <div class="mt-12 flex justify-between items-center">
      {#if prevEntry}
        <a href={`#/diary/${prevEntry.id}`} class="text-indigo-600 hover:text-indigo-800 font-medium">
          &larr; 이전 글
        </a>
      {:else}
        <div />
      {/if}
      
      <a href="#diary" class="text-gray-600 hover:text-gray-800 font-medium">
        목록
      </a>

      {#if nextEntry}
        <a href={`#/diary/${nextEntry.id}`} class="text-indigo-600 hover:text-indigo-800 font-medium">
          다음 글 &rarr;
        </a>
      {:else}
        <div />
      {/if}
    </div>
  {:else}
    <p>비하인드 스토리를 불러오는 중...</p>
  {/if}
</article>
