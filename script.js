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

const section = document.querySelector("#training");

const main = document.querySelector(".main");

const nodes = [
  { el: document.querySelector(".start"), progress: 0 },
  { el: document.querySelector(".n1"), progress: 0.30 },
  { el: document.querySelector(".n2"), progress: 0.49 },
  { el: document.querySelector(".n3"), progress: 0.85 },
  { el: null, progress: 1 }
];

const branchesData = [
  { el: document.querySelector(".b1"), trigger: 0.38 },
  { el: document.querySelector(".b2"), trigger: 0.45 },
  { el: document.querySelector(".b3"), trigger: 0.65 },
  { el: document.querySelector(".b4"), trigger: 0.65 },
  { el: document.querySelector(".b5"), trigger: 0.74 },
  { el: document.querySelector(".b6"), trigger: 1 }
];

const starsTraining = document.querySelectorAll(".starTraining"); // ⭐ NUEVO

const tooltip = document.getElementById("tooltip");

// LONGITUD LÍNEA PRINCIPAL
const length = main.getTotalLength();

main.style.strokeDasharray = length;
main.style.strokeDashoffset = length;

// PREPARAR RAMAS + POSICIONAR ESTRELLAS
const triggeredBranches = new Set();

branchesData.forEach((b, i) => {
  const len = b.el.getTotalLength();
  b.el.style.strokeDasharray = len;
  b.el.style.strokeDashoffset = len;
  b.len = len;

  // ⭐ posicionar estrella al final de la rama
  if (starsTraining[i]) {
    const endPoint = b.el.getPointAtLength(len);
    starsTraining[i].style.transform = `translate(${endPoint.x}px, ${endPoint.y}px)`;
  }
});

// ANIMACIÓN PRINCIPAL
function animateLine() {
  let currentStep = 0;

  function drawToNext() {
    if (currentStep >= nodes.length) return;

    const target = length * (1 - nodes[currentStep].progress);
    let currentOffset = parseFloat(main.style.strokeDashoffset);

    function step() {
      currentOffset -= 4;

      const progress = 1 - (currentOffset / length);

      // 🔥 DISPARAR RAMAS
      branchesData.forEach((b, i) => {
        if (progress >= b.trigger && !triggeredBranches.has(i)) {

          triggeredBranches.add(i);

          let branchOffset = b.len;

          function drawBranch() {
            branchOffset -= 4;

            if (branchOffset <= 0) {
              b.el.style.strokeDashoffset = 0;

              // ⭐ mostrar estrella al terminar
              if (starsTraining[i]) {
                starsTraining[i].classList.add("show");
              }

              return;
            }

            b.el.style.strokeDashoffset = branchOffset;
            requestAnimationFrame(drawBranch);
          }

          drawBranch();
        }
      });

      // CONTROL DE NODOS
      if (currentOffset <= target) {
        main.style.strokeDashoffset = target;

        // VALIDACIÓN: Solo mostrar si el elemento existe (evita el error de n4/null)
        if (nodes[currentStep] && nodes[currentStep].el) {
          nodes[currentStep].el.classList.add("show");
        }

        currentStep++;
        setTimeout(drawToNext, 400);
        return;
      }

      main.style.strokeDashoffset = currentOffset;
      requestAnimationFrame(step);
    }

    step();
  }

  drawToNext();
}

// TRIGGER SCROLL
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateLine();
      observer.disconnect();
    }
  });
}, { threshold: 0.3 });

observer.observe(section);

// TOOLTIP NODOS
nodes.forEach((node, i) => {

  if (!node.el) return;

  node.el.addEventListener("mouseenter", () => {
    if (i != 0) {
      tooltip.style.opacity = 1;
      tooltip.style.visibility = "visible";
    }


    const textos = [
      "Inicio del camino",
      "Técnico Electromecanico\n(2015)",
      "Android Developer\n(2024)",
      "Analista de Sistemas\n(2026)"
    ];

    tooltip.innerText = textos[i] || "";
  });

  node.el.addEventListener("mousemove", (e) => {
    tooltip.style.left = e.pageX + 15 + "px";
    tooltip.style.top = e.pageY + 15 + "px";
  });

  node.el.addEventListener("mouseleave", () => {
    tooltip.style.opacity = 0;
    tooltip.style.visibility = "hidden";
  });

});

// TOOLTIP PARA ESTRELLAS
starsTraining.forEach((star, i) => {

  if (!star) return;

  star.setAttribute("pointer-events", "all");

  star.addEventListener("mouseenter", (e) => {
    console.log("Mouse entró en estrella:", i);

    const textos = [
      "Hidraulica en Fabricacion de Plasticos\n(2019)",
      "Reparación de Celulares\n(2016)",
      "JAVA by Coursera\n(2021)",
      "HTML/CSS\n(2025)",
      "JavaScript\n(2025)"
    ];

    tooltip.innerText = textos[i] || "Información";
    tooltip.style.opacity = "1";
    tooltip.style.visibility = "visible";
  });

  star.addEventListener("mousemove", (e) => {
    tooltip.style.left = (e.pageX + 15) + "px";
    tooltip.style.top = (e.pageY + 15) + "px";
  });

  star.addEventListener("mouseleave", () => {
    tooltip.style.opacity = "0";
    tooltip.style.visibility = "hidden";
  });

});


// ===== DATOS =====
const nodeData = [
  {
    title: "Inicio del camino",
    year: "(2008 - 2015)",
    desc: "Primer contacto con la tecnología.",
    place: "",
    mode: "",
    file: "#"
  },
  {
    title: "Técnico Electromecánico",
    year: "(2008 - 2015)",
    desc: "Secundario técnico completo con titulo de electromecánico.",
    place: "E.E.S.T. N°4 Ing. Emilio Mitre",
    mode: "Presencial",
    file: "#"
  },
  {
    title: "Android Developer",
    year: "(2022 - 2024)",
    desc: "Desarrollo de apps para Android en Java y Kotlin con Android Studio. Ademas de conocimientos en GIT, Google Analytics, y metodologia Scrum",
    place: "Educación IT",
    mode: "Distancia (168hs)",
    file: "/assets/certificates/Certificado-Desarrollador-Android.pdf"
  },
  {
    title: "Técnico Superior en Análisis de Sistemas",
    year: "(2025 - 2026)",
    desc: "Desarrollo y mantenimiento de programas en lenguajes avanzados, y liderazgo de proyectos de análisis y programación",
    place: "Instituto de Estudios Superiores de Buenos Aires (ESBA)",
    mode: "Presencial",
    file: "#"
  }
];

const starData = [
  {
    title: "Neumatica e Hidraulica en la Industria Plastica",
    year: "(2019)",
    desc: "Formación industrial en el campo de la industria plastica, aplicando maquinaria alimentada con neumatica o hidraulica.",
    place: "Centro de Formación Profesional N°30",
    mode: "Presencial",
    file: "#"
  },
  {
    title: "Técnico en reparación de Celulares",
    year: "(2015)",
    desc: "Arme y desarme de dispositivos electronicos, ademas de flasheos y reparaciones de Sistemas Operativos en moviles.",
    place: "Instituto Centro de Enseñanza en Tecnologia y Oficio (CETO)",
    mode: "Presencial",
    file: "#"
  },
  {
    title: "Informática: Programar con un propósito",
    year: "(2023)",
    desc: "Curso dictado por Coursera, avalado por la Universidad de Princeton, y enseñado por Robert Sedgewick y Kevin Wayne.",
    place: "Coursera",
    mode: "Distancia (150hs)",
    file: "#"
  },
  {
    title: "Diseño Web con HTML5/CSS",
    year: "(2024)",
    desc: "Curso de diseño web con HTML y CSS",
    place: "Conecta Empleo",
    mode: "Distancia (30hs)",
    file: "/assets/certificates/FT AR HTML - Certificado.pdf"
  },
  {
    title: "JavaScript",
    year: "(2024)",
    desc: "Fundamentos basicos de JS",
    place: "Conecta Empleo",
    mode: "Distancia (30hs)",
    file: "/assets/certificates/FT AR JavaScript - Certificado.pdf"
  }
];

// ===== MODAL =====
const modal = document.getElementById("eduModal");
const title = document.getElementById("eduTitle");
const year = document.getElementById("eduYear");
const desc = document.getElementById("eduDescription");
const place = document.getElementById("eduPlace");
const mode = document.getElementById("eduMode");
const download = document.getElementById("eduDownload");

function openModal(data) {
  title.textContent = data.title;
  year.textContent = data.year;
  desc.textContent = data.desc;
  place.textContent = data.place;
  mode.textContent = data.mode;
  download.href = data.file;

  // ocultar tooltip si está visible
  tooltip.style.opacity = 0;
  tooltip.style.visibility = "hidden";

  modal.classList.add("show");
}

// ===== CLICK NODOS (SIN TOCAR TU HOVER) =====
nodes.forEach((node, i) => {
  if (!node.el) return;

  node.el.style.cursor = "pointer";

  node.el.addEventListener("click", () => {
    openModal(nodeData[i]);
  });
});

// ===== CLICK ESTRELLAS =====
starsTraining.forEach((star, i) => {
  if (!star) return;

  star.style.cursor = "pointer";

  star.addEventListener("click", () => {
    openModal(starData[i]);
  });
});

// ===== CERRAR =====
document.querySelector(".edu-close").addEventListener("click", () => {
  modal.classList.remove("show");
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
});