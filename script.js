let zIndexCounter = 1; // for z-index of text container
let stateStack = []; // for saving the state
let currentStateIndex = -1; // for current state

// for saving the current state
function saveState() {
  const container = document.getElementById("container").innerHTML;
  stateStack = stateStack.slice(0, currentStateIndex + 1); // for removing the states after the current state
  stateStack.push(container);
  currentStateIndex = stateStack.length - 1; // for updating the current state index
}

// this is the undo function
function undo() {
  if (currentStateIndex > 0) {
    currentStateIndex--;
    updateContainerState();
  }
}

// this is the redo function
function redo() {
  if (currentStateIndex < stateStack.length - 1) {
    currentStateIndex++;
    updateContainerState();
  }
}

// this function is for updating the container state
function updateContainerState() {
  const container = document.getElementById("container");
  container.innerHTML = stateStack[currentStateIndex];
  document.querySelectorAll(".text-box").forEach((element) => {
    makeTextDraggable(element);
  });
}

// this function is for making the text append to the canva or container
function addText() {
  const text = document.getElementById("addText").value;
  if (!text) return;

  const textElement = document.createElement("div");
  textElement.classList.add("text-box");
  textElement.innerHTML = text;
  textElement.style.zIndex = zIndexCounter++;
  textElement.setAttribute("contenteditable", "true"); // for making the text editable
  document.getElementById("container").appendChild(textElement); // for appending the text to the container

  makeTextDraggable(textElement);

  saveState();
}

// this function is for making the text draggable
function makeTextDraggable(element) {
  let offsetX,
    offsetY,
    isDragging = false;

  element.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - element.getBoundingClientRect().left;
    offsetY = e.clientY - element.getBoundingClientRect().top;
  });

  // for moving the text
  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;

      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
    }
  });

  // for saving the state after moving the text
  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;

      saveState();
    }
  });
}

// for deleting the text
document.getElementById("fontSelector").addEventListener("change", (e) => {
  document.querySelectorAll(".text-box[selected]").forEach((element) => {
    element.style.fontFamily = e.target.value;
  });
  saveState();
});

// for changing the font size
document.getElementById("fontSizeSelector").addEventListener("input", (e) => {
  document.querySelectorAll(".text-box[selected]").forEach((element) => {
    element.style.fontSize = `${e.target.value}px`;
  });
  saveState();
});

// for changing the font color
document.getElementById("fontColorSelector").addEventListener("input", (e) => {
  const selectedText = document.querySelector(".text-box[selected]");
  if (selectedText) {
    selectedText.style.color = e.target.value;
  }
});

// for deleting the text
document.getElementById("container").addEventListener("click", (e) => {
  document.querySelectorAll(".text-box").forEach((element) => {
    element.removeAttribute("selected");
  });
  const selectedText = e.target.closest(".text-box");
  if (selectedText) {
    selectedText.setAttribute("selected", true);
    document.getElementById("fontColorSelector").value =
      selectedText.style.color || "#000000";
  }
});
