<script>
  import { books } from './lib/data.js';
  import Sidebar from './lib/Sidebar.svelte';
  import BookList from './lib/BookList.svelte';
  import BookDetail from './lib/BookDetail.svelte';
  import About from './About.svelte';
  import { onMount } from 'svelte';

  let currentView = 'list';     // 'list' | 'detail' | 'about'
  let selectedTag = null;       // string | null
  let q = '';

  // 라우팅(상세) 관련
  let route = { name: 'list', id: null };
  let selectedBook = null;

  function parseHash() {
    const h = window.location.hash.slice(1);
    const parts = h.split('/').filter(Boolean);
    if (parts[0] === 'book' && parts[1]) {
      const id = Number(parts[1]);
      const found = books.find(b => b.id === id);
      if (found) {
        route = { name: 'detail', id };
        selectedBook = found;
        currentView = 'detail';
        return;
      }
    }
    route = { name: 'list', id: null };
    selectedBook = null;
    currentView = 'list';
  }

  onMount(() => {
    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  });

  // Sidebar 이벤트: view:'list' | 'about'
  function handleNavClick(e) {
    const { view, tag } = e.detail;
    currentView = view;
    selectedTag = tag;
    if (window.location.hash.startsWith('#/book/')) {
        window.location.hash = '#';
    }
  }

  // 필터링: 태그 + 검색어
  $: filteredBooks = books
    .filter(b => {
      if (!selectedTag) return true;
      return (b.tags ?? []).includes(selectedTag);
    })
    .filter(b => {
      const hay = (b.title + b.author + (b.review||'') + (b.reason||'') + (b.tags||[]).join(' ')).toLowerCase();
      return hay.includes(q.trim().toLowerCase());
    });

  // 뷰 타이틀
  $: viewTitle = selectedTag ? `태그: ${selectedTag}` : '전체';
</script>

<div class="min-h-screen bg-slate-50">
  <div class="flex">
    <Sidebar
      {currentView}
      {selectedTag}
      {books}
      on:navClick={handleNavClick}
    />

    <main class="flex-1 p-6 sm:p-8">
      {#if currentView === 'list'}
        <section class="mx-auto max-w-7xl">
          <div class="mb-8 rounded-2xl bg-gradient-to-r from-gray-600 to-gray-500 text-white p-8 ring-1 ring-blue-400/30">
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">비카이브</h1>
            <p class="mt-2 text-white/90">
              좌측 태그를 클릭하거나, 아래 검색으로 빠르게 찾아보세요.
            </p>
            <div class="mt-6 relative">
              <input
                type="search"
                placeholder="책 제목·작가·감상평·태그로 검색"
                bind:value={q}
                class="w-full sm:w-[36rem] rounded-xl bg-white/95 text-slate-900 placeholder-slate-400
                       ring-1 ring-white/40 focus:ring-2 focus:ring-white/70 outline-none px-4 py-3"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-900/70">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                        fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                </svg>
              </div>
            </div>
          </div>
        </section>

        <BookList books={filteredBooks} {viewTitle} />
      {:else if currentView === 'detail'}
        <BookDetail book={selectedBook} />
      {:else if currentView === 'about'}
        <About />
      {/if}
    </main>
  </div>
</div>