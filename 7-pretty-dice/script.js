const diceEls = [...document.querySelectorAll(".die")];
const r1 = document.getElementById("r1");
const r2 = document.getElementById("r2");
const rollBtn = document.getElementById("rollBtn");
const resetBtn = document.getElementById("resetBtn");
const winnerMsg = document.getElementById("winnerMsg");

const faces = {
  1: [5],
  2: [1, 9],
  3: [1, 5, 9],
  4: [1, 3, 7, 9],
  5: [1, 3, 5, 7, 9],
  6: [1, 3, 4, 6, 7, 9],
};

function clearDie(el) {
  el.innerHTML = "";
}
function drawDie(el, n) {
  clearDie(el);
  faces[n].forEach((pos) => {
    const pip = document.createElement("span");
    pip.className = "pip";
    const row = Math.ceil(pos / 3);
    const col = ((pos - 1) % 3) + 1;
    pip.style.gridRow = row;
    pip.style.gridColumn = col;
    el.appendChild(pip);
  });
}

function rollOnce() {
  return Math.floor(Math.random() * 6) + 1;
}

function animateRoll(diceArray, duration = 650) {
  diceArray.forEach((el) => el.classList.add("rolling"));
  const t0 = performance.now();
  let rafId;
  const tick = (t) => {
    const p = t - t0;
    diceArray.forEach((el) => {
      drawDie(el, rollOnce());
    });
    if (p < duration) {
      rafId = requestAnimationFrame(tick);
    } else {
      diceArray.forEach((el) => el.classList.remove("rolling"));
    }
  };
  rafId = requestAnimationFrame(tick);
  return new Promise((resolve) => setTimeout(resolve, duration + 20));
}

diceEls.forEach((el) => drawDie(el, 1));

rollBtn.addEventListener("click", async () => {
  rollBtn.disabled = true;
  const p1Dice = [
    document.querySelector('[data-die="p1a"]'),
    document.querySelector('[data-die="p1b"]'),
  ];
  const p2Dice = [
    document.querySelector('[data-die="p2a"]'),
    document.querySelector('[data-die="p2b"]'),
  ];

  await animateRoll([...p1Dice, ...p2Dice]);

  const a = rollOnce(), b = rollOnce();
  const c = rollOnce(), d = rollOnce();
  drawDie(p1Dice[0], a);
  drawDie(p1Dice[1], b);
  drawDie(p2Dice[0], c);
  drawDie(p2Dice[1], d);

  const s1 = a + b, s2 = c + d;

  r1.textContent = `Сума: ${s1}`;
  r2.textContent = `Сума: ${s2}`;
  r1.className = "result";
  r2.className = "result";

  if (s1 > s2) {
    r1.classList.add("win");
    r2.classList.add("lose");
    winnerMsg.textContent = "🏆 Переміг Гравець 1";
  } else if (s2 > s1) {
    r2.classList.add("win");
    r1.classList.add("lose");
    winnerMsg.textContent = "🏆 Переміг Гравець 2";
  } else {
    r1.textContent += " • Нічия";
    r2.textContent += " • Нічия";
    winnerMsg.textContent = "🤝 Нічия";
  }

  rollBtn.disabled = false;
});

resetBtn.addEventListener("click", () => {
  diceEls.forEach((el) => drawDie(el, 1));
  r1.textContent = "—";
  r2.textContent = "—";
  r1.className = "result";
  r2.className = "result";
  winnerMsg.textContent = "—";
});