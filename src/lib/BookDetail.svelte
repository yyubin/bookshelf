<script>
  export let book;
  import StatusBadge from './StatusBadge.svelte';
  import TagBadge from './TagBadge.svelte';
  import StarRating from './StarRating.svelte';

  function goBack() {
    window.history.back();
  }
</script>

<div class="mx-auto max-w-5xl">
  <button
    class="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800"
    on:click={goBack}
    type="button"
  >
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M19 12H5m7-7l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    뒤로가기
  </button>

  <div class="bg-white rounded-2xl ring-1 ring-slate-200 overflow-hidden">
    <div class="grid md:grid-cols-2">
      <div class="relative">
        <img src={book.image} alt={book.title} class="h-full w-full object-cover max-h-[520px]" />
        <div class="absolute top-4 left-4">
          <StatusBadge status={book.status} />
        </div>
      </div>

      <div class="p-6 sm:p-8 space-y-4">
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">{book.title}</h1>
        <p class="text-slate-600">{book.author}</p>
        <StarRating value={book.rating ?? 0} />

        <div class="flex flex-wrap gap-2">
          {#each book.tags ?? [] as t}
            <TagBadge label={t} />
          {/each}
        </div>

        <div class="space-y-3 pt-3 border-t border-slate-100">
          <div>
            <h2 class="text-base font-semibold text-slate-900/90">감상평</h2>
            {#if book.review?.trim()?.length}
              <p class="text-slate-700 leading-relaxed">{book.review}</p>
            {:else}
              <p class="italic text-slate-500">아직 감상평이 없습니다.</p>
            {/if}
          </div>

          <div>
            <h2 class="text-base font-semibold text-slate-900/90">선정 이유</h2>
            <p class="text-slate-700 leading-relaxed">{book.reason}</p>
          </div>

          <div>
            <h2 class="text-base font-semibold text-slate-900/90">날짜</h2>
            <p class="text-slate-700 leading-relaxed">{book.date}</p>
          </div>

          {#if book.reviewLink}
            <div class="pt-3 border-t border-slate-100">
                <h2 class="text-base font-semibold text-slate-900/90">추가 서평</h2>
                <a
                class="mt-2 inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800
                        underline underline-offset-4 decoration-blue-300"
                href={book.reviewLink}
                target="_blank"
                rel="noopener noreferrer"
                >
                {book.reviewSite || '외부 링크로 보기'}
                <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                </a>
            </div>
            {/if}

        </div>
      </div>
    </div>
  </div>
</div>
