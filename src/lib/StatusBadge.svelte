<script>
  export let status = 'to-read';
  const map = {
    'read':   { text: '완독',   cls: 'bg-blue-50 text-blue-700 ring-blue-200' },
    'reading':{ text: '읽는 중', cls: 'bg-sky-50 text-sky-700 ring-sky-200' },
    'to-read':{ text: '읽을 책', cls: 'bg-indigo-50 text-indigo-700 ring-indigo-200' },
  };
  $: meta = map[status] ?? map['to-read'];
</script>

<span class={"inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 " + meta.cls}>
  <!-- dot -->
  <span class="h-1.5 w-1.5 rounded-full bg-current opacity-70"></span>
  {meta.text}
</span>
