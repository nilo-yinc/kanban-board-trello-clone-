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
  const draggedCard = document.querySelector(".dragging");
  //this.appendChild(draggedCard);

  const afterElement = getDragAfterElement(this, event.pageY);

  if(afterElement === null){
    this.appendChild(draggedCard);
  } else {
    this.insertBefore(draggedCard,afterElement);
  }
}

function getDragAfterElement(container,y){
  const draggableElement = [
    ...container.querySelectorAll(".card:not(.dragginng)"),
  ]; // NodeList => Array

  const result = draggableElement.reduce(
    (closestElementUnderMouse, currentTask) => {
      const box = currentTask.getBoundingClientRect();
      const offset = y - (box.top + box.height/2);
      if(offset < 0 && offset > closestElementUnderMouse.offset){
        return {offset : offset , element : currentTask };

      } else {
        return closestElementUnderMouse;
     }
    },
    {offset : Number.NEGATIVE_INFINITY }
  );
  return result.element;

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

// function editTask() {
//   if (rightClickedCard !== null) {
//     const newTaskText = prompt("Edit task - ", rightClickedCard.textContent);

//     if (newTaskText !== "") {
//       rightClickedCard.textContent = newTaskText;
//       updateLocalStorage();
//     }
//   }
// }

function editTask() {
  if (rightClickedCard !== null) {
    const currentText = rightClickedCard.querySelector("span")?.textContent || "";
    const newTaskText = prompt("Edit task - ", currentText);

    if (newTaskText !== null && newTaskText.trim() !== "") {
      const span = rightClickedCard.querySelector("span");
      if (span) {
        span.textContent = newTaskText;
        updateLocalStorage();
      }
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

// bffjbf kfdjkbndl  bjfnjbn nfbnjn
// bfglbnljnjkn bf fbnkbn BiquadFilterNode;faniothritrnfsbmsbh b 
// bnsglnfsb gns eogiojepkrmv, cxhjb chjbf d j fnbf