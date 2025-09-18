let acts = [];
let currentIndex = 0;
const cueList = document.getElementById("cueList");
const currentActDiv = document.getElementById("currentAct");
const showDropdown = document.getElementById("showDropdown");

// Populate dropdown from shows.json
async function populateShows() {
  try {
    const res = await fetch("assets/shows.json");
    const shows = await res.json();

    showDropdown.innerHTML = "<option value=''>-- Select Show --</option>";
    for (const [name, path] of Object.entries(shows)) {
      const opt = document.createElement("option");
      opt.value = path;
      opt.textContent = name;
      showDropdown.appendChild(opt);
    }
  } catch (err) {
    console.error("Error loading shows.json:", err);
  }
}

async function loadShow() {
  const path = showDropdown.value;
  if (!path) return alert("Please select a show.");

  try {
    const res = await fetch(path);
    acts = await res.json();

    currentIndex = 0;
    document.getElementById("showSelect").style.display = "none";
    document.getElementById("controls").style.display = "block";

    renderCueList();
    renderCurrent();
  } catch (err) {
    console.error("Error loading show file:", err);
  }
}

function pushToDisplays() {
  localStorage.setItem("acts", JSON.stringify(acts));
  localStorage.setItem("currentIndex", currentIndex);
  localStorage.setItem("displayUpdate", Date.now());
}

function renderCueList() {
  cueList.innerHTML = "";
  acts.forEach((act, i) => {
    const li = document.createElement("li");
    li.textContent = `${i+1}. ${act.name} (${act.enter} → ${act.exit})`;
    li.draggable = true;
    li.dataset.index = i;
    cueList.appendChild(li);
  });
}

function renderCurrent() {
  currentActDiv.textContent = `Now: ${acts[currentIndex]?.name || "None"}`;
}

function prevAct() {
  if (currentIndex > 0) {
    currentIndex--;
    renderCurrent();
    pushToDisplays();
  }
}

function nextAct() {
  if (!document.getElementById("bypassConfirm").checked) {
    if (!confirm("Are you sure you want to go to the next act?")) return;
  }
  if (currentIndex < acts.length - 1) {
    currentIndex++;
    renderCurrent();
    pushToDisplays();
  }
}

function undoAct() {
  if (currentIndex > 0) {
    currentIndex--;
    renderCurrent();
    pushToDisplays();
  }
}

// Drag & drop
let dragStartIndex;
cueList.addEventListener("dragstart", e => {
  dragStartIndex = +e.target.dataset.index;
});
cueList.addEventListener("dragover", e => e.preventDefault());
cueList.addEventListener("drop", e => {
  const dragEndIndex = +e.target.dataset.index;
  const item = acts.splice(dragStartIndex, 1)[0];
  acts.splice(dragEndIndex, 0, item);
  renderCueList();
  renderCurrent();
  pushToDisplays();
});

// Init
populateShows();
