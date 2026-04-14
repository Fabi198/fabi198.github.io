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

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

let currentImages = [];
let currentIndex = 0;

// click en cualquier imagen
console.log(document.querySelectorAll(".project-gallery img"));
document.querySelectorAll(".project-gallery img").forEach((img) => {
  img.addEventListener("click", () => {
    console.log("CLICK DETECTADO");
    const gallery = img.closest(".project-gallery");

    // agarrar lista completa
    currentImages = JSON.parse(gallery.dataset.gallery);

    // encontrar índice correcto
    currentIndex = currentImages.findIndex(src =>
      img.src.includes(src)
    );

    // fallback por si falla
    if (currentIndex === -1) currentIndex = 0;

    openLightbox();
  });
});

function openLightbox() {
  updateImage();
  lightbox.style.display = "flex";
}

function updateImage() {
  lightboxImg.src = currentImages[currentIndex];
}

// navegación circular
document.getElementById("next").onclick = () => {
  currentIndex = (currentIndex + 1) % currentImages.length;
  updateImage();
};

document.getElementById("prev").onclick = () => {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  updateImage();
};

let startX = 0;

lightbox.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

lightbox.addEventListener("touchend", (e) => {
  let endX = e.changedTouches[0].clientX;

  if (startX - endX > 50) {
    document.getElementById("next").click();
  }

  if (endX - startX > 50) {
    document.getElementById("prev").click();
  }
});

document.querySelector(".close").onclick = () => {
  lightbox.style.display = "none";
};

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = "none";
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    lightbox.style.display = "none";
  }
});

document.addEventListener("keydown", (e) => {

  // solo si el lightbox está abierto
  if (lightbox.style.display !== "flex") return;

  if (e.key === "ArrowRight") {
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateImage();
  }

  if (e.key === "ArrowLeft") {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateImage();
  }

  if (e.key === "Escape") {
    lightbox.style.display = "none";
  }

});