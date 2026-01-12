const menuBtn = document.getElementById("menuBtn");

menuBtn.addEventListener("click", () => {
    document.body.classList.toggle("active");
});

const canvas = document.getElementById("holo-canvas");

/* =====================
   SCENE
===================== */
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 6;
camera.position.y = 1;

/* =====================
   RENDERER
===================== */
const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/* =====================
   HOLOGRAM GRID
===================== */
const geometry = new THREE.PlaneGeometry(12, 12, 120, 120);

const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
});

const grid = new THREE.Mesh(geometry, material);
grid.rotation.x = -Math.PI / 2.3;
grid.position.y = -1.5;
scene.add(grid);

/* =====================
   ANIMATION
===================== */
const clock = new THREE.Clock();

function animate() {
    const t = clock.getElapsedTime();

    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);

        const wave = Math.sin(x * 1.5 + t * 2) * 0.15 + Math.cos(y * 1.5 + t * 1.5) * 0.15;

        pos.setZ(i, wave);
    }

    pos.needsUpdate = true;

    grid.material.opacity = 0.3 + Math.sin(t * 2) * 0.1;
    grid.rotation.z = Math.sin(t * 0.2) * 0.05;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

/* =====================
   RESIZE
===================== */
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
