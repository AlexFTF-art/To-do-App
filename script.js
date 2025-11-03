const inputTask = document.getElementById("inputTask");
const addTaskBtn = document.getElementById("addTask");
const inputSearch = document.getElementById("inputSearch");
const taskList = document.querySelector("#taskList");
const hiddenText = document.querySelector(".hiddenText");
const removeAllTaskBtn = document.getElementById("removeAllTask"); 

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Guardar las tareas en el localStorage
function saveInLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks)); 
}

// Cargar las tareas desde el localStorage al inicio
function loadFromLocalStorage() {
  renderTasks();
}


// Función para renderizar las tareas
function renderTasks(task = tasks) {
   taskList.textContent = ""; // limpia UL

  if (!task || task.length === 0) {
    hiddenText.classList.add("show");
    return;
  }
  hiddenText.classList.remove("show");

  task.forEach((task) => {
    const taskElement = document.createElement("li");
    taskElement.id = `task-${task.id}`;

    if (task.backgroundColor) li.style.backgroundColor = task.backgroundColor;

    const span = document.createElement("span");
    span.textContent = task.text;


    const spanElement = document.createElement("span");
    spanElement.textContent = task.texto;

    
    if (task.completed) {
      spanElement.style.textDecoration = "line-through";
      spanElement.style.color = "gray"; 
      spanElement.style.textDecorationColor = "black"; 
    } else {
      spanElement.style.textDecoration = "none"; 
      spanElement.style.color = ""; 
      spanElement.style.textDecorationColor = ""; 
    }

    const btnRemove = document.createElement("button");
    btnRemove.textContent = "\u274C"; 
    btnRemove.classList.add("btnRemove");

    const btnComplete = document.createElement("button");
    btnComplete.textContent = "\u2714"
    btnComplete.classList.add("btnComplete");

    const btnChangeColor = document.createElement("button");
    btnChangeColor.type = "button";
    btnChangeColor.className = "btnChangeColor";
    btnChangeColor.textContent = "🎨";
    btnChangeColor.addEventListener("click", () => cambiarColorTarea(task.id));


    btnRemove.addEventListener('click', () => removeTask(task.id));
    btnComplete.addEventListener('click', () => toggleComplete(task.id));
    btnChangeColor.addEventListener('click', () => cambiarColorTarea(task.id));


    taskElement.appendChild(spanElement);
    taskElement.appendChild(btnRemove);
    taskElement.appendChild(btnComplete);
    taskElement.appendChild(btnChangeColor);

    taskList.appendChild(taskElement);
  });
}


const changeThemeBtn = document.getElementById("changeThemeBtn");

// Función para cambiar el tema
function changeTheme() {
  const body = document.body;

  // Alternar la clase de tema entre 'light-theme' y 'dark-theme'
  body.classList.toggle("dark-theme");
  body.classList.toggle("light-theme");

  // Cambiar el icono en el botón dependiendo del tema actual
  if (body.classList.contains("dark-theme")) {
    changeThemeBtn.textContent = "🌞"; // Icono de sol para tema claro
  } else {
    changeThemeBtn.textContent = "🌙"; // Icono de luna para tema oscuro
  }

  // Guardar el tema actual en el localStorage para persistencia
  localStorage.setItem("theme", body.classList.contains("dark-theme") ? "dark" : "light");
}

// Comprobar el tema guardado y aplicarlo
function loadThemeLocalStorage() {
  const savedTheme = localStorage.getItem("theme");


  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    document.body.classList.remove("light-theme");
    changeThemeBtn.textContent = "🌞";
  } else {
    document.body.classList.add("light-theme");
    document.body.classList.remove("dark-theme");
    changeThemeBtn.textContent = "🌙";
  }
}

function cambiarColorTarea(id) {
  const t = tasks.find((x) => x.id === id);
  if (!t) return;

  const picker = document.createElement("input");
  picker.type = "color";
  picker.value = t.backgroundColor || "#b65a5a"; // valor por defecto (match CSS)

  picker.addEventListener("input", (e) => {
    t.backgroundColor = e.target.value;
    guardarEnLocalStorage();
    renderTasks();
  });

  picker.style.position = "fixed";
  picker.style.left = "-9999px";
  document.body.appendChild(picker);
  picker.click();
  picker.addEventListener("blur", () => picker.remove());
}



// Función para agregar una tarea nueva
function addNewTask() {
  const textArea = inputTask.value.trim();

  if (textArea === "") {
    alert("Por favor ingresa una tarea.");
    return;
  }

  const newTask = {
    id: Date.now(),
    texto: textArea,
    completed: false
  };

  tasks.push(newTask);  
  saveInLocalStorage();
  inputTask.value = ""; 
  renderTasks(); 
}

// Función para eliminar una tarea
function removeTask(id) {
  tasks = tasks.filter(task => task.id !== id); 
  saveInLocalStorage(); 
  renderTasks(); 
}

// Función para marcar una tarea como completed o desmarcarla
function toggleComplete(id) {
  const nTask = tasks.find(task => task.id === id); 
  nTask.completed = !nTask.completed; 


  saveInLocalStorage(); 
  renderTasks(); 
}

// Función para eliminar todas las tareas
function removeAllTasks() {
  if (confirm("¿Estás seguro de que deseas eliminar todas las tareas?")) {
    tasks = []; 
    saveInLocalStorage(); 
    renderTasks(); 
  }
}

function handleEvents() {
  addTaskBtn.addEventListener('click', (e) => {
    e.preventDefault(); 
    addNewTask();
  });

  // Evento para búsqueda de tareas
  inputSearch.addEventListener('input', searchTasks);

  // Evento para eliminar todas las tareas
  removeAllTaskBtn.addEventListener('click', removeAllTasks);
}

// Función para buscar tareas
function searchTasks() {
  const textSearch = inputSearch.value.toLowerCase(); 

  // Filtrar las tareas que coinciden con la búsqueda
  const taskFilters = tasks.filter(tarea => tarea.texto.toLowerCase().includes(textSearch));

  renderTasks(taskFilters); 
}

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  loadThemeLocalStorage();
  changeThemeBtn.addEventListener('click', changeTheme);
  loadFromLocalStorage(); // Asegurarse de que las tareas se carguen desde el localStorage al inicio
  handleEvents(); // Configurar los eventos
});