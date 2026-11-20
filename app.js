import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// بيانات الكروت التلاتة بالكلام اللي كتبته بالظبط
const CARDS = {
  1: {
    title: "أول صوره تجمعنا سوا",
    hasImage: true,
    centered: false,
    body: "أغلى ذكرى وأحلى بداية لينا مع بعض يا بشمهندستي وعمري كله ❤️"
  },
  2: {
    title: "احبك يا احن لي من قلبي",
    hasImage: false,
    centered: true,
    body: "بعشقكك يمراتي ❤️"
  },
  3: {
    title: "النهارده تمينا خمس شهور وجوايا كلام عاوز اقولهولك",
    hasImage: false,
    centered: false,
    body: `وبكدا نكون تمينا 5 شهور
من يوم 21/6/2026 لحد النهارده 21/11/2026
بعتبر اليوم دا احلي صدفه ممكن تكون حصلتلي في حياتي من يوم ما اتولد لأنها اغرب واحلي صدفة حصلتلي في حياتي لاني اشوف البنت الصديقه في مكتب الكليه لي صديقة العمر حب عمري حب حياتي MY Favourite Person
عمري كله احلي خمس شهور عدو عليا في حياتي ويارب نحتفل ب ٧٠ و ٨٠ سنه مع بعض واحنا وسط احفادنا مش عيالنا ويارب يجعل يومي قبل يومك يحياتي لاني مستحيل أتخيل اليوم الي يحصل فيه العكس يارب يارب تبقي احلي وأجمل بشمهندسه وتكوني مراتي ويتقفل علينا باب واحد وشرف ليا ان اكون عرفت بنت بجمال وحلاوتك وصدقيني عمري ف حياتي ينور عيني ان ممكن ابص لواحده غيرك لاني بجد نتي ماليه عيني وحياتي وعمري ما هحب غيرك ربنا يديمنا لبعض يحبيبتي ونفضل نتخانق وناكف في بعض كدا يعمر
I LoVe You Baby❤️❤️❤️❤️❤️❤️

ربنا يديمك ليا طول العمر`
  }
};

// عبارات بتلف حوالين المجرة
const ORBIT_PHRASES = [
  { text: "I love you Basbosty", cardId: 3 },
  { text: "أول صوره تجمعنا سوا", cardId: 1 },
  { text: "احبك يا احن لي من قلبي", cardId: 2 },
  { text: "بعشقكك يمراتي", cardId: 2 },
  { text: "21/6/2026 ❤️ 21/11/2026", cardId: 3 },
  { text: "MY Favourite Person", cardId: 3 },
  { text: "ربنا يديمك ليا طول العمر", cardId: 3 },
  { text: "I LoVe You Baby ❤️", cardId: 3 }
];

// عناصر الواجهة والصوت
const introOverlay = document.getElementById("intro-overlay");
const enterBtn = document.getElementById("enter-btn");
const bgMusic = document.getElementById("bg-music");
const musicToggleBtn = document.getElementById("music-toggle-btn");
const quickCardsBar = document.getElementById("quick-cards-bar");
const floatingStickers = document.getElementById("floating-stickers");

const modal = document.getElementById("memory-modal");
const modalImageWrap = document.getElementById("modal-image-wrap");
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const closeModalBtn = document.getElementById("close-modal-btn");

function openCard(cardId) {
  const card = CARDS[cardId];
  if (!card) return;

  modalTitle.textContent = card.title;
  modalBody.textContent = card.body;
  modalBody.classList.toggle("centered", Boolean(card.centered));

  if (card.hasImage) {
    modalImageWrap.classList.remove("hidden", "img-missing");
    modalImage.src = "./public/our-first-photo.jpg";
  } else {
    modalImageWrap.classList.add("hidden");
  }

  modal.classList.remove("hidden");
}

function closeCard() {
  modal.classList.add("hidden");
}

enterBtn.addEventListener("click", () => {
  // تشغيل الأغنية فور الضغط على الزر
  if (bgMusic) {
    bgMusic.volume = 0.85;
    bgMusic
      .play()
      .then(() => {
        musicToggleBtn.textContent = "🔊";
      })
      .catch(() => {
        musicToggleBtn.textContent = "🔇";
      });
  }

  introOverlay.classList.add("fade-out");
  setTimeout(() => {
    introOverlay.classList.add("hidden");
    musicToggleBtn.classList.remove("hidden");
    quickCardsBar.classList.remove("hidden");
    floatingStickers.classList.remove("hidden");
    warpProgress = 0.001;
  }, 550);
});

musicToggleBtn.addEventListener("click", () => {
  if (!bgMusic) return;
  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      musicToggleBtn.textContent = "🔊";
    });
  } else {
    bgMusic.pause();
    musicToggleBtn.textContent = "🔇";
  }
});

closeModalBtn.addEventListener("click", closeCard);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeCard();
});

document.querySelectorAll("[data-card]").forEach((el) => {
  el.addEventListener("click", () => {
    const id = Number(el.getAttribute("data-card"));
    openCard(id);
  });
});

// إعداد مشهد Three.js متوافق مع الموبايل والتابلت والكمبيوتر
const canvas = document.getElementById("scene-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: "high-performance"
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x090312, 0.012);

const isMobileScreen = () => window.innerWidth < 640;

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, isMobileScreen() ? 9.2 : 7.5, isMobileScreen() ? 19.5 : 16);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 6;
controls.maxDistance = 32;
controls.maxPolarAngle = Math.PI * 0.48;

// 1. النفق الضوئي عند الدخول
const tunnelCount = 1800;
const tunnelGeo = new THREE.BufferGeometry();
const tunnelPos = new Float32Array(tunnelCount * 3);
const tunnelCol = new Float32Array(tunnelCount * 3);
const cPink = new THREE.Color(0xff55aa);
const cPurple = new THREE.Color(0xa855f7);
const cWhite = new THREE.Color(0xffe6f4);

for (let i = 0; i < tunnelCount; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 2.2 + Math.random() * 9.5;
  const z = (Math.random() - 0.5) * 90;
  tunnelPos[i * 3] = Math.cos(angle) * radius;
  tunnelPos[i * 3 + 1] = Math.sin(angle) * radius;
  tunnelPos[i * 3 + 2] = z;

  const mixCol = cPink.clone().lerp(cPurple, Math.random()).lerp(cWhite, Math.random() * 0.35);
  tunnelCol[i * 3] = mixCol.r;
  tunnelCol[i * 3 + 1] = mixCol.g;
  tunnelCol[i * 3 + 2] = mixCol.b;
}
tunnelGeo.setAttribute("position", new THREE.BufferAttribute(tunnelPos, 3));
tunnelGeo.setAttribute("color", new THREE.BufferAttribute(tunnelCol, 3));

const tunnelMat = new THREE.PointsMaterial({
  size: 0.14,
  vertexColors: true,
  transparent: true,
  opacity: 0.9
});
const tunnelPoints = new THREE.Points(tunnelGeo, tunnelMat);
scene.add(tunnelPoints);

// 2. المجرة الدوّامة الوردية/البنفسجية
const galaxyGroup = new THREE.Group();
scene.add(galaxyGroup);

const starCount = isMobileScreen() ? 7000 : 9500;
const galaxyGeo = new THREE.BufferGeometry();
const galaxyPos = new Float32Array(starCount * 3);
const galaxyCol = new Float32Array(starCount * 3);

const innerColor = new THREE.Color(0xff80c8);
const outerColor = new THREE.Color(0x7c2ae8);

for (let i = 0; i < starCount; i++) {
  const radius = Math.pow(Math.random(), 0.75) * 11.5;
  const branchAngle = ((i % 4) / 4) * Math.PI * 2;
  const spinAngle = radius * 0.65;

  const spread = 0.45 * (radius / 5);
  const rx = (Math.random() - 0.5) * spread;
  const ry = (Math.random() - 0.5) * (spread * 0.25);
  const rz = (Math.random() - 0.5) * spread;

  galaxyPos[i * 3] = Math.cos(branchAngle + spinAngle) * radius + rx;
  galaxyPos[i * 3 + 1] = ry;
  galaxyPos[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + rz;

  const col = innerColor.clone().lerp(outerColor, Math.min(radius / 11, 1));
  galaxyCol[i * 3] = col.r;
  galaxyCol[i * 3 + 1] = col.g;
  galaxyCol[i * 3 + 2] = col.b;
}

galaxyGeo.setAttribute("position", new THREE.BufferAttribute(galaxyPos, 3));
galaxyGeo.setAttribute("color", new THREE.BufferAttribute(galaxyCol, 3));

const galaxyMat = new THREE.PointsMaterial({
  size: 0.115,
  vertexColors: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  transparent: true,
  opacity: 0.92
});
const galaxyPoints = new THREE.Points(galaxyGeo, galaxyMat);
galaxyGroup.add(galaxyPoints);

// قلب مضيء من الجزيئات فوق مركز المجرة
const heartCount = 2400;
const heartGeo = new THREE.BufferGeometry();
const heartPos = new Float32Array(heartCount * 3);
const heartColors = new Float32Array(heartCount * 3);

for (let i = 0; i < heartCount; i++) {
  const t = Math.random() * Math.PI * 2;
  const scale = 0.16 * (0.75 + Math.random() * 0.3);
  const hx = 16 * Math.pow(Math.sin(t), 3) * scale;
  const hy =
    (13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)) *
    scale;
  const hz = (Math.random() - 0.5) * 1.1;

  heartPos[i * 3] = hx;
  heartPos[i * 3 + 1] = hy + 4.4;
  heartPos[i * 3 + 2] = hz;

  const hCol = new THREE.Color(0xff4fa3).lerp(new THREE.Color(0xffb3d9), Math.random() * 0.6);
  heartColors[i * 3] = hCol.r;
  heartColors[i * 3 + 1] = hCol.g;
  heartColors[i * 3 + 2] = hCol.b;
}
heartGeo.setAttribute("position", new THREE.BufferAttribute(heartPos, 3));
heartGeo.setAttribute("color", new THREE.BufferAttribute(heartColors, 3));

const heartMat = new THREE.PointsMaterial({
  size: 0.1,
  vertexColors: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  transparent: true
});
const heartPoints = new THREE.Points(heartGeo, heartMat);
galaxyGroup.add(heartPoints);

// لوحات العبارات الدائرة حول المجرة (قابلة للنقر لفتح الكروت)
function makeTextSprite(text) {
  const c = document.createElement("canvas");
  c.width = 640;
  c.height = 128;
  const ctx = c.getContext("2d");

  ctx.clearRect(0, 0, c.width, c.height);
  ctx.font = "bold 40px Cairo, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(255, 79, 163, 0.95)";
  ctx.shadowBlur = 18;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, c.width / 2, c.height / 2);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(mat);
  const w = isMobileScreen() ? 5.5 : 4.8;
  const h = isMobileScreen() ? 1.1 : 0.96;
  sprite.scale.set(w, h, 1);
  return sprite;
}

const orbitSprites = [];
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

ORBIT_PHRASES.forEach((item, idx) => {
  const sprite = makeTextSprite(item.text);
  const angle = (idx / ORBIT_PHRASES.length) * Math.PI * 2;
  const radius = idx % 2 === 0 ? 7.2 : 9.4;
  sprite.userData = { angle, radius, cardId: item.cardId, speed: 0.14 };
  sprite.position.set(Math.cos(angle) * radius, 0.7 + (idx % 3) * 0.35, Math.sin(angle) * radius);
  galaxyGroup.add(sprite);
  orbitSprites.push(sprite);
});

canvas.addEventListener("pointerdown", (e) => {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(orbitSprites, false);
  if (hits.length > 0) {
    const cid = hits[0].object.userData.cardId;
    openCard(cid);
  }
});

let warpProgress = 0;
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();

  // حركة النفق بعد الضغط على الزر
  if (warpProgress > 0 && warpProgress < 1) {
    warpProgress = Math.min(1, warpProgress + 0.022);
    tunnelPoints.position.z += 0.9;
    if (warpProgress >= 1) {
      tunnelMat.opacity = 0;
    }
  } else {
    tunnelPoints.rotation.z += 0.002;
  }

  // دوران المجرة والقلب والعبارات
  galaxyPoints.rotation.y = elapsed * 0.08;
  heartPoints.rotation.y = Math.sin(elapsed * 0.7) * 0.25;
  const beat = 1 + Math.sin(elapsed * 3.2) * 0.04;
  heartPoints.scale.set(beat, beat, beat);

  orbitSprites.forEach((sp) => {
    sp.userData.angle += sp.userData.speed * 0.008;
    const { angle, radius } = sp.userData;
    sp.position.x = Math.cos(angle) * radius;
    sp.position.z = Math.sin(angle) * radius;
  });

  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const w = isMobileScreen() ? 5.5 : 4.8;
  const h = isMobileScreen() ? 1.1 : 0.96;
  orbitSprites.forEach((sp) => sp.scale.set(w, h, 1));
});
