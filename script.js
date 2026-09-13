// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Optional: toggle hamburger icon animation here
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Canvas Background Scroll Animation
const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");

const frameCount = 192; // Total frames available
const currentFrame = index => (
    `video_frames_24fps_png/frame_${index.toString().padStart(6, '0')}.png`
);

const images = [];

const preloadImages = () => {
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }
};

// Preload images immediately
preloadImages();

// Set initial canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Function to draw image with "object-fit: cover" behavior on canvas
function drawImageProp(ctx, img) {
    if(!img || !img.width || !img.height) return;
    
    let w = ctx.canvas.width;
    let h = ctx.canvas.height;
    let iw = img.width;
    let ih = img.height;
    
    // Scale ratio
    let r = Math.max(w / iw, h / ih);
    let nw = iw * r;
    let nh = ih * r;
    
    // Center offsets
    let cx = (w - nw) / 2;
    let cy = (h - nh) / 2;

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, cx, cy, nw, nh);
}

// Ensure the first image draws once it's loaded
if (images[0].complete) {
    drawImageProp(context, images[0]);
} else {
    images[0].onload = () => drawImageProp(context, images[0]);
}

const updateImage = index => {
    // index is 1-based in the scroll math, so we subtract 1 for the array
    const imgToDraw = images[index - 1];
    if (imgToDraw && imgToDraw.complete) {
        drawImageProp(context, imgToDraw);
    }
};

// Handle Scroll Event
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScrollTop;
    
    const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
    );
    
    requestAnimationFrame(() => updateImage(frameIndex + 1));
});

// Resize Event for Canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Draw the currently active frame
    const scrollTop = document.documentElement.scrollTop;
    const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
    let scrollFraction = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
    
    const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
    );
    
    const imgToDraw = images[frameIndex];
    if (imgToDraw && imgToDraw.complete) {
        drawImageProp(context, imgToDraw);
    }
});
