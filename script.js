const fileInput = document.getElementById('file-input');
const fileSelectionContainer = document.getElementById('file-selection-container');
const videoContainer = document.getElementById('video-container');
const video = document.getElementById('video-player');
const videoSource = document.getElementById('video-source');
const muteStatus = document.getElementById('mute-status');

// Handle File Input
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0]; // Get the selected file
  if (file) {
    const fileURL = URL.createObjectURL(file); // Generate a URL for the selected file
    videoSource.src = fileURL; // Set the video source
    video.load(); // Load the new video

    // Hide file selection screen and show video player
    fileSelectionContainer.classList.add('hidden');
    videoContainer.classList.remove('hidden');

    video.play(); // Auto-play the video
  }
});

// Error Handling for Unsupported Video Formats
video.onerror = () => {
  alert("This video format is not supported by your browser.");
};

// Play/Pause Toggle on Space Key
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault(); // Prevent scrolling
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }
});

// Skip Backward 10 Seconds with Left Arrow
document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowLeft') {
    video.currentTime = Math.max(0, video.currentTime - 10); // Prevent negative time
  }
});

// Skip Forward 10 Seconds with Right Arrow
document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowRight') {
    video.currentTime = Math.min(video.duration, video.currentTime + 10); // Prevent exceeding duration
  }
});

// Rewind at 2x Speed While Holding Left Shift
document.addEventListener('keydown', (event) => {
  if (event.code === 'ShiftLeft') {
    video.playbackRate = 2.0; // Set playback rate to 2x
    video.play();
  }
});

// Fast Forward at 2x Speed While Holding Right Shift
document.addEventListener('keydown', (event) => {
  if (event.code === 'ShiftRight') {
    video.playbackRate = 2.0; // Set playback rate to 2x
    video.play();
  }
});

// Reset Playback Speed on Key Up
document.addEventListener('keyup', (event) => {
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    video.playbackRate = 1.0; // Reset to normal speed
  }
});

// Enforce 16:9 Aspect Ratio When Resized
const observer = new ResizeObserver(() => {
  const width = videoContainer.offsetWidth;
  const height = Math.round(width / (16 / 9)); // Calculate height for 16:9
  videoContainer.style.height = `${height}px`;
});
observer.observe(videoContainer);

// Handle volume up and down with arrow keys
document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowUp') {
    // Increase volume (max volume is 1)
    video.volume = Math.min(1, video.volume + 0.1); // Increase by 0.1 but not beyond 1
  } else if (event.code === 'ArrowDown') {
    // Decrease volume (min volume is 0)
    video.volume = Math.max(0, video.volume - 0.1); // Decrease by 0.1 but not below 0
  }
});

// Handle mute toggle with the 'M' key and display mute status
let muteTimeout;
document.addEventListener('keydown', (event) => {
  if (event.code === 'KeyM') {
    // Toggle mute
    video.muted = !video.muted;

    // Update the mute status display
    muteStatus.textContent = video.muted ? "Muted" : "Unmuted";
    muteStatus.style.display = "block"; // Show the text

    // Trigger fade animation
    muteStatus.style.animation = 'none'; // Reset the animation
    muteStatus.offsetHeight; // Trigger a reflow to restart the animation
    muteStatus.style.animation = 'fadeInOut 2s forwards'; // Apply animation

    // Clear and set a new timeout to hide mute status
    clearTimeout(muteTimeout);
    muteTimeout = setTimeout(() => {
      muteStatus.style.display = "none";
    }, 2000);
  }
});

// Fullscreen Toggle with the 'F' Key
document.addEventListener('keydown', (event) => {
  if (event.code === 'KeyF') {
    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
});
