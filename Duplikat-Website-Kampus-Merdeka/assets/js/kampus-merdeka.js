const openBtn = document.getElementById("burger");
const menu = document.getElementById("menu");
const bgBurger = document.getElementById("bg-burger");

openBtn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
    menu.classList.toggle("flex");
    bgBurger.classList.toggle("hidden");
    document.body.style.overflow = "hidden";
});

const closeBtn = document.getElementById("close-btn");
closeBtn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
    menu.classList.toggle("flex");
    bgBurger.classList.toggle("hidden");
    document.body.style.overflow = "";
});

bgBurger.addEventListener("click", () => {
    menu.classList.toggle("hidden");
    menu.classList.toggle("flex");
    bgBurger.classList.toggle("hidden");
    document.body.style.overflow = "";
});