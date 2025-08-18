document.addEventListener('DOMContentLoaded', function() {
      // Sound files
      const sounds = {
        w: 'sounds/tom-1.mp3',
        a: 'sounds/tom-2.mp3',
        s: 'sounds/tom-3.mp3',
        d: 'sounds/tom-4.mp3',
        j: 'sounds/crash.mp3',
        k: 'sounds/kick-bass.mp3',
        l: 'sounds/snare.mp3'
      };
      
      // Audio cache
      const audioCache = {};
      
      // Preload audio
      for (const key in sounds) {
        audioCache[key] = new Audio(sounds[key]);
      }
      
      // Get DOM elements
      const drums = document.querySelectorAll('.drum');
      const visualizerBars = document.querySelectorAll('.bar');
      const recorderDisplay = document.getElementById('recorder-display');
      const recordBtn = document.getElementById('record-btn');
      const stopBtn = document.getElementById('stop-btn');
      const playBtn = document.getElementById('play-btn');
      
      // Recording state
      let isRecording = false;
      let recordingStartTime = 0;
      let recordedSequence = [];
      
      // Create ripple effect
      function createRipple(event) {
        const drum = event.currentTarget;
        const rect = drum.getBoundingClientRect();
        
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        ripple.style.width = Math.max(rect.width, rect.height) + 'px';
        ripple.style.height = Math.max(rect.width, rect.height) + 'px';
        ripple.style.left = (event.clientX - rect.left - ripple.offsetWidth / 2) + 'px';
        ripple.style.top = (event.clientY - rect.top - ripple.offsetHeight / 2) + 'px';
        
        drum.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      }
      
      // Play sound function
      function playSound(key) {
        if (audioCache[key]) {
          const audio = new Audio(sounds[key]);
          audio.play();
          
          // Visual feedback for the specific key
          const keyItem = Array.from(document.querySelectorAll('.key-item'))[
            ['w', 'a', 's', 'd', 'j', 'k', 'l'].indexOf(key)
          ];
          if (keyItem) {
            keyItem.style.background = 'rgba(218, 4, 99, 0.3)';
            setTimeout(() => {
              keyItem.style.background = '';
            }, 200);
          }
        }
      }
      
      // Animate drum
      function animateDrum(drum) {
        drum.classList.add('pressed');
        setTimeout(() => {
          drum.classList.remove('pressed');
        }, 100);
      }
      
      // Animate visualizer
      function animateVisualizer() {
        visualizerBars.forEach(bar => {
          const randomHeight = Math.floor(Math.random() * 60) + 10;
          bar.style.height = `${randomHeight}px`;
          bar.style.backgroundColor = `hsl(${Math.floor(Math.random() * 60) + 300}, 100%, 65%)`;
        });
        
        setTimeout(animateVisualizer, 120);
      }
      
      // Add event listeners to drums
      drums.forEach(drum => {
        drum.addEventListener('click', function(e) {
          createRipple(e);
          const key = this.getAttribute('data-key');
          playSound(key);
          animateDrum(this);
          
          // Record if recording
          if (isRecording) {
            const timestamp = Date.now() - recordingStartTime;
            recordedSequence.push({key, timestamp});
            recorderDisplay.textContent = `Recording... ${recordedSequence.length} sounds`;
          }
        });
      });
      
      // Keyboard event listener
      document.addEventListener('keydown', function(e) {
        const key = e.key.toLowerCase();
        if (sounds[key]) {
          playSound(key);
          const drum = document.querySelector(`.drum[data-key="${key}"]`);
          if (drum) animateDrum(drum);
          
          // Record if recording
          if (isRecording) {
            const timestamp = Date.now() - recordingStartTime;
            recordedSequence.push({key, timestamp});
            recorderDisplay.textContent = `Recording... ${recordedSequence.length} sounds`;
          }
        }
      });
      
      // Start recording
      recordBtn.addEventListener('click', function() {
        isRecording = true;
        recordingStartTime = Date.now();
        recordedSequence = [];
        recorderDisplay.textContent = "Recording... 0 sounds";
        recorderDisplay.classList.add('recording');
        recordBtn.disabled = true;
        stopBtn.disabled = false;
        playBtn.disabled = true;
      });
      
      // Stop recording
      stopBtn.addEventListener('click', function() {
        isRecording = false;
        recorderDisplay.textContent = `Recording complete! ${recordedSequence.length} sounds`;
        recorderDisplay.classList.remove('recording');
        recordBtn.disabled = false;
        stopBtn.disabled = true;
        playBtn.disabled = recordedSequence.length === 0;
      });
      
      // Play recording
      playBtn.addEventListener('click', function() {
        if (recordedSequence.length === 0) return;
        
        recorderDisplay.textContent = "Playing recording...";
        playBtn.disabled = true;
        
        recordedSequence.forEach((sound, index) => {
          setTimeout(() => {
            playSound(sound.key);
            const drum = document.querySelector(`.drum[data-key="${sound.key}"]`);
            if (drum) animateDrum(drum);
            
            if (index === recordedSequence.length - 1) {
              setTimeout(() => {
                recorderDisplay.textContent = `Recording complete! ${recordedSequence.length} sounds`;
                playBtn.disabled = false;
              }, 500);
            }
          }, sound.timestamp);
        });
      });
      
      // Start visualizer animation
      animateVisualizer();
    });