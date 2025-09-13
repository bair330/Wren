'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';

interface AudioControlsProps {
  onPlayStateChange?: (isPlaying: boolean) => void;
  className?: string;
}

type SoundType = {
  id: string;
  name: string;
  url: string;
  duration?: number;
};

// Meditation sound options (using Web Audio API generated sounds for demo)
const MEDITATION_SOUNDS: SoundType[] = [
  { id: 'rain', name: 'Rain', url: 'rain' },
  { id: 'ocean', name: 'Ocean Waves', url: 'ocean' },
  { id: 'forest', name: 'Forest', url: 'forest' },
  { id: 'white-noise', name: 'White Noise', url: 'white-noise' },
  { id: 'singing-bowl', name: 'Singing Bowl', url: 'singing-bowl' },
];

export default function AudioControls({ onPlayStateChange, className = '' }: AudioControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentSoundIndex, setCurrentSoundIndex] = useState(0);
  const [showSoundSelector, setShowSoundSelector] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const noiseBufferRef = useRef<AudioBuffer | null>(null);

  // Initialize Web Audio API
  useEffect(() => {
    const initAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
        gainNodeRef.current.gain.value = volume;
        
        // Create noise buffer for white noise and nature sounds
        const bufferSize = audioContextRef.current.sampleRate * 2;
        noiseBufferRef.current = audioContextRef.current.createBuffer(1, bufferSize, audioContextRef.current.sampleRate);
        const output = noiseBufferRef.current.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
      } catch (error) {
        console.log('Web Audio API not supported:', error);
      }
    };
    
    initAudio();
    
    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (e) {}
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const generateSound = (soundType: string) => {
    if (!audioContextRef.current || !gainNodeRef.current) return;
    
    // Stop current sound
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (e) {}
    }
    
    switch (soundType) {
      case 'rain':
      case 'ocean':
      case 'forest':
      case 'white-noise':
        // Generate filtered noise for nature sounds
        const noiseSource = audioContextRef.current.createBufferSource();
        noiseSource.buffer = noiseBufferRef.current;
        noiseSource.loop = true;
        
        const filter = audioContextRef.current.createBiquadFilter();
        filter.type = 'lowpass';
        
        // Different filter settings for different sounds
        switch (soundType) {
          case 'rain':
            filter.frequency.value = 1000;
            break;
          case 'ocean':
            filter.frequency.value = 500;
            break;
          case 'forest':
            filter.frequency.value = 2000;
            break;
          case 'white-noise':
            filter.frequency.value = 8000;
            break;
        }
        
        noiseSource.connect(filter);
        filter.connect(gainNodeRef.current);
        noiseSource.start();
        oscillatorRef.current = noiseSource as any;
        break;
        
      case 'singing-bowl':
        // Generate a singing bowl-like tone
        const oscillator = audioContextRef.current.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(220, audioContextRef.current.currentTime);
        
        // Add some modulation for a more realistic sound
        const lfo = audioContextRef.current.createOscillator();
        const lfoGain = audioContextRef.current.createGain();
        lfo.frequency.value = 2;
        lfoGain.gain.value = 10;
        
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        
        oscillator.connect(gainNodeRef.current);
        oscillator.start();
        lfo.start();
        
        oscillatorRef.current = oscillator;
        break;
    }
  };

  const handlePlay = async () => {
    if (!audioContextRef.current) return;
    
    try {
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      if (!isPlaying) {
        generateSound(MEDITATION_SOUNDS[currentSoundIndex].url);
        setIsPlaying(true);
        onPlayStateChange?.(true);
      } else {
        if (oscillatorRef.current) {
          try {
            oscillatorRef.current.stop();
          } catch (e) {}
        }
        setIsPlaying(false);
        onPlayStateChange?.(false);
      }
    } catch (error) {
      console.log('Audio play error:', error);
    }
  };

  const handlePrevious = () => {
    const newIndex = currentSoundIndex > 0 ? currentSoundIndex - 1 : MEDITATION_SOUNDS.length - 1;
    setCurrentSoundIndex(newIndex);
    if (isPlaying) {
      generateSound(MEDITATION_SOUNDS[newIndex].url);
    }
  };

  const handleNext = () => {
    const newIndex = currentSoundIndex < MEDITATION_SOUNDS.length - 1 ? currentSoundIndex + 1 : 0;
    setCurrentSoundIndex(newIndex);
    if (isPlaying) {
      generateSound(MEDITATION_SOUNDS[newIndex].url);
    }
  };

  const handleSoundSelect = (index: number) => {
    setCurrentSoundIndex(index);
    setShowSoundSelector(false);
    if (isPlaying) {
      generateSound(MEDITATION_SOUNDS[index].url);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-green-400">Meditation Sounds</h3>
        <button
          onClick={() => setShowSoundSelector(!showSoundSelector)}
          className="text-sm text-gray-400 hover:text-green-400 transition-colors"
        >
          {MEDITATION_SOUNDS[currentSoundIndex].name}
        </button>
      </div>

      {/* Sound Selector */}
      {showSoundSelector && (
        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
          <div className="grid grid-cols-1 gap-2">
            {MEDITATION_SOUNDS.map((sound, index) => (
              <button
                key={sound.id}
                onClick={() => handleSoundSelect(index)}
                className={`px-3 py-2 text-left rounded transition-colors ${
                  index === currentSoundIndex
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:bg-gray-600'
                }`}
              >
                {sound.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Controls */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <button
          onClick={handlePrevious}
          className="p-2 text-gray-400 hover:text-green-400 transition-colors"
          title="Previous sound"
        >
          <SkipBack className="w-5 h-5" />
        </button>
        
        <button
          onClick={handlePlay}
          className="flex items-center justify-center w-12 h-12 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
        
        <button
          onClick={handleNext}
          className="p-2 text-gray-400 hover:text-green-400 transition-colors"
          title="Next sound"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Volume Controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleMute}
          className="text-gray-400 hover:text-green-400 transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        
        <span className="text-sm text-gray-400 w-8">
          {Math.round(volume * 100)}
        </span>
      </div>

      {/* Status */}
      <div className="mt-3 text-center">
        <p className="text-sm text-gray-500">
          {isPlaying ? (
            <span className="text-green-400">♪ Playing: {MEDITATION_SOUNDS[currentSoundIndex].name}</span>
          ) : (
            'Click play to start meditation sounds'
          )}
        </p>
      </div>
    </div>
  );
}