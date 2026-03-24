// ── 状态 ──────────────────────────────────────────
let todos = JSON.parse(localStorage.getItem('todos') || '[]');
let filter = 'all';

// ── 持久化 ────────────────────────────────────────
function save() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// ── 渲染 ──────────────────────────────────────────
function render() {
  const list      = document.getElementById('todoList');
  const empty     = document.getElementById('emptyState');
  const filtered  = getFiltered();

  if (filtered.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
  } else {
    empty.classList.add('hidden');
    list.innerHTML = filtered.map(buildItem).join('');
  }

  updateCount();
}

function buildItem(t) {
  return `
    <li class="todo-item flex items-center gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 transition">
      <input
        type="checkbox"
        ${t.done ? 'checked' : ''}
        onchange="toggle(${t.id})"
        class="w-4 h-4 accent-blue-600 cursor-pointer flex-shrink-0"
      >
      <span class="todo-text flex-1 text-sm text-gray-700 break-all ${t.done ? 'done' : ''}">
        ${escHtml(t.text)}
      </span>
      <button
        onclick="remove(${t.id})"
        class="text-gray-300 hover:text-red-500 transition text-lg leading-none"
        title="删除"
      >×</button>
    </li>
  `;
}

function updateCount() {
  const active = todos.filter(t => !t.done).length;
  document.getElementById('activeCount').textContent = active;
  document.getElementById('totalCount').textContent  = todos.length;
}

// ── 操作 ──────────────────────────────────────────
function addTodo() {
  const input = document.getElementById('todoInput');
  const text  = input.value.trim();
  if (!text) return;
  todos.unshift({ id: Date.now(), text, done: false });
  input.value = '';
  save();
  render();
}

function toggle(id) {
  const t = todos.find(t => t.id === id);
  if (t) t.done = !t.done;
  save();
  render();
}

function remove(id) {
  todos = todos.filter(t => t.id !== id);
  save();
  render();
}

function clearDone() {
  todos = todos.filter(t => !t.done);
  save();
  render();
}

function setFilter(f, btn) {
  filter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  render();
}

function getFiltered() {
  if (filter === 'active') return todos.filter(t => !t.done);
  if (filter === 'done')   return todos.filter(t => t.done);
  return todos;
}

// ── 工具 ──────────────────────────────────────────
function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ── 回车监听 ──────────────────────────────────────
document.getElementById('todoInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTodo();
});

// ── 初始化 ────────────────────────────────────────
render();
