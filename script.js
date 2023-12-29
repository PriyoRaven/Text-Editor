const container = document.getElementById("container");
let selectedText = null;
let stateStack = []; // Stack to store the states
let currentStateIndex = -1; // -1 means no state

function saveState() {
  // Clone the container's HTML and push it onto the stack
  stateStack.push(container.innerHTML);
  // Update the current state index
  currentStateIndex = stateStack.length - 1;
}

function undo() {
  if (currentStateIndex > 0) {
    currentStateIndex--;
    container.innerHTML = stateStack[currentStateIndex];
  }
}

function redo() {
  if (currentStateIndex < stateStack.length - 1) {
    currentStateIndex++;
    container.innerHTML = stateStack[currentStateIndex];
  }
}

// Add event listener for font family change
document.getElementById("fontSelect").addEventListener("change", (e) => {
  saveState();
  document.querySelectorAll(".draggable[selected]").forEach((element) => {
    element.style.fontFamily = e.target.value;
  });
});

// Add event listener for font size change
document.getElementById("fontSizeInput").addEventListener("input", (e) => {
  saveState();
  document.querySelectorAll(".draggable[selected]").forEach((element) => {
    element.style.fontSize = e.target.value + "px";
  });
});

// Add event listener for font color change
document.getElementById("fontColorInput").addEventListener("input", (e) => {
  const selectedText = document.querySelector(".draggable[selected]");
  if (selectedText) {
    selectedText.style.color = e.target.value;
  }
});

function addText() {
  saveState();
  const text = document.getElementById("addTextInput").value;
  if (text) {
    // Create a new div
    const newText = document.createElement("div");
    newText.innerText = text;
    newText.classList.add("draggable");
    newText.style.position = "absolute";
    newText.style.left = "10px";
    newText.style.top = "10px";
    newText.style.fontFamily = document.getElementById("fontSelect").value;
    newText.style.fontSize =
      document.getElementById("fontSizeInput").value + "px";
    newText.style.color = document.getElementById("fontColorInput").value;
    newText.setAttribute("contenteditable", "true");

    // Add an Edit button to the div
    const editButton = document.createElement("button");
    editButton.classList.add("editButton");
    editButton.innerText = "✏️";
    editButton.setAttribute("contenteditable", "false");
    editButton.addEventListener("click", () => openEditOptions(newText));

    // Add an OK button to the div
    const okButton = document.createElement("button");
    okButton.classList.add("okButton");
    okButton.innerText = "✅";
    okButton.setAttribute("contenteditable", "false");
    okButton.style.display = "none"; // Initially hidden
    okButton.addEventListener("click", () => closeEditOptions(newText));

    // Add a Delete button to the div
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteButton");
    deleteButton.innerText = "🗑️";
    deleteButton.setAttribute("contenteditable", "false");
    deleteButton.addEventListener("click", () => deleteText(newText));

    newText.appendChild(editButton);
    newText.appendChild(okButton);
    newText.appendChild(deleteButton); // Add the delete button to the div
    newText.addEventListener("mousedown", selectText);

    // Flag to indicate whether the div is currently being edited
    newText.editing = false;

    container.appendChild(newText);
  }
}

function deleteText(selectedDiv) {
  saveState();
  if (selectedDiv) {
    container.removeChild(selectedDiv);
  }
}

function openEditOptions(selectedDiv) {
  const fontSizeInput = document.getElementById("fontSizeInput");
  const fontColorInput = document.getElementById("fontColorInput");
  const fontSelect = document.getElementById("fontSelect");
  const okButton = selectedDiv.querySelector("button:nth-child(2)");
  const editButton = selectedDiv.querySelector("button:first-child");

  // Set initial values based on the selected div
  fontSizeInput.value = parseInt(selectedDiv.style.fontSize);
  fontColorInput.value = selectedDiv.style.color;
  fontSelect.value = selectedDiv.style.fontFamily;

  // Show the OK button
  okButton.style.display = "inline";

  // Set the editing flag to true
  selectedDiv.editing = true;

  // Hide the Edit button
  editButton.style.display = "none";

  // Listen for changes and apply them in real-time
  function applyChanges() {
    if (selectedDiv.editing) {
      applyEditOptions(selectedDiv);
    }
  }

  // Add event listeners for changes
  fontSizeInput.addEventListener("input", applyChanges);
  fontColorInput.addEventListener("input", applyChanges);
  fontSelect.addEventListener("input", applyChanges);

  // Add a click event listener to the OK button
  okButton.addEventListener("click", () =>
    closeEditOptions(selectedDiv, applyChanges, editButton)
  );
}

function closeEditOptions(selectedDiv, applyChanges, editButton) {
  const okButton = selectedDiv.querySelector("button:nth-child(2)");

  // Hide the OK button
  okButton.style.display = "none";

  // Set the editing flag to false
  selectedDiv.editing = false;

  // Show the Edit button
  editButton.style.display = "inline";

  // Remove event listeners
  const fontSizeInput = document.getElementById("fontSizeInput");
  const fontColorInput = document.getElementById("fontColorInput");
  const fontSelect = document.getElementById("fontSelect");

  fontSizeInput.removeEventListener("input", applyChanges);
  fontColorInput.removeEventListener("input", applyChanges);
  fontSelect.removeEventListener("input", applyChanges);

  // This is to apply changes one more time after removing listeners to finalize
  applyChanges();
}

function applyEditOptions(selectedDiv) {
  selectedDiv.style.fontSize =
    document.getElementById("fontSizeInput").value + "px";
  selectedDiv.style.color = document.getElementById("fontColorInput").value;
  selectedDiv.style.fontFamily = document.getElementById("fontSelect").value;
}

function selectText(event) {
  saveState();
  selectedText = event.target;
  document.addEventListener("mousemove", moveText);
  document.addEventListener("mouseup", unselectText);
}

function moveText(event) {
  if (selectedText) {
    selectedText.style.left = event.clientX - container.offsetLeft + "px";
    selectedText.style.top = event.clientY - container.offsetTop + "px";
  }
}

function editTextProperties() {
  if (selectedText) {
    const fontSizeInput = document.getElementById("fontSizeInput");
    const fontColorInput = document.getElementById("fontColorInput");
    const fontSelect = document.getElementById("fontSelect");

    selectedText.style.fontSize = fontSizeInput.value + "px";
    selectedText.style.color = fontColorInput.value;
    selectedText.style.fontFamily = fontSelect.value;
  }
}

function unselectText() {
  saveState();
  selectedText = null;
  document.removeEventListener("mousemove", moveText);
  document.removeEventListener("mouseup", unselectText);
}
