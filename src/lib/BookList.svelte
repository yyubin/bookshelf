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
  let sortOrder = 'dateDesc'; 

  $: filteredAndSortedBooks = books
    .filter(book => {
      if (filterStatus === 'all' && book.access === "public") {
        return true;
      }
      return book.status === filterStatus;
    })
    .sort((a, b) => {
      if (sortOrder === 'dateDesc') {
        return new Date(b.date) - new Date(a.date);
      }
      if (sortOrder === 'dateAsc') {
        return new Date(a.date) - new Date(b.date);
      }
      return Math.random() - 0.5;
    });

  function setFilter(status) {
    filterStatus = status;
  }

  function setSortOrder(order) {
    sortOrder = order;
  }

  const buttonClass = 'px-4 py-2 rounded-full text-sm font-medium transition';
</script>

<section class="mx-auto max-w-7xl py-8">
  <header class="mb-6 px-4 sm:px-6 lg:px-8">
    <h2 class="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900">
      {viewTitle}
      <span class="ml-2 align-middle text-sm text-indigo-600">{filteredAndSortedBooks.length}권</span>
    </h2>

    <div class="mt-4 flex gap-2">
      <button
        class="{buttonClass} {filterStatus === 'all' ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
        on:click={() => setFilter('all')}
      >
        전체
      </button>
      <button
        class="{buttonClass} {filterStatus === 'read' ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
        on:click={() => setFilter('read')}
      >
        완독
      </button>
      <button
        class="{buttonClass} {filterStatus === 'reading' ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
        on:click={() => setFilter('reading')}
      >
        읽는중
      </button>
      <button
        class="{buttonClass} {filterStatus === 'to-read' ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
        on:click={() => setFilter('to-read')}
      >
        읽을 예정
      </button>
    </div>

    <div class="mt-4 flex gap-2 items-center">
      <span class="text-sm font-medium text-gray-500">정렬:</span>
      <button
        class="{buttonClass} {sortOrder === 'dateDesc' ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
        on:click={() => setSortOrder('dateDesc')}
      >
        최신순
      </button>
      <button
        class="{buttonClass} {sortOrder === 'dateAsc' ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
        on:click={() => setSortOrder('dateAsc')}
      >
        오래된 순
      </button>
      <button
        class="{buttonClass} {sortOrder === 'random' ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
        on:click={() => setSortOrder('random')}
      >
        랜덤
      </button>
    </div>
  </header>

  {#if filteredAndSortedBooks.length > 0}
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-6 lg:px-8">
      {#each filteredAndSortedBooks as book (book.id)}
        {#if book.access == "public"}
          <article
            role="button"
            tabindex="0"
            on:click={() => goDetail(book.id)}
            on:keydown={(e)=> (e.key==='Enter' || e.key===' ') && goDetail(book.id)}
            class="group bg-white rounded-lg ring-1 ring-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer"
          >
            <div class="relative aspect-w-2 aspect-h-3">
              <img src={book.image} alt={book.title} class="object-cover transition-transform duration-200 group-hover:scale-105" loading="lazy" />
              <div class="absolute top-2 left-2">
                <StatusBadge status={book.status} />
              </div>
            </div>

            <div class="p-4 space-y-2">
              <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">{book.title}</h3>
              <p class="text-sm text-gray-600 line-clamp-1">{book.author}</p>
              <div class="flex items-center justify-between">
                <StarRating value={book.rating ?? 0} />
              </div>

              <div class="flex flex-wrap gap-1 pt-1">
                {#each book.tags ?? [] as t}
                  <TagBadge label={t} />
                {/each}
              </div>

              <div class="pt-2 border-t border-gray-100">
                <h4 class="text-sm font-semibold text-gray-900/90 mt-2">감상평</h4>
                {#if book.review?.trim()?.length}
                  <p class="text-sm text-gray-700 line-clamp-2">{book.review}</p>
                {:else}
                  <p class="text-sm italic text-gray-500">아직 감상평이 없어요.</p>
                {/if}
              </div>

              <div class="mt-2">
                <span class="inline-flex items-center gap-1 text-sm font-medium text-indigo-700 hover:text-indigo-900 transition">
                  자세히 보기
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </div>
          </article>
        {/if}
      {/each}
    </div>
  {:else}
    <div class="rounded-lg bg-white ring-1 ring-gray-200 p-10 text-center px-4 sm:px-6 lg:px-8">
      <p class="text-gray-500">목록에 책이 없습니다.</p>
    </div>
  {/if}
</section>