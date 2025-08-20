<script>
  import { onMount } from 'svelte';

  let readingData = [];
  let dailyPages = {};
  let weeks = [];

  // 잔디밭 색상 레벨
  const COLORS = {
    level0: 'bg-gray-200 dark:bg-gray-700',
    level1: 'bg-[#9be9a8]', // 밝은 초록
    level2: 'bg-[#40c463]', // 중간 초록
    level3: 'bg-[#30a14e]', // 진한 초록
    level4: 'bg-[#216e39]'  // 아주 진한 초록
  };

  // 페이지 수에 따른 레벨 반환
  const getLevel = (pages) => {
    if (pages === 0) return 'level0';
    if (pages <= 10) return 'level1';
    if (pages <= 25) return 'level2';
    if (pages <= 50) return 'level3';
    return 'level4';
  };

  // 날짜 포맷
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  };

  // 잔디밭 그리드 생성
  const generateGrid = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 3);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // 시작 요일을 일요일로

    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + (6 - today.getDay())); // 끝 요일을 토요일로

    const days = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // 주 단위로 나누기
    weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
  };

  // 컴포넌트 마운트 시 데이터 로드 및 그리드 생성
  onMount(async () => {
    try {
      const res = await fetch('/readingData.json');
      readingData = await res.json();

      readingData.forEach(item => {
        dailyPages[item.date] = (dailyPages[item.date] || 0) + item.pagesRead;
      });

      generateGrid();
    } catch (e) {
      console.error("독서 데이터를 로드하지 못했습니다:", e);
    }
  });

  // 툴팁에 표시될 정보 생성
  const getTooltip = (date) => {
    const formattedDate = formatDate(date);
    const totalPages = dailyPages[formattedDate] || 0;
    if (totalPages > 0) {
      const records = readingData.filter(item => item.date === formattedDate);
      const books = records.map(item => `📖 ${item.bookTitle}: ${item.pagesRead}쪽`);
      return `${formattedDate}\n총 ${totalPages}쪽 독서\n\n${books.join('\n')}`;
    }
    return `${formattedDate}\n독서 기록 없음`;
  };
</script>

<style>
  /* 잔디밭 사각형의 크기를 키웠습니다. */
  .square {
    width: 20px;
    height: 20px;
  }
  .square {
    transition: transform 0.1s ease-in-out;
  }

  .square:hover {
    transform: scale(1.2);
  }

  /* 툴팁이 다른 요소에 가려지지 않도록 z-index를 높였습니다. */
  .tooltip {
    position: absolute;
    z-index: 999;
    background: #222;
    color: white;
    padding: 6px 8px;
    font-size: 11px;
    border-radius: 4px;
    white-space: pre-line;
    min-width: 100px;
    flex: auto;
    /* 툴팁이 상단에 위치하도록 위치를 조정했습니다. */
    transform: translate(-50%, -120%);
    display: none;
    left: 50%; /* 가운데 정렬을 위해 추가 */
  }

  .hoverable:hover .tooltip {
    display: block;
  }
</style>

<div>
  <h2 class="text-2xl font-bold mb-4">3개월 독서 잔디 🌱</h2>
  <div class="flex gap-2">
    {#each weeks as week}
      <div class="flex flex-col gap-2">
        {#each week as date}
          {@const formatted = formatDate(date)}
          {@const pages = dailyPages[formatted] || 0}
          {@const level = getLevel(pages)}
          <div class="hoverable relative">
            <div class="square rounded-sm {COLORS[level]}"></div>
            <div class="tooltip z-50">{getTooltip(date)}</div>
          </div>
        {/each}
      </div>
    {/each}
  </div>
  <div class="mt-4 text-sm text-gray-500"></div>
</div>
