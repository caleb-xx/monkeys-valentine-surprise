console.log("script.js loaded ✅");

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- MUSIC ---------- */
  const bgMusic = document.getElementById("bgMusic");
  if(bgMusic){
  bgMusic.volume = 0.15;
  bgMusic.play().catch(() => {
    const playMusic = () => { bgMusic.play(); document.body.removeEventListener('click', playMusic); };
    document.body.addEventListener("click", playMusic);
    document.body.addEventListener("touchstart", playMusic, {once:true});
  });
}

  /* ---------- SCREEN NAV ---------- */
  let current = 0;
  const screens = document.querySelectorAll(".screen");
  function nextScreen() {
    if(current >= screens.length-1) return;
    screens[current].classList.remove("active");
    current++;
    screens[current].classList.add("active");
    if(current === 2) loadReasons();
    if(current === 3) startMiniGame();
  }

/* ---------- INTRO + PASSWORD ---------- */
const introText = document.getElementById("introText");
const continueBtn = document.getElementById("continueBtn");
const passwordBox = document.getElementById("passwordBox");
const passwordInput = document.getElementById("passwordInput");
const passwordMsg = document.getElementById("passwordMsg");
const passwordHint = document.getElementById("passwordHint");

const message = "Hey Clara 💕\nI made this just for you";
const correctPasswords = ["26 october", "26th october"];
let i = 0;
let triedOnce = false;

function typeIntro(){
  if(i < message.length){
    introText.innerHTML += message[i] === "\n" ? "<br>" : message[i];
    i++;
    setTimeout(typeIntro, 70);
  } else {
    passwordBox.style.display = "block";
  }
}
typeIntro();

// Function to type out success message
function typePasswordMsg(text, callback){
  passwordMsg.innerHTML = "";
  let j = 0;
  const interval = setInterval(() => {
    passwordMsg.innerHTML += text[j];
    j++;
    if(j >= text.length){
      clearInterval(interval);
      if(callback) callback();
    }
  }, 50); // typing speed
}

passwordInput.addEventListener("input", () => {
  const input = passwordInput.value.toLowerCase().trim();

  if(correctPasswords.includes(input)){
    passwordHint.style.display = "none"; // hide hint if previously shown
    typePasswordMsg(
      "Of course you remembered 🤭💖\nCome see what I made for you…",
      () => {
        continueBtn.style.display = "inline-block";
        continueBtn.style.animation = "pulse 1.2s infinite";
      }
    );
  } else {
    passwordMsg.innerHTML = "";
    continueBtn.style.display = "none";
  }
});

continueBtn.addEventListener("click", nextScreen);

passwordInput.addEventListener("keydown", e => {
  if(e.key === "Enter"){
    const input = passwordInput.value.toLowerCase().trim();
    if(!correctPasswords.includes(input)){
      passwordHint.style.display = "block";
      passwordMsg.innerHTML = "Hmm… try again 🫣";
      passwordMsg.style.color = "#5a2a5f";
      continueBtn.style.display = "none";
    }
  }
});

  /* ---------- CARD GAME ---------- */
  const icons = ["💗","💗","🧸","🧸","💕","💕"];
  let flipped = [], matched = 0;
  const board = document.getElementById("gameBoard");

  function playPop() {
    const audio = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=');
    audio.play();
  }

  if(board){
    icons.sort(() => 0.5 - Math.random());
    icons.forEach(icon => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<div class="card-inner"><div class="card-face card-front">❓</div><div class="card-face card-back">${icon}</div></div>`;
      card.onclick = () => flipCard(card, icon);
      board.appendChild(card);
    });
  }

  function flipCard(card, icon){
    if(flipped.length === 2 || card.classList.contains("matched")) return;
    card.classList.add("flipped");
    playPop();
    flipped.push(card);
    if(flipped.length === 2){
      setTimeout(() => {
        const first = flipped[0].querySelector(".card-back").innerText;
        const second = flipped[1].querySelector(".card-back").innerText;
        if(first === second){
          flipped.forEach(c => c.classList.add("matched"));
          matched++;
          launchConfetti(10);
        } else {
          flipped.forEach(c => c.classList.remove("flipped"));
        }
        flipped = [];
        if(matched === 3) setTimeout(nextScreen, 900);
      }, 800);
    }
  }

  /* ---------- REASONS ---------- */
  const reasonsData = [
    ["Your smile","It makes my heart skip a beat every single time 😍"],
    ["Your eyes","I could get lost in them forever and never find my way out 🥹💖"],
    ["Your kindness","I swear, the way you care drives me crazy in the best way 🫶"],
    ["Your voice","Every word you say is my favorite song 🎶💕"],
    ["Your heart","I’d get lost in it forever and never want to leave 🥹💖"],
    ["You","Just being near you makes my world brighter… and my thoughts naughtier 😏💗"]
  ];

  const reasonsDiv = document.getElementById("reasons");
  let revealed = 0;

  function loadReasons() {
    if(!reasonsDiv) return;
    reasonsDiv.innerHTML = "";
    revealed = 0;
    reasonsData.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "reason";
      div.style.animationDelay = `${index*0.15}s`;
      div.innerText = item[0];
      div.onclick = () => {
        if(div.classList.contains("opened")) return;
        div.classList.add("opened");
        div.style.opacity = "0";
        playPop();
        setTimeout(() => {
          div.innerText = item[1];
          div.style.opacity = "1";
          revealed++;
          if(revealed === reasonsData.length) setTimeout(nextScreen, 900);
        }, 250);
      };
      reasonsDiv.appendChild(div);
    });
  }

  /* ---------- MINI-GAME ---------- */
const gameArea = document.getElementById("gameArea");
const scoreText = document.getElementById("scoreText");
let score = 0;

function startMiniGame(){
  if(!gameArea || !scoreText) return;
  gameArea.innerHTML = "";
  score = 0;
  scoreText.innerText = "Score: 0";
  let hearts = [];
  let gameOver = false;

  function spawnHeart(){
    if(gameOver) return;

    const heart = document.createElement("div");
    heart.className = "tap-emoji";
    heart.innerText = Math.random() > 0.5 ? "💗" : "🧸";

    // get gameArea size
    const gameRect = gameArea.getBoundingClientRect();
    const maxLeft = gameRect.width - 30;

    heart.style.position = "absolute";
    heart.style.left = Math.random() * maxLeft + "px";
    heart.style.top = "-40px";
    heart.style.pointerEvents = "auto";

    gameArea.appendChild(heart);
    hearts.push(heart);

    const drift = (Math.random() - 0.5) * 1.5;

    function animate(){
      let top = parseFloat(heart.style.top);
      let left = parseFloat(heart.style.left);
      top += 4; // slower on mobile
      left += drift;
      heart.style.top = top + "px";
      heart.style.left = left + "px";

      // remove when it goes past bottom of gameArea
      if(top > gameRect.height){
        heart.remove();
        hearts = hearts.filter(h => h !== heart);
        return;
      }

      requestAnimationFrame(animate);
    }
    animate();

    function tapped(){
      if(gameOver) return;
      score++;
      scoreText.innerText = "Score: " + score;
      heart.style.transform = "scale(1.5)";
      playPop();
      setTimeout(() => heart.remove(), 200);
      hearts = hearts.filter(h => h !== heart);
      if(score >= 8){
        gameOver = true;
        hearts.forEach(h => h.remove());
        setTimeout(nextScreen, 900);
      }
    }
    heart.addEventListener("click", tapped);
    heart.addEventListener("touchstart", tapped);
  }

  const spawnInterval = setInterval(spawnHeart, 700);
  for(let i=0; i<4; i++) setTimeout(spawnHeart, i*350);
}

 /* ---------- VALENTINE ---------- */
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

let yesScale = 1; // starting scale for YES button

// Helper: apply combined scale (pulse + growth)
function updateYesScale() {
  yesBtn.style.transform = `scale(${yesScale})`;
  yesBtn.style.transition = "transform 0.25s ease"; // smooth growth
}

// Move NO button and grow YES
function moveNo() {
  if(!noBtn || !yesBtn) return;

  // Move NO button randomly
  const maxX = window.innerWidth - noBtn.offsetWidth - 20;
  const maxY = window.innerHeight - noBtn.offsetHeight - 20;
  noBtn.style.left = Math.random() * maxX + "px";
  noBtn.style.top = Math.random() * maxY + "px";

  // Grow YES button slightly
  yesScale += 0.05;
  updateYesScale();
}

// Desktop: hover
if(noBtn) noBtn.addEventListener("mouseover", moveNo);

// Mobile: tap
if(noBtn) noBtn.addEventListener("touchstart", e => {
  e.preventDefault(); // prevent accidental clicks
  moveNo();
}, {passive:false});

// YES button click
if(yesBtn) yesBtn.addEventListener("click", sayYes);

// YES button pulse remains in CSS, growth stacks on top

function sayYes() {
  const finalScreen = document.createElement("section");
  finalScreen.className = "final-screen";

  finalScreen.innerHTML = `
    <div class="final-content">
      <h1>YAYYYY 🥹💖</h1>
      <p>You just made me the happiest person alive Clara😭💕.</p>
      <p>Happy Valentine’s Day, Monkey 🧸</p>
    </div>
  `;

  document.body.appendChild(finalScreen);

  // trigger animation
  setTimeout(() => {
    finalScreen.classList.add("show");
  }, 50);

  launchConfetti(40);
  createFloatingHearts();
}

  /* ---------- FLOATING HEARTS ---------- */
  setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.innerText = Math.random() > 0.5 ? "💗" : "🧸";
    heart.style.left = Math.random()*100 + "vw";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
  }, 1200);

  /* ---------- TAP EMOJI ---------- */
  document.body.addEventListener("touchstart", e => {
    const emoji = document.createElement("div");
    emoji.className = "tap-emoji";
    emoji.innerText = Math.random() > 0.5 ? "💗" : "🧸";
    emoji.style.left = (e.touches[0].clientX-14) + "px";
    emoji.style.top = (e.touches[0].clientY-14) + "px";
    document.body.appendChild(emoji);
    setTimeout(() => emoji.remove(), 1000);
  });

  /* ---------- CONFETTI ---------- */
  function launchConfetti(amount){
    for(let i=0;i<amount;i++){
      setTimeout(() => {
        const conf = document.createElement("div");
        conf.innerText = Math.random() > 0.5 ? "💗" : "🧸";
        conf.className = "floating-heart";
        conf.style.left = Math.random()*100 + "vw";
        document.body.appendChild(conf);
        setTimeout(() => conf.remove(), 6000);
      }, i*80);
    }
  }

  function createFloatingHearts(){
    for(let i=0; i<20; i++){
      const heart = document.createElement("div");
      heart.className = "floating-heart";
      heart.innerText = Math.random() > 0.5 ? "💗" : "🧸";
      heart.style.left = Math.random()*100 + "vw";
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 6000 + i*100);
    }
  }

  /* ---------- NAME TEXT CELEBRATION ---------- */
  function launchNameText(){
    const text = document.createElement("div");
    text.style.position = "fixed";
    text.style.top = "20%";
    text.style.left = "50%";
    text.style.transform = "translateX(-50%)";
    text.style.fontSize = "36px";
    text.style.fontFamily = "'Dancing Script', cursive";
    text.style.color = "#ff4d88";
    text.style.textShadow = "2px 2px #fff";
    text.innerText = "Clara, I love you! 💖";
    document.body.appendChild(text);
    setInterval(() => {
      text.style.left = (50 + Math.sin(Date.now()/300)*5) + "%";
    }, 50);
  }

  /* ---------- SECRET EASTER EGG ---------- */
  let longPressTimer;
  document.body.addEventListener("touchstart", e => {
    longPressTimer = setTimeout(() => {
      alert("💌 Surprise! I love you so much, Clara! 💖");
    }, 2500);
  });
  document.body.addEventListener("touchend", e => {
    clearTimeout(longPressTimer);
  });

});
