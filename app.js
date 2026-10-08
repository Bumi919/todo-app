// ===== State =====
const STORAGE_KEY = "todo-app-data";

let todos = load();
let currentFilter = "all";

// ===== DOM =====
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");
const counter = document.getElementById("counter");
const clearDoneBtn = document.getElementById("clear-done");
const filterBtns = document.querySelectorAll(".filter");

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
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const text = document.createElement("span");
    text.className = "text";
    text.textContent = todo.text;

    const del = document.createElement("button");
    del.className = "del";
    del.textContent = "✕";
    del.title = "Hapus tugas";
    del.addEventListener("click", () => deleteTodo(todo.id));

    li.append(checkbox, text, del);
    list.appendChild(li);
  }

  // Empty state
  emptyState.hidden = visible.length > 0;

  // Counter
  const remaining = todos.filter((t) => !t.done).length;
  counter.textContent =
    remaining === 0
      ? "Semua tugas selesai 🎉"
      : `${remaining} tugas tersisa`;

  // Filter aktif
  filterBtns.forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.filter === currentFilter)
  );
}

// ===== Aksi =====
function addTodo(text) {
  todos.unshift({
    id: Date.now(),
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
render();
