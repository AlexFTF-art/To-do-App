const inputTask = document.getElementById("inputTask");
const addTaskBtn = document.getElementById("addTask");
const inputSearch = document.getElementById("inputSearch");
const taskList = document.getElementById("taskList");
const hiddenText = document.querySelector(".hiddenText");
const removeAllTaskBtn = document.getElementById("removeAllTask");
const changeThemeBtn = document.getElementById("changeThemeBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


function saveInLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


function applyTheme(theme) {
  const body = document.body;
  const isDark = theme === "dark";
  body.classList.toggle("dark-theme", isDark);
  body.classList.toggle("light-theme", !isDark);
  changeThemeBtn.textContent = isDark ? "🌞" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

function loadTheme() {
  const saved = localStorage.getItem("theme");
  applyTheme(saved === "dark" ? "dark" : "light");
}

function toggleTheme() {
  const isDark = document.body.classList.contains("dark-theme");
  applyTheme(isDark ? "light" : "dark");
}


function renderTasks(list = tasks) {
  taskList.innerHTML = "";
  if (!list || list.length === 0) {
    hiddenText.classList.add("show");
    return;
  }
  hiddenText.classList.remove("show");

  list.forEach((t) => {
    const li = document.createElement("li");
    li.id = `task-${t.id}`;
    if (t.backgroundColor) li.style.backgroundColor = t.backgroundColor;
    if (t.completed) li.classList.add("completed");

    const span = document.createElement("span");
    span.textContent = t.texto;

    const btnComplete = document.createElement("button");
    btnComplete.className = "btnComplete";
    btnComplete.textContent = "✔";
    btnComplete.addEventListener("click", () => toggleComplete(t.id));

    const btnRemove = document.createElement("button");
    btnRemove.className = "btnRemove";
    btnRemove.textContent = "✖";
    btnRemove.addEventListener("click", () => removeTask(t.id));

    const btnColor = document.createElement("button");
    btnColor.className = "btnChangeColor";
    btnColor.textContent = "🎨";
    btnColor.addEventListener("click", () => changeColorTask(t.id));

    li.append(span, btnComplete, btnRemove, btnColor);
    taskList.appendChild(li);
  });
}


function addNewTask() {
  const text = inputTask.value.trim();
  if (!text) return alert("Por favor ingresa una tarea.");
  tasks.push({ id: Date.now(), texto: text, completed: false });
  saveInLocalStorage();
  inputTask.value = "";
  renderTasks();
}

function removeTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveInLocalStorage();
  renderTasks();
}

function toggleComplete(id) {
  const t = tasks.find((x) => x.id === id);
  if (!t) return;
  t.completed = !t.completed;
  saveInLocalStorage();
  renderTasks();
}

function changeColorTask(id) {
  const t = tasks.find((x) => x.id === id);
  if (!t) return;
  const picker = document.createElement("input");
  picker.type = "color";
  picker.value = t.backgroundColor || "#b65a5a";
  picker.style.position = "fixed";
  picker.style.left = "-9999px";
  document.body.appendChild(picker);
  picker.click();
  picker.addEventListener("input", (e) => {
    t.backgroundColor = e.target.value;
    saveInLocalStorage();
    renderTasks();
  });
  picker.addEventListener("blur", () => picker.remove());
}


function searchTasks() {
  const q = inputSearch.value.toLowerCase();
  renderTasks(tasks.filter(t => t.texto.toLowerCase().includes(q)));
}


document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  renderTasks();
  addTaskBtn.addEventListener("click", (e) => { e.preventDefault(); addNewTask(); });
  inputSearch.addEventListener("input", searchTasks);
  removeAllTaskBtn.addEventListener("click", removeAllTasks);
  changeThemeBtn.addEventListener("click", toggleTheme);
});

// Funcion nasi
function removeAllTasks() {
  if (!confirm("¿Eliminar todas las tareas?")) return;
  tasks = [];
  saveInLocalStorage();
  renderTasks();
}
