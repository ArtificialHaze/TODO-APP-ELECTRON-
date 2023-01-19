const electron = require("electron");
const { ipcRenderer } = electron;

const form = document.querySelector("form");

function submitForm(e) {
  e.preventDefault();
  const todo = document.querySelector("#todo");

  if (todo.value === "") {
    alert("Please fill all fields");
    return;
  }

  ipcRenderer.send("todo:new", todo.value);
  todo.value = "";
}

form.addEventListener("submit", submitForm);
