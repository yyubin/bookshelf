<script>
  import { books } from './lib/data.js';
  import Sidebar from './lib/Sidebar.svelte';
  import Topbar from './lib/Topbar.svelte';
  import BookList from './lib/BookList.svelte';
  import BookDetail from './lib/BookDetail.svelte';
  import ReadingGarden from './lib/ReadingGarden.svelte';
  import About from './About.svelte';
  import { onMount } from 'svelte';

  let currentView = 'list';     // 'list' | 'detail' | 'about'
  let selectedTag = null;       // string | null
  let q = '';
  let isDropdownOpen = false;   // Toggle state for mobile dropdown

  // Routing (detail) related
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
        isDropdownOpen = false; // Close dropdown on navigation
        return;
      }
    }
    route = { name: 'list', id: null };
    selectedBook = null;
    currentView = 'list';
    isDropdownOpen = false; // Close dropdown on navigation
  }

  onMount(() => {
    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  });

  // Navigation event: view:'list' | 'about'
  function handleNavClick(e) {
    const { view, tag } = e.detail;
    currentView = view;
    selectedTag = tag;
    isDropdownOpen = false; // Close dropdown on nav click
    if (window.location.hash.startsWith('#/book/')) {
        window.location.hash = '#';
    }
  }

  // Toggle dropdown for mobile
  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
    console.log('Dropdown toggled:', isDropdownOpen); // 디버깅용 로그
  }

  // Filtering: tag + search
  $: filteredBooks = books
    .filter(b => {
      if (!selectedTag) return true;
      return (b.tags ?? []).includes(selectedTag);
    })
    .filter(b => {
      const hay = (b.title + b.author + (b.review||'') + (b.reason||'') + (b.tags||[]).join(' ')).toLowerCase();
      return hay.includes(q.trim().toLowerCase());
    });

  // View title
  $: viewTitle = selectedTag ? `태그: ${selectedTag}` : '전체';
</script>

<div class="min-h-screen bg-gray-100 font-sans">
  <Topbar
    {currentView}
    {selectedTag}
    {books}
    on:navClick={handleNavClick}
    on:toggleDropdown={toggleDropdown}
    bind:isDropdownOpen
  />
  
  <div class="flex">
    <div class="hidden sm:block">
      <Sidebar
        {currentView}
        {selectedTag}
        {books}
        on:navClick={handleNavClick}
      />
    </div>

    <main class="flex-1 p-6 sm:p-8">
      {#if currentView === 'list'}
        <section class="mx-auto max-w-7xl">
          <div class="mb-8 rounded-2xl bg-gray-800 text-white p-8 ring-1 ring-gray-700 shadow-lg">
            <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">비카이브</h1>
            <p class="mt-2 text-gray-400 text-base">
              좌측 태그를 클릭하거나, 아래 검색으로 빠르게 찾아보세요.
            </p>
            <div class="mt-6 relative">
              <input
                type="search"
                placeholder="책 제목·작가·감상평·태그로 검색"
                bind:value={q}
                class="w-full sm:w-[36rem] rounded-xl bg-gray-700/80 text-gray-200 placeholder-gray-400
                       ring-1 ring-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none px-4 py-3 transition-colors"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        <BookList books={filteredBooks} {viewTitle} />
      {:else if currentView === 'detail'}
        <BookDetail book={selectedBook} />
      {:else if currentView === 'readingGarden'}
        <ReadingGarden />
      {/if}
    </main>
  </div>
</div>