let acts = [];
let index = 0;
let locked = false;
let history = [];
const PASSWORD = "stagepass"; // change this

async function loadActs() {
  const res = await fetch("assets/acts.json");
  acts = await res.json();
  // restore saved progress
  index = parseInt(localStorage.getItem("showIndex")) || 0;
  render();
  renderCueList();
}

function login() {
  const pw = document.getElementById("password").value;
  if (pw === PASSWORD) {
    document.getElementById("auth").style.display = "none";
    document.getElementById("control").style.display = "block";
  } else {
    alert("Wrong password!");
  }
}

function render() {
  if (!acts.length) return;
  localStorage.setItem("showIndex", index);

  const act = acts[index];
  const next = acts[index + 1];

  let currentHTML = `<h2>Now: ${act.act}</h2>
                     <p>${act.enter} Enter | Exit ${act.exit}</p>
                     <p><i>${act.notes || ""}</i></p>
                     <p>[${act.tag}]</p>`;

  let nextHTML = next
    ? `<h3>Next: ${next.act}</h3>
       <p>${next.enter} Enter | Exit ${next.exit}</p>
       <p><i>${next.notes || ""}</i></p>
       <p>[${next.tag}]</p>`
    : "<h3>End of Show</h3>";

  document.getElementById("current").innerHTML = currentHTML + nextHTML;

  renderCueList();
}

function nextAct() {
  if (locked) return alert("Control is locked!");
  if (index < acts.length - 1) {
    if (!confirm("Go to next act?")) return;
    history.push(index);
    index++;
    render();
  }
}

function prevAct() {
  if (locked) return alert("Control is locked!");
  if (index > 0) {
    if (!confirm("Go back to previous act?")) return;
    history.push(index);
    index--;
    render();
  }
}

function undoAct() {
  if (locked) return alert("Control is locked!");
  if (history.length > 0) {
    index = history.pop();
    render();
  }
}

function toggleLock() {
  locked = !locked;
  alert(locked ? "Controls locked 🔒" : "Controls unlocked 🔓");
}

function renderCueList() {
  const ul = document.getElementById("cueList");
  ul.innerHTML = "";
  acts.forEach((act, i) => {
    const li = document.createElement("li");
    li.draggable = true;
    li.ondragstart = e => e.dataTransfer.setData("index", i);
    li.ondragover = e => e.preventDefault();
    li.ondrop = e => {
      const from = e.dataTransfer.getData("index");
      const to = i;
      reorder(from, to);
    };
    li.innerHTML = `${i === index ? "👉 " : ""}${act.act} (${act.tag}) ${i < index ? "✔️" : ""}`;
    ul.appendChild(li);
  });
}

function reorder(from, to) {
  const moved = acts.splice(from, 1)[0];
  acts.splice(to, 0, moved);
  renderCueList();
  localStorage.setItem("acts", JSON.stringify(acts));
}

function searchActs() {
  const query = document.getElementById("search").value.toLowerCase();
  const items = document.querySelectorAll("#cueList li");
  items.forEach(li => {
    li.style.display = li.innerText.toLowerCase().includes(query) ? "block" : "none";
  });
}

function exportCSV() {
  let csv = "Act,Enter,Exit,Notes,Tag,Completed\n";
  acts.forEach((a, i) => {
    csv += `"${a.act}","${a.enter}","${a.exit}","${a.notes}","${a.tag}",${i < index ? "Yes" : "No"}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "RunSheet.csv";
  a.click();
}

window.onload = loadActs;
