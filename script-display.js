function renderDisplay() {
  const acts = JSON.parse(localStorage.getItem("acts")) || [];
  const index = parseInt(localStorage.getItem("currentIndex")) || 0;

  const now = acts[index] || { name: "No Act", notes: "" };
  const next = acts[index+1] || { name: "End of Show", notes: "" };

  const nowDiv = document.getElementById("now");
  const nextDiv = document.getElementById("next");

  nowDiv.classList.remove("show");
  nextDiv.classList.remove("show");

  setTimeout(() => {
    nowDiv.innerHTML = `<h2>${now.name}</h2><p>${now.enter} Enter | Exit ${now.exit}</p>`;
    nextDiv.innerHTML = `<h3>Next: ${next.name}</h3><p>${next.notes}</p>`;
    nowDiv.classList.add("show");
    nextDiv.classList.add("show");
  }, 200); // small delay for fade transition
}

// Listen for updates
setInterval(() => {
  if (localStorage.getItem("displayUpdate")) {
    renderDisplay();
  }
}, 500);

renderDisplay();
