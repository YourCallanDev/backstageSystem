let acts = [];

async function loadActs() {
  const res = await fetch("assets/acts.json");
  acts = await res.json();
  update();
}

function update() {
  const index = parseInt(localStorage.getItem("showIndex")) || 0;
  const act = acts[index];
  const next = acts[index + 1];

  const nowDiv = document.getElementById("now");
  const nextDiv = document.getElementById("next");

  if (act) {
    nowDiv.innerHTML = `<h2>${act.act}</h2>
                        <p>${act.enter} Enter | Exit ${act.exit}</p>
                        <p><i>${act.notes || ""}</i></p>`;
  } else {
    nowDiv.innerHTML = "<h2>No Current Act</h2>";
  }

  if (next) {
    nextDiv.innerHTML = `<h3>${next.act}</h3>
                         <p>${next.enter} Enter | Exit ${next.exit}</p>
                         <p><i>${next.notes || ""}</i></p>`;
  } else {
    nextDiv.innerHTML = "<h3>End of Show</h3>";
  }

  autoFitText(nowDiv);
  autoFitText(nextDiv);
}

function autoFitText(container) {
  const maxHeight = 200;
  let size = 32;
  const p = container.querySelector("h2,h3");
  if (!p) return;
  while (p.scrollHeight > maxHeight && size > 12) {
    size--;
    p.style.fontSize = size + "px";
  }
}

setInterval(update, 1000);
loadActs();
