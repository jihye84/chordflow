import * as Tone from 'tone';

let synth = null;
let initialized = false;

export const initAudio = async () => {
  if (initialized) return;
  await Tone.start();
  
  // Create a warm, electric piano like sound
  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: "triangle8" // Warm triangle wave with partials
    },
    envelope: {
      attack: 0.05,
      decay: 0.3,
      sustian: 0.4,
      release: 1.2,
    },
    volume: -8
  }).toDestination();
  
  // Add a little reverb to make it sound richer
  const reverb = new Tone.Reverb({
    decay: 2.5,
    preDelay: 0.01,
    wet: 0.3
  }).toDestination();
  
  synth.connect(reverb);
  
  initialized = true;
};

export const playChord = async (notes, duration = "2n") => {
  if (!initialized) {
    await initAudio();
  }
  
  // Make sure Tone Context is active
  if (Tone.context.state !== 'running') {
    await Tone.context.resume();
  }

  synth.triggerAttackRelease(notes, duration);
};

export const playProgression = async (chords, onChordPlay, bpm = 90, playStyle = 'block') => {
  if (!initialized) {
    await initAudio();
  }
  
  if (Tone.context.state !== 'running') {
    await Tone.context.resume();
  }

  Tone.Transport.cancel(); // Clear previous events
  Tone.Transport.stop();   // Reset transport position to 0

  // 1 measure = 4 beats. duration of 1 measure in seconds = (60 / bpm) * 4
  const beatDuration = 60 / bpm;
  const durationPerChord = beatDuration * 4;

  chords.forEach((chord, i) => {
    const time = i * durationPerChord;
    
    Tone.Transport.schedule((t) => {
      // Schedule the callback for UI update synced with audio
      Tone.Draw.schedule(() => {
        if (onChordPlay) onChordPlay(i);
      }, t);

      if (playStyle === 'arpeggio') {
        // Play notes sequentially over the chord duration
        // We will space them out. For example, 4 notes over 4 beats:
        const notes = chord.notes;
        const noteDuration = durationPerChord / notes.length;
        notes.forEach((note, noteIdx) => {
          synth.triggerAttackRelease(note, noteDuration - 0.05, t + (noteIdx * noteDuration));
        });
      } else {
        // Default Block chords
        synth.triggerAttackRelease(chord.notes, durationPerChord - 0.1, t);
      }
    }, time);
  });
  
  Tone.Transport.start();
  
  // Return the total duration so the UI knows when it's done
  return chords.length * durationPerChord;
};

export const stopAudio = () => {
  if (synth) {
    synth.releaseAll();
  }
  Tone.Transport.stop();
  Tone.Transport.cancel(); // Clear scheduled events
}
