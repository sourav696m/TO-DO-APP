
/* ---------------- DATA ---------------- */

let defaultApps = [
  { name: "YouTube", url: "https://www.youtube.com" },
  { name: "Instagram", url: "https://www.instagram.com" },
  { name: "WhatsApp", url: "https://web.whatsapp.com" }
];

let savedApps = JSON.parse(localStorage.getItem("apps")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/* ---------------- SAVE ---------------- */

function saveData(){
  localStorage.setItem("apps", JSON.stringify(savedApps));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ---------------- INIT ---------------- */

function init(){
  mergeDefaults();
  renderApps();
  renderTasks();
}

function mergeDefaults(){
  let names = savedApps.map(a => a.name);

  defaultApps.forEach(app=>{
    if(!names.includes(app.name)){
      savedApps.push(app);
    }
  });

  saveData();
}

init();

/* ---------------- APPS ---------------- */

function addApp(){
  document.getElementById("appModal").style.display = "flex";
}

function closeModal(){
  document.getElementById("appModal").style.display = "none";
}

function saveApp(){

  let name = document.getElementById("appName").value;
  let url = document.getElementById("appUrl").value;

  if(!name || !url){
    alert("Fill both fields!");
    return;
  }

  let exists = savedApps.some(a => a.name === name || a.url === url);
  if(exists){
    alert("App already exists!");
    return;
  }

  savedApps.push({ name, url });

  saveData();
  renderApps();

  document.getElementById("appName").value = "";
  document.getElementById("appUrl").value = "";

  closeModal();
}

/* DELETE APP */
function deleteApp(index){
  let realIndex = index;

  if(savedApps[index].name === "YouTube" ||
     savedApps[index].name === "Instagram" ||
     savedApps[index].name === "WhatsApp"){
    alert("Default apps cannot be deleted!");
    return;
  }

  savedApps.splice(realIndex,1);
  saveData();
  renderApps();
}

/* ICON */
function addAppIcon(app, index){

  let domain = new URL(app.url).hostname;
  let icon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  let wrap = document.createElement("div");
  wrap.style.position = "relative";
  wrap.style.display = "inline-block";

  let img = document.createElement("img");
  img.src = icon;
  img.className = "icon";
  img.title = app.name;
  img.onclick = ()=>window.open(app.url,"_blank");

  let del = document.createElement("span");
  del.innerHTML = "❌";
  del.style.position = "absolute";
  del.style.top = "0";
  del.style.right = "0";
  del.style.fontSize = "12px";
  del.style.cursor = "pointer";
  del.onclick = ()=>deleteApp(index);

  wrap.appendChild(img);
  wrap.appendChild(del);

  document.getElementById("appPanel").appendChild(wrap);
}

function renderApps(){

  let panel = document.getElementById("appPanel");
  panel.innerHTML = `<div class="plus" onclick="addApp()">+</div>`;

  savedApps.forEach((app,i)=>addAppIcon(app,i));
}

/* ---------------- TASKS ---------------- */

function addTask(){

  let text = document.getElementById("taskInput").value;
  if(!text) return;

  tasks.push({
    text,
    status:"pending"
  });

  document.getElementById("taskInput").value="";
  saveData();
  renderTasks();
}

/* STATUS */
function markDone(i){
  tasks[i].status = "done";
  saveData();
  renderTasks();
}

function markFail(i){
  tasks[i].status = "failed";
  saveData();
  renderTasks();
}

/* DELETE TASK */
function deleteTask(i){
  tasks.splice(i,1);
  saveData();
  renderTasks();
}

/* RENDER TASKS */
function renderTasks(){

  let board = document.getElementById("board");
  board.innerHTML = "";

  if(tasks.length === 0){
    board.innerHTML = "No Task Yet";
    return;
  }

  tasks.forEach((t,i)=>{

    let card = document.createElement("div");
    card.className = "taskCard";

    if(t.status === "pending") card.classList.add("pending");
    if(t.status === "done") card.classList.add("done");
    if(t.status === "failed") card.classList.add("failed");

    let emoji =
      t.status === "done" ? "😊" :
      t.status === "failed" ? "😢" : "⏳";

    card.innerHTML = `
      <div>${t.text} ${emoji}</div>
      <div>
        <button onclick="markDone(${i})">✔</button>
        <button onclick="markFail(${i})">✖</button>
        <button onclick="deleteTask(${i})">🗑</button>
      </div>
    `;

    board.appendChild(card);
  });
}
function resetTasks(){

  let confirmReset = confirm("Are you sure you want to reset all tasks?");

  if(!confirmReset) return;

  tasks = [];
  localStorage.setItem("tasks", JSON.stringify(tasks));

  renderTasks();
}