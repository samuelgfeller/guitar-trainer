let mediaRecorder;
let chunks = [];
let audioContext;
let analyser;
let dataArray;
let isRecording = false;
let stringFrequencies = []; // Array to store the known frequencies of open guitar strings
let currentStringIndex = 0; // Index to keep track of the current string being calibrated

// Create an AudioContext
audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Create an AnalyserNode to analyze the frequency spectrum
analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
dataArray = new Uint8Array(bufferLength);

// Function to handle the start button click event
function handleStartButtonClick() {
  // Check if already recording
  if (isRecording) {
    console.log('Already recording.');
    return;
  }

  // Start the microphone audio input
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
      // Create a MediaRecorder to record the audio stream
      mediaRecorder = new MediaRecorder(stream);

      // Connect the MediaStream to the AudioContext
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // Start recording and set the flag
      mediaRecorder.start();
      isRecording = true;

      // Call the analyzeFrequency function continuously
      analyzeFrequency();
    })
    .catch(function (err) {
      console.error('Error accessing microphone:', err);
    });
}

// Function to handle the stop button click event
function handleStopButtonClick() {
  // Check if not currently recording
  if (!isRecording) {
    console.log('Not recording.');
    return;
  }

  // Stop recording and reset the flag
  mediaRecorder.stop();
  isRecording = false;

  // Clear the existing recorded data chunks
  chunks = [];

  // Stop the microphone audio input
  const tracks = mediaRecorder.stream.getTracks();
  tracks.forEach(function (track) {
    track.stop();
  });

  // Disconnect the nodes
  analyser.disconnect();
}

// Function to analyze the frequency data
function analyzeFrequency() {
  analyser.getByteFrequencyData(dataArray);
  const maxFrequency = Math.max(...dataArray);
  const maxFrequencyIndex = dataArray.indexOf(maxFrequency);

  // Calculate the frequency corresponding to the maxFrequencyIndex
  const nyquist = audioContext.sampleRate / 2;
  const frequency = maxFrequencyIndex * (nyquist / dataArray.length);

  // Determine the note based on the frequency using calibration
  const note = calculateNoteFromFrequency(frequency);

  // Update the note output element
  const noteOutput = document.getElementById('noteOutput');
  noteOutput.textContent = 'Detected Note: ' + note;

  // Call the analyzeFrequency function recursively if still recording
  if (isRecording) {
    requestAnimationFrame(analyzeFrequency);
  }
}

// Function to calculate the note from frequency
function calculateNoteFromFrequency(frequency) {
  // Find the closest known frequency to the detected frequency
  const closestFrequency = stringFrequencies.reduce(function (prev, curr) {
    return Math.abs(curr - frequency) < Math.abs(prev - frequency) ? curr : prev;
  });

  const A4Frequency = closestFrequency; // Use the closest known frequency as reference
  const noteNames = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

  const semitoneOffset = 69 + 12 * Math.log2(frequency / A4Frequency);
  const noteIndex = Math.round(semitoneOffset) % 12;
  const octave = Math.floor(semitoneOffset / 12) - 1;

  return noteNames[noteIndex] + octave;
}

// Function to calibrate the open string frequencies
function calibrateStringFrequencies() {
  const strings = ['E', 'A', 'D', 'G', 'B', 'E'];
  const noteOutput = document.getElementById('noteOutput');

  function playString(index) {
    noteOutput.textContent = 'Play open ' + strings[index] + ' string';
  }

  function recordFrequency(frequency) {
    stringFrequencies.push(frequency);

    if (stringFrequencies.length === strings.length) {
      noteOutput.textContent = 'Calibration complete';
      startButton.disabled = false; // Enable the start button after calibration
    } else {
      currentStringIndex++;
      playString(currentStringIndex);
    }
  }

  function detectFrequency() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    const maxFrequency = Math.max(...dataArray);
    const maxFrequencyIndex = dataArray.indexOf(maxFrequency);
    const nyquist = audioContext.sampleRate / 2;
    const frequency = maxFrequencyIndex * (nyquist / bufferLength);

    if (frequency > 0) {
      recordFrequency(frequency);
    } else {
      requestAnimationFrame(detectFrequency);
    }
  }

  playString(currentStringIndex);
  detectFrequency();
}

// Attach click event listeners to the buttons
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
startButton.addEventListener('click', handleStartButtonClick);
stopButton.addEventListener('click', handleStopButtonClick);

// Call the calibrateStringFrequencies function to start the calibration process
calibrateStringFrequencies();
