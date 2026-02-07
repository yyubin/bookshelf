<script>
  export let book;
  import StatusBadge from './StatusBadge.svelte';
  import TagBadge from './TagBadge.svelte';
  import StarRating from './StarRating.svelte';
  import { marked } from 'marked';

  const mdFiles = import.meta.glob('./reviews/*.md', { as: 'raw' });
  const mdIndex = new Map(
    Object.entries(mdFiles).map(([path, loader]) => [path.split('/').pop(), loader])
  );
  let mdHtml = '';
  let mdLoading = false;
  let mdError = '';
  let loadSeq = 0;

  marked.setOptions({ breaks: true });

  async function loadMarkdown(name) {
    const seq = ++loadSeq;
    mdLoading = true;
    mdError = '';

    const loader = mdIndex.get(name);
    if (!loader) {
      mdHtml = '';
      mdError = '감상평 파일을 찾지 못했습니다.';
      mdLoading = false;
      return;
    }

    try {
      const raw = await loader();
      if (seq !== loadSeq) return;
      mdHtml = marked.parse(raw);
    } catch (err) {
      if (seq !== loadSeq) return;
      mdHtml = '';
      mdError = '감상평을 불러오는 데 실패했습니다.';
    } finally {
      if (seq === loadSeq) mdLoading = false;
    }
  }

  $: if (book?.reviewMd) {
    loadMarkdown(book.reviewMd);
  } else {
    mdHtml = '';
    mdLoading = false;
    mdError = '';
  }

  function goBack() {
    window.history.back();
  }
</script>

<div class="mx-auto max-w-5xl">
  <button
    class="mb-6 inline-flex items-center gap-2 text-sm font-medium text-indigo-700 hover:text-indigo-900 transition"
    on:click={goBack}
    type="button"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7"/>
    </svg>
    뒤로가기
  </button>

  <div class="bg-white rounded-2xl ring-1 ring-gray-200 overflow-hidden shadow-lg">
    <div class="grid md:grid-cols-[300px_1fr] lg:grid-cols-[320px_1fr] gap-4">
      <div class="relative min-h-[400px] max-h-[500px]">
        <img src={book.image} alt={book.title} class="h-full w-full object-cover rounded-l-2xl" />
        <div class="absolute top-4 left-4">
          <StatusBadge status={book.status} />
        </div>
      </div>

      <div class="p-6 sm:p-8 space-y-5 flex flex-col">
        <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{book.title}</h1>
            <p class="mt-1 text-base text-gray-600 font-medium">{book.author}</p>
        </div>
        <StarRating value={book.rating ?? 0} />

        <div class="flex flex-wrap gap-2">
          {#each book.tags ?? [] as t}
            <TagBadge label={t} />
          {/each}
        </div>

        <div class="space-y-4 pt-4 border-t border-gray-100 flex-1">
          <div>
            <h2 class="text-base font-semibold text-gray-900">감상평</h2>
            {#if book.reviewMd}
              {#if mdLoading}
                <p class="mt-1 text-gray-500">감상평을 불러오는 중...</p>
              {:else if mdHtml?.trim()?.length}
                <div class="markdown-body mt-2">{@html mdHtml}</div>
              {:else if book.review?.trim()?.length}
                <p class="mt-1 text-gray-700 leading-relaxed">{book.review}</p>
              {:else if mdError}
                <p class="mt-1 text-rose-600">{mdError}</p>
              {:else}
                <p class="mt-1 italic text-gray-500">아직 감상평이 없습니다.</p>
              {/if}
            {:else if book.review?.trim()?.length}
              <p class="mt-1 text-gray-700 leading-relaxed">{book.review}</p>
            {:else}
              <p class="mt-1 italic text-gray-500">아직 감상평이 없습니다.</p>
            {/if}
          </div>

          <div>
            <h2 class="text-base font-semibold text-gray-900">메모</h2>
            {#if (book.memos ?? []).length}
              <ul class="mt-2 space-y-1 text-gray-700 list-disc list-inside">
                {#each book.memos as memo}
                  <li>{memo}</li>
                {/each}
              </ul>
            {:else}
              <p class="mt-1 italic text-gray-500">아직 메모가 없습니다.</p>
            {/if}
          </div>

          <div>
            <h2 class="text-base font-semibold text-gray-900">선정 이유</h2>
            <p class="mt-1 text-gray-700 leading-relaxed">{book.reason}</p>
          </div>

          <div>
            <h2 class="text-base font-semibold text-gray-900">날짜</h2>
            <p class="mt-1 text-gray-700 leading-relaxed">{book.date}</p>
          </div>
        </div>
        
        {#if book.reviewLink}
            <div class="pt-4 border-t border-gray-100">
                <a
                class="inline-flex items-center gap-2 text-sm font-medium text-indigo-700 hover:text-indigo-900 transition
                        underline underline-offset-4 decoration-indigo-300"
                href={book.reviewLink}
                target="_blank"
                rel="noopener noreferrer"
                >
                {book.reviewSite || '외부 링크로 보기'}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M7 17L17 7M9 7h8v8" />
                </svg>
                </a>
            </div>
        {/if}

      </div>
    </div>
  </div>
</div>
