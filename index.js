document.addEventListener("DOMContentLoaded", () => {
  const sounds = {
    w: "sounds/tom-1.mp3",
    a: "sounds/tom-2.mp3",
    s: "sounds/tom-3.mp3",
    d: "sounds/tom-4.mp3",
    j: "sounds/crash.mp3",
    k: "sounds/kick-bass.mp3",
    l: "sounds/snare.mp3",
  };

  // Preload sounds
  const audioCache = {};
  for (const key in sounds) {
    audioCache[key] = new Audio(sounds[key]);
  }

  const drums = document.querySelectorAll(".drum");
  const recorderDisplay = document.getElementById("recorder-display");
  const recordBtn = document.getElementById("record-btn");
  const stopBtn = document.getElementById("stop-btn");
  const playBtn = document.getElementById("play-btn");
  const visualizer = document.getElementById("visualizer");

  // Generate visualizer bars dynamically
  for (let i = 0; i < 20; i++) {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    visualizer.appendChild(bar);
  }
  const bars = document.querySelectorAll(".bar");

  let isRecording = false;
  let recordingStartTime = 0;
  let recordedSequence = [];

  // Play sound
  function playSound(key) {
    if (audioCache[key]) {
      const audio = audioCache[key].cloneNode(); // allows overlapping
      audio.play();
    }
  }

  // Drum animation
  function animateDrum(drum) {
    drum.classList.add("pressed");
    setTimeout(() => drum.classList.remove("pressed"), 100);
  }

  // Visualizer animation
  function animateVisualizer() {
    bars.forEach(bar => {
      bar.style.height = `${Math.random() * 100}px`;
    });
    requestAnimationFrame(animateVisualizer);
  }
  animateVisualizer();

  // Record handling
  function handleRecording(key) {
    if (isRecording) {
      const timestamp = Date.now() - recordingStartTime;
      recordedSequence.push({ key, timestamp });
      recorderDisplay.textContent = `Recording... ${recordedSequence.length} sounds`;
    }
  }

  // Drum click/touch
  drums.forEach(drum => {
    ["click", "touchstart"].forEach(evt => {
      drum.addEventListener(evt, e => {
        e.preventDefault();
        const key = drum.dataset.key;
        playSound(key);
        animateDrum(drum);
        handleRecording(key);
      });
    });
  });

  // Keyboard
  document.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();
    const drum = document.querySelector(`.drum[data-key="${key}"]`);
    if (drum) {
      playSound(key);
      animateDrum(drum);
      handleRecording(key);
    }
  });

  // Record button
  recordBtn.addEventListener("click", () => {
    isRecording = true;
    recordingStartTime = Date.now();
    recordedSequence = [];
    recorderDisplay.textContent = "Recording... 0 sounds";
    recordBtn.disabled = true;
    stopBtn.disabled = false;
    playBtn.disabled = true;
  });

  stopBtn.addEventListener("click", () => {
    isRecording = false;
    recorderDisplay.textContent = `Recording complete! ${recordedSequence.length} sounds`;
    recordBtn.disabled = false;
    stopBtn.disabled = true;
    playBtn.disabled = recordedSequence.length === 0;
  });

  playBtn.addEventListener("click", () => {
    if (recordedSequence.length === 0) return;
    recorderDisplay.textContent = "Playing recording...";
    playBtn.disabled = true;
    recordedSequence.forEach((sound, i) => {
      setTimeout(() => {
        playSound(sound.key);
        const drum = document.querySelector(`.drum[data-key="${sound.key}"]`);
        if (drum) animateDrum(drum);
        if (i === recordedSequence.length - 1) {
          setTimeout(() => {
            recorderDisplay.textContent = `Recording complete! ${recordedSequence.length} sounds`;
            playBtn.disabled = false;
          }, 500);
        }
      }, sound.timestamp);
    });
  });
});
