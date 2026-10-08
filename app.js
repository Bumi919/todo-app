// ===== State =====
const STORAGE_KEY = "todo-app-data";
const THEME_KEY = "todo-app-theme";

let todos = load();
let currentFilter = "all";
let editingId = null;

// ===== DOM =====
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");
const emptyMessage = document.getElementById("empty-message");
const counter = document.getElementById("counter");
const clearDoneBtn = document.getElementById("clear-done");
const themeToggle = document.getElementById("theme-toggle");
const filterBtns = document.querySelectorAll(".filter");

// ===== Util =====
function newId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now() + "-" + Math.random().toString(16).slice(2);
}

// ===== Tema =====
function applyTheme(theme, persist) {
  document.documentElement.dataset.theme = theme;
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  if (persist) localStorage.setItem(THEME_KEY, theme);
}

themeToggle.addEventListener("click", () => {
  const next =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next, true);
});

// ===== Simpan / muat dari localStorage =====
function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// ===== Render =====
function render() {
  const visible = todos.filter((t) => {
    if (currentFilter === "active") return !t.done;
    if (currentFilter === "done") return t.done;
    return true;
  });

  list.innerHTML = "";

  for (const todo of visible) {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.setAttribute("aria-label", todo.text);
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    if (todo.id === editingId) {
      const editor = document.createElement("input");
      editor.type = "text";
      editor.className = "edit-input";
      editor.value = todo.text;
      editor.maxLength = 200;
      editor.setAttribute("aria-label", "Edit tugas");

      let cancelled = false;
      const commit = () => {
        if (cancelled) return;
        editingId = null;
        updateTodoText(todo.id, editor.value);
      };
      editor.addEventListener("keydown", (e) => {
        if (e.key === "Enter") editor.blur();
        if (e.key === "Escape") {
          cancelled = true;
          editingId = null;
          render();
        }
      });
      editor.addEventListener("blur", commit);

      li.append(checkbox, editor);
      requestAnimationFrame(() => {
        editor.focus();
        editor.select();
      });
    } else {
      const text = document.createElement("span");
      text.className = "text";
      text.textContent = todo.text;
      text.title = "Klik dua kali untuk mengedit";
      text.addEventListener("dblclick", () => {
        editingId = todo.id;
        render();
      });

      const del = document.createElement("button");
      del.className = "del";
      del.textContent = "✕";
      del.title = "Hapus tugas";
      del.setAttribute("aria-label", `Hapus tugas: ${todo.text}`);
      del.addEventListener("click", () => deleteTodo(todo.id));

      li.append(checkbox, text, del);
    }

    list.appendChild(li);
  }

  // Empty state — pesan menyesuaikan kondisi
  if (visible.length > 0) {
    emptyState.hidden = true;
  } else if (todos.length === 0) {
    emptyMessage.textContent = "Belum ada tugas. Tambahkan yang pertama!";
    emptyState.hidden = false;
  } else {
    emptyMessage.textContent =
      currentFilter === "done"
        ? "Belum ada tugas yang selesai."
        : "Tidak ada tugas aktif. Kerja bagus! 🎉";
    emptyState.hidden = false;
  }

  // Counter
  const remaining = todos.filter((t) => !t.done).length;
  counter.textContent =
    todos.length === 0
      ? "Belum ada tugas"
      : remaining === 0
        ? "Semua tugas selesai 🎉"
        : `${remaining} dari ${todos.length} tugas tersisa`;

  // Tombol "hapus yang selesai" hanya aktif jika ada yang selesai
  const doneCount = todos.length - remaining;
  clearDoneBtn.disabled = doneCount === 0;

  // Filter: label + jumlah + aria-pressed
  filterBtns.forEach((btn) => {
    const f = btn.dataset.filter;
    const n =
      f === "active"
        ? remaining
        : f === "done"
          ? doneCount
          : todos.length;
    btn.innerHTML = "";
    btn.append(
      document.createTextNode(
        f === "all" ? "Semua" : f === "active" ? "Aktif" : "Selesai"
      )
    );
    if (n > 0) {
      const badge = document.createElement("span");
      badge.className = "count";
      badge.textContent = n;
      badge.setAttribute("aria-hidden", "true");
      btn.appendChild(badge);
    }
    const isActive = f === currentFilter;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
}

// ===== Aksi =====
function addTodo(text) {
  todos.unshift({
    id: newId(),
    text: text.trim(),
    done: false,
  });
  save();
  render();
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    save();
    render();
  }
}

function updateTodoText(id, text) {
  const todo = todos.find((t) => t.id === id);
  const trimmed = text.trim();
  if (todo && trimmed) {
    todo.text = trimmed;
  }
  save();
  render();
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  save();
  render();
}

function clearCompleted() {
  todos = todos.filter((t) => !t.done);
  save();
  render();
}

// ===== Event =====
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTodo(text);
  input.value = "";
  input.focus();
});

filterBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    render();
  })
);

clearDoneBtn.addEventListener("click", clearCompleted);

// ===== Mulai =====
applyTheme(document.documentElement.dataset.theme || "dark", false);
render();
