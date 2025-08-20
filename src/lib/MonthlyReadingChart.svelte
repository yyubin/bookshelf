<script>
  import { fade } from 'svelte/transition';

  export let books = [];

  const MAX_BAR_HEIGHT = 160;

  let showTip = false;
  const tipId = 'monthly-reading-tip';
  const openTip = () => (showTip = true);
  const closeTip = () => (showTip = false);
  const toggleTip = () => (showTip = !showTip);

  // 완독 및 읽는 중인 책 데이터 필터링
  $: readBooks = books.filter(b => b.status === 'read' && b.date);
  $: readingBooks = books.filter(b => b.status === 'reading' && b.date);

  // 최근 6개월 데이터 계산
  $: chartData = (() => {
    const today = new Date();
    const data = [];
    const readCounts = {};
    const readingCounts = {};

    for (let i = 0; i < 6; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const monthKey = `${year}-${month.toString().padStart(2, '0')}`;

      readCounts[monthKey] = 0;
      readingCounts[monthKey] = 0;
      data.unshift({
        label: `${month}월`,
        readCount: 0,
        readingCount: 0,
        totalCount: 0
      });
    }

    // 완독 책 카운트
    readBooks.forEach(book => {
      const bookDate = new Date(book.date);
      const year = bookDate.getFullYear();
      const month = bookDate.getMonth() + 1;
      const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
      if (readCounts.hasOwnProperty(monthKey)) {
        readCounts[monthKey]++;
      }
    });

    // 읽는 중인 책 카운트
    readingBooks.forEach(book => {
      const bookDate = new Date(book.date);
      const year = bookDate.getFullYear();
      const month = bookDate.getMonth() + 1;
      const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
      if (readingCounts.hasOwnProperty(monthKey)) {
        readingCounts[monthKey]++;
      }
    });

    const totalCounts = Object.keys(readCounts).map(key => readCounts[key] + readingCounts[key]);
    const maxCount = Math.max(...totalCounts, 0);

    Object.keys(readCounts).forEach((key, index) => {
      const readC = readCounts[key];
      const readingC = readingCounts[key];
      const totalC = totalCounts[index];

      data[index].readCount = readC;
      data[index].readingCount = readingC;
      data[index].totalCount = totalC;

      data[index].readHeight = maxCount > 0 ? (readC / maxCount) * MAX_BAR_HEIGHT : 0;
      data[index].readingHeight = maxCount > 0 ? (readingC / maxCount) * MAX_BAR_HEIGHT : 0;
    });

    return data;
  })();
</script>

<div class="rounded-2xl bg-white p-6 sm:p-8 ring-1 ring-gray-200 shadow-md">
    <div class="flex items-center justify-between mb-6 relative">
    <h3 class="text-xl font-semibold text-gray-900">최근 6개월 독서 통계</h3>

    <!-- info 버튼 -->
    <button
        class="ml-3 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm
            bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300
            ring-1 ring-gray-200 transition shadow-sm"
        aria-describedby={tipId}
        aria-expanded={showTip}
        on:mouseenter={openTip}
        on:mouseleave={closeTip}
        on:focusin={openTip}
        on:focusout={closeTip}
        on:click|stopPropagation={toggleTip}
    >
        요약
        <svg width="16" height="16" viewBox="0 0 24 24" class="opacity-70">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.6"/>
        <circle cx="12" cy="8" r="1.4" fill="currentColor"/>
        <path d="M11 11h2v6h-2z" fill="currentColor"/>
        </svg>
    </button>

    {#if showTip}
        <div
        role="tooltip"
        id={tipId}
        transition:fade={{ duration: 120 }}
        class="absolute right-0 top-full mt-2 w-72 sm:w-80 z-50
                rounded-xl bg-gray-900 text-gray-100 shadow-2xl ring-1 ring-black/10 p-3"
        on:mouseenter={openTip}
        on:mouseleave={closeTip}
        >
        <div class="mb-2 text-xs text-gray-400">최근 6개월 요약 (완독 / 읽는 중 / 합계)</div>

        <div class="space-y-1.5">
            {#each chartData as m}
            <div class="flex items-center justify-between text-sm">
                <span class="text-gray-300">{m.label}</span>
                <span class="tabular-nums">
                {m.readCount} / {m.readingCount} / <span class="font-semibold">{m.totalCount}</span>
                </span>
            </div>
            {/each}
        </div>

        <div class="mt-3 flex items-center gap-3 text-xs text-gray-400">
            <span class="inline-flex items-center gap-1">
            <span class="w-3 h-3 rounded-full bg-blue-500"></span> 완독
            </span>
            <span class="inline-flex items-center gap-1">
            <span class="w-3 h-3 rounded-full bg-indigo-500"></span> 읽는 중
            </span>
        </div>
        </div>
    {/if}
    </div>


  <div class="flex items-end justify-around h-48 border-b-2 border-gray-200">
    {#each chartData as month, i}
      <div class="flex flex-col items-center justify-end h-full w-1/6 px-1 group relative">
        <div class="relative w-full transition-all duration-300 ease-out flex flex-col-reverse items-center justify-start">
          <div
            class="w-full bg-indigo-500 transition-all duration-300 ease-out"
            style="height: {month.readingHeight}px;"
          ></div>
          <div
            class="w-full bg-blue-500 transition-all duration-300 ease-out"
            style="height: {month.readHeight}px;"
          ></div>
        </div>
        <span class="mt-2 text-sm text-gray-600">{month.label}</span>
        <div class="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div class="bg-gray-800 text-white text-xs rounded-lg py-1 px-2 flex flex-col items-center">
            <span>완독: {month.readCount}</span>
            <span>읽는 중: {month.readingCount}</span>
            <span class="text-gray-400 mt-1">{month.label}</span>
          </div>
          <svg class="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
        </div>
      </div>
    {/each}
  </div>

  <div class="flex justify-center gap-6 mt-6 text-sm text-gray-600">
    <div class="flex items-center gap-1">
      <div class="w-3 h-3 rounded-full bg-blue-500"></div>
      완독
    </div>
    <div class="flex items-center gap-1">
      <div class="w-3 h-3 rounded-full bg-indigo-500"></div>
      읽는 중
    </div>
  </div>
</div>