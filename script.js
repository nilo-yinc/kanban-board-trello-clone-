let draggedCard = null;
let rightClickedCard = null;

document.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);

function addTask(columnID) {
  const input = document.getElementById(`${columnID}-input`);
  const taskText = input.value.trim();

  if (taskText == "") {
    return;
  }

  const taskDate = new Date().toLocaleString();

  console.log(taskDate);
  //const taskElement = createTaskElement(taskText,taskDate);

  const taskELement = createTaskElement(taskText, taskDate);

  document.getElementById(`${columnID}-tasks`).appendChild(taskELement);
  updateTasksCount(columnID);
  saveTasksToLocalStorage(columnID, taskText, taskDate);
  input.value = "";
}

function createTaskElement(taskText, taskDate) {
  const element = document.createElement("div");
  element.innerHTML = `<span>${taskText}</span><br><small class = "time" >${taskDate}</small>`;
  element.classList.add("card");
  element.setAttribute("draggable", true);
  //element.draggable = true;

  element.addEventListener("dragstart", dragStart);
  element.addEventListener("dragend", dragEnd);

  element.addEventListener("contextmenu", function (event) {
    event.preventDefault();
    rightClickedCard = this;
    // console.log(pageX,pageY);

    showContextMenu(event.pageX, event.pageY);
  });

  return element;
}

function dragStart() {
  this.classList.add("dragging");
  draggedCard = this;
}

function dragEnd() {
  // setTimeout(() =>{
  //     this.classList.add("dragging")
  // },10)

  this.classList.remove("dragging");
  draggedCard = null;
  ["todo", "doing", "done"].forEach((columnID) => {
    updateTasksCount(columnID);
    updateLocalStorage();
  });
}

const columns = document.querySelectorAll(".tasks");
columns.forEach((column) => {
  column.addEventListener("dragover", dragover);
});

function dragover(event) {
  event.preventDefault();
  this.appendChild(draggedCard);
}

const contextmenu = document.querySelector(".context-menu");
function showContextMenu(x, y) {
  contextmenu.style.left = `${x}px`;
  contextmenu.style.top = `${y}px`;
  contextmenu.style.display = "block";
}

document.addEventListener("click", () => {
  contextmenu.style.display = "none";
});

function editTask() {
  if (rightClickedCard !== null) {
    const newTaskText = prompt("Edit task - ", rightClickedCard.textContent);

    if (newTaskText !== "") {
      rightClickedCard.textContent = newTaskText;
      updateLocalStorage();
    }
  }
}

function deleteTask() {
  if (rightClickedCard !== null) {
    const columnID = rightClickedCard.parentElement.id.replace("-tasks", "");
    rightClickedCard.remove();
    console.log(columnID);
    updateLocalStorage();
    updateTasksCount(columnID);
  }
}

function updateTasksCount(columnID) {
  console.log(`#${columnID}-tasks .card`);
  const count = document.querySelectorAll(`#${columnID}-tasks .card`).length;
  document.getElementById(`${columnID}-count`).textContent = count;
}

function saveTasksToLocalStorage(columnID, taskText, taskDate) {
  const tasks = JSON.parse(localStorage.getItem(columnID)) || []; //here parse conerted in the array;
  tasks.push({ text: taskText, date: taskDate });
  localStorage.setItem(columnID, JSON.stringify(tasks)); //localstorage object form me save nhi karpata issliye sringify kiya hai ith referenc columnid
}

function loadTasksFromLocalStorage() {
  ["todo", "doing", "done"].forEach((columnID) => {
    const tasks = JSON.parse(localStorage.getItem(columnID)) || [];
    tasks.forEach(({ text, date }) => {
      // {} destucturing or extract using curly braces
      const taskELement = createTaskElement(text, date);
      document.getElementById(`${columnID}-tasks`).appendChild(taskELement);
    });
    updateTasksCount(columnID);
  });
}

function updateLocalStorage() {
  ["todo", "doing", "done"].forEach((columnID) => {
    const tasks = [];
    document.querySelectorAll(`#${columnID}-tasks .card`).forEach((card) => {
      const taskText = card.querySelector("span").textContent;
      const taskDate = card.querySelector("small").textContent;
      tasks.push({ text: taskText, date: taskDate });
    });

    localStorage.setItem(columnID, JSON.stringify(tasks));
  });
}
