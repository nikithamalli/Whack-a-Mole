const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.getElementById('score');
const roundDisplay = document.getElementById('roundDisplay');
const startBtn = document.getElementById('startBtn');
const hitSound = document.getElementById('hitSound');

const introScreen = document.getElementById('intro-screen');
const gameScreen = document.getElementById('game-screen');
const resultModal = document.getElementById('result-modal');

const playBtn = document.getElementById('playBtn');
const restartBtn = document.getElementById('restartBtn');
const resultTitle = document.getElementById('result-title');
const finalScore = document.getElementById('final-score');
const resultMessage = document.getElementById('result-message');

const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');

let score = 0;
let currentMole = null;
let gameInterval;
let gameRunning = false;
let currentRound = 1;

// Difficulty settings: mole speed(ms), round duration(ms)
const difficultySettings = {
  easy:    { round1Speed: 1000, round2Speed: 800, roundDuration: 35000 },
  medium:  { round1Speed: 800,  round2Speed: 600, roundDuration: 30000 },
  hard:    { round1Speed: 600,  round2Speed: 400, roundDuration: 25000 }
};

let selectedDifficulty = 'easy'; // default

playBtn.addEventListener('click', () => {
  // Get selected difficulty
  difficultyRadios.forEach(radio => {
    if (radio.checked) selectedDifficulty = radio.value;
  });
  
  introScreen.style.display = 'none';
  gameScreen.style.display = 'flex';
});

restartBtn.addEventListener('click', () => {
  resultModal.style.display = 'none';
  introScreen.style.display = 'flex';
  score = 0;
  currentRound = 1;
  scoreDisplay.textContent = score;
  roundDisplay.textContent = 'Round: 1';
  startBtn.style.display = 'inline-block';
});

function showResult(title, message) {
  resultTitle.textContent = title;
  finalScore.textContent = `Your Score: ${score}`;
  resultMessage.textContent = message;

  // Show modal popup
  resultModal.style.display = 'flex';

  // Hide game screen
  gameScreen.style.display = 'none';
}

function randomHole(speed) {
  holes.forEach(h => h.classList.remove('mole'));
  const moleHole = holes[Math.floor(Math.random() * holes.length)];
  moleHole.classList.add('mole');
  currentMole = moleHole.id;
}

holes.forEach(hole => {
  hole.addEventListener('click', () => {
    if (hole.id === currentMole && gameRunning) {
      score++;
      scoreDisplay.textContent = score;
      hitSound.currentTime = 0;
      hitSound.play();
      currentMole = null;
      hole.classList.remove('mole');
    }
  });
});

function startRound(round) {
  // get speeds based on difficulty
  const speed = round === 1 ? difficultySettings[selectedDifficulty].round1Speed : difficultySettings[selectedDifficulty].round2Speed;
  const roundDuration = difficultySettings[selectedDifficulty].roundDuration;

  roundDisplay.textContent = `Round: ${round} - ${round === 1 ? 'Warm-Up! (Score 4+ to continue)' : 'Speed Mode! 🏃‍♂️💨'}`;
  gameRunning = true;
  startBtn.style.display = 'none';

  gameInterval = setInterval(() => randomHole(speed), speed);

  setTimeout(() => {
    clearInterval(gameInterval);
    gameRunning = false;
    holes.forEach(h => h.classList.remove('mole'));

    if (round === 1) {
      if (score <= 3) {
        showResult(
          "❌ Uh-oh! Mole Miss!",
          "You didn’t score high enough to continue. Keep practicing and try again!"
        );
      } else {
        roundDisplay.textContent = 'Get ready for Round 2...';
        setTimeout(() => {
          scoreDisplay.textContent = score;
          startRound(2);
        }, 3000);
      }
    } else {
      showResult(
        "🎉 Mole Champion!",
        "Awesome job! You dominated both rounds with lightning-fast reflexes! 🧠💥"
      );
    }
  }, roundDuration);
}

startBtn.addEventListener('click', () => {
  if (gameRunning) return;
  score = 0;
  scoreDisplay.textContent = score;
  currentRound = 1;
  startRound(1);
});
