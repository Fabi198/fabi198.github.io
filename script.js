function copyEmail() {
  const email = "fabianferrer42@gmail.com";
  navigator.clipboard.writeText(email);

  const snackbar = document.getElementById("snackbar");
  snackbar.classList.add("show");

  setTimeout(() => {
    snackbar.classList.remove("show");
  }, 2000);
}

function showEmail() {
  document.getElementById("emailBox").style.opacity = "1";
}

function hideEmail() {
  document.getElementById("emailBox").style.opacity = "0";
}

const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let stars = [];
let time = 0;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = document.body.scrollHeight;
}

function createStars() {
  stars = [];
  const count = Math.floor((canvas.width * canvas.height) / 3000);

  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.2,
      opacity: Math.random(),
      speed: Math.random() * 0.005 + 0.002,
      phase: Math.random() * Math.PI * 2,
    });
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  time += 0.01;

  for (const star of stars) {
    const twinkle =
      Math.sin(time * star.speed * 100 + star.phase) * 0.4 + 0.6;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${star.opacity * twinkle})`;
    ctx.fill();
  }

  requestAnimationFrame(animate);
}

resize();
createStars();
animate();

window.addEventListener("resize", () => {
  resize();
  createStars();
});