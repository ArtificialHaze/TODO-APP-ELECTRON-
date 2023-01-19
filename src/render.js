const electron = require("electron");
const { ipcRenderer } = electron;

const list = document.querySelector("ul");

ipcRenderer.on("todo:new", function (e, todo) {
  let li = document.createElement("li");
  li.textContent = todo;
  li.addEventListener("click", function () {
    li.parentNode.removeChild(li);
  });
  list.appendChild(li);
});
