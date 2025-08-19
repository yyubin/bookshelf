<script>
  export let books = [];
  export let viewTitle = '목록';
  import StatusBadge from './StatusBadge.svelte';
  import TagBadge from './TagBadge.svelte';
  import StarRating from './StarRating.svelte';

  function goDetail(id) {
    window.location.hash = `#/book/${id}`;
  }

  let filterStatus = 'all';
  // 정렬 기준을 저장할 변수 (기본값: dateDesc - 최신순)
  let sortOrder = 'dateDesc'; 

  // 필터링 및 정렬된 책 목록을 계산하는 반응형 변수
  $: filteredAndSortedBooks = books
    .filter(book => {
      if (filterStatus === 'all') {
        return true;
      }
      return book.status === filterStatus;
    })
    .sort((a, b) => {
      if (sortOrder === 'dateDesc') {
        // 날짜 내림차순 (최신순) 정렬
        return new Date(b.date) - new Date(a.date);
      }
      if (sortOrder === 'dateAsc') {
        // 날짜 오름차순 (오래된 순) 정렬
        return new Date(a.date) - new Date(b.date);
      }
      // 기본 랜덤 정렬 (sortOrder === 'random'일 경우)
      return Math.random() - 0.5;
    });

  function setFilter(status) {
    filterStatus = status;
  }

  // 정렬 기준을 변경하는 함수
  function setSortOrder(order) {
    sortOrder = order;
  }

  const buttonClass = 'px-4 py-2 rounded-full text-sm font-medium transition';
  const activeClass = 'bg-blue-600 text-white shadow-md';
  const inactiveClass = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
</script>

<section class="mx-auto max-w-7xl">
  <header class="mb-8">
    <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
      {viewTitle}
      <span class="ml-2 align-middle text-sm text-blue-600">{filteredAndSortedBooks.length}권</span>
    </h2>

    <div class="mt-4 flex gap-2">
      <button
        class="{buttonClass} {filterStatus === 'all' ? activeClass : inactiveClass}"
        on:click={() => setFilter('all')}
      >
        전체
      </button>
      <button
        class="{buttonClass} {filterStatus === 'read' ? activeClass : inactiveClass}"
        on:click={() => setFilter('read')}
      >
        완독
      </button>
      <button
        class="{buttonClass} {filterStatus === 'reading' ? activeClass : inactiveClass}"
        on:click={() => setFilter('reading')}
      >
        읽는중
      </button>
      <button
        class="{buttonClass} {filterStatus === 'to-read' ? activeClass : inactiveClass}"
        on:click={() => setFilter('to-read')}
      >
        읽을 예정
      </button>
    </div>

    <div class="mt-4 flex gap-2">
      <span class="text-sm font-medium text-slate-500 self-center">정렬:</span>
      <button
        class="{buttonClass} {sortOrder === 'dateDesc' ? activeClass : inactiveClass}"
        on:click={() => setSortOrder('dateDesc')}
      >
        최신순
      </button>
      <button
        class="{buttonClass} {sortOrder === 'dateAsc' ? activeClass : inactiveClass}"
        on:click={() => setSortOrder('dateAsc')}
      >
        오래된 순
      </button>
      <button
        class="{buttonClass} {sortOrder === 'random' ? activeClass : inactiveClass}"
        on:click={() => setSortOrder('random')}
      >
        랜덤
      </button>
    </div>
  </header>

  {#if filteredAndSortedBooks.length > 0}
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each filteredAndSortedBooks as book (book.id)}
        <article
          role="button"
          tabindex="0"
          on:click={() => goDetail(book.id)}
          on:keydown={(e)=> (e.key==='Enter' || e.key===' ') && goDetail(book.id)}
          class="group bg-white rounded-xl ring-1 ring-slate-200 overflow-hidden hover:shadow-card transition
                 hover:-translate-y-0.5 cursor-pointer"
        >
          <div class="relative">
            <img src={book.image} alt={book.title} class="h-64 w-full object-cover" loading="lazy" />
            <div class="absolute top-3 left-3">
              <StatusBadge status={book.status} />
            </div>
          </div>

          <div class="p-5 space-y-3">
            <h3 class="text-lg font-semibold text-slate-900 line-clamp-2">{book.title}</h3>
            <div class="flex items-center justify-between">
              <p class="text-sm text-slate-600">{book.author}</p>
              <StarRating value={book.rating ?? 0} />
            </div>

            <div class="flex flex-wrap gap-2 pt-1">
              {#each book.tags ?? [] as t}
                <TagBadge label={t} />
              {/each}
            </div>

            <div class="pt-3 border-t border-slate-100 space-y-2">
              <div>
                <h4 class="text-sm font-semibold text-slate-900/90">감상평</h4>
                {#if book.review?.trim()?.length}
                  <p class="text-sm text-slate-700 line-clamp-3">{book.review}</p>
                {:else}
                  <p class="text-sm italic text-slate-500">아직 감상평이 없어요.</p>
                {/if}
              </div>
            </div>

            <div class="pt-1">
              <span class="inline-flex items-center gap-2 text-sm font-medium text-blue-700 group-hover:text-blue-800">
                자세히 보기
                <svg width="16" height="16" viewBox="0 0 24 24" class="translate-x-0 group-hover:translate-x-0.5 transition">
                  <path d="M5 12h14M13 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
        </article>
      {/each}
    </div>
  {:else}
    <div class="rounded-xl bg-white ring-1 ring-slate-200 p-10 text-center">
      <p class="text-slate-500">목록에 책이 없습니다.</p>
    </div>
  {/if}
</section>