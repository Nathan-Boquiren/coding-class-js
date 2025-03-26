let cl = console.log;

const btns = document.querySelectorAll(".btn");
const fireBg = document.getElementById("fire-bg");
const feedback = document.getElementById("feedback-container");

const cloudImgLink = "https://wallpaperaccess.com/full/122935.jpg";
const fireImgLink = "https://media.tenor.com/ZyUfjXIgqswAAAAC/fire-hot.gif";

btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    fireBg.style.display = "block";
    if (btn.id === "yes-btn") {
      fireBg.style.backgroundImage = `url(${cloudImgLink})`;
      feedback.innerHTML = "YAY!";
    } else {
      feedback.innerHTML = "YOU WILL GO TO HELL.";
      fireBg.style.backgroundImage = `url(${fireImgLink})`;
    }
  });
});
