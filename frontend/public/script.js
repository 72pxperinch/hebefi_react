window.onload = function () {
  const menu_btn = document.querySelector(".hamburger");

  const menu = document.querySelector(".menu");
  menu_btn.addEventListener("click", function () {
    menu_btn.classList.toggle("is-active");
    menu.classList.toggle("menu-down");
  });
};
