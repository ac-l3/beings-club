"use client";

import React, { useState, useRef, useEffect } from 'react';
import { sdk } from "@farcaster/frame-sdk";

// Responsive positions for stars/explosions based on your reference image
const ICONS = [
  // Each entry: { src, alt, left, top, comment }
  {
    src: "/pp0503-47.png", // star
    alt: "star",
    left: "16vw",
    top: "61vh",
    comment: "Bottom far left star"
  },
  {
    src: "/pp0503-48.png", // explosion
    alt: "explosion",
    left: "15vw",
    top: "90vh",
    comment: "Bottom left explosion"
  },
  {
    src: "/pp0503-47.png", // star
    alt: "star",
    left: "32vw",
    top: "80vh",
    comment: "Left center star"
  },
  {
    src: "/pp0503-47.png", // star
    alt: "star",
    left: "50vw",
    top: "70vh",
    comment: "Center bottom star"
  },
  {
    src: "/pp0503-47.png", // star
    alt: "star",
    left: "83vw",
    top: "60vh",
    comment: "Right center star"
  },
  {
    src: "/pp0503-48.png", // explosion
    alt: "explosion",
    left: "64vw",
    top: "84vh",
    comment: "Bottom right explosion"
  },
  {
    src: "/pp0503-47.png", // star
    alt: "star",
    left: "84vw",
    top: "90vh",
    comment: "Bottom far right star"
  }
];

const HOLD_DURATION = 700; // ms

export default function BeingsClubWelcome() {
  const [revealed, setRevealed] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const holdTimeout = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [isWarping, setIsWarping] = useState(false);
  // Quadrant click state
  const [quadrantsClicked, setQuadrantsClicked] = useState([false, false, false, false]);
  const [hasAutoRevealed, setHasAutoRevealed] = useState(false);
  // Flash state
  const [flash, setFlash] = useState<{ color: string; visible: boolean } | null>(null);
  // Quadrant colors
  const quadrantColors = ["#FD3D44", "#3F3FFC", "#009245", "#FF7BAC"];
  // Quadrant sounds
  const quadrantSounds = [
    "/sounds/red.wav",
    "/sounds/blue.wav",
    "/sounds/green.wav",
    "/sounds/pink.wav"
  ];
  // Audio unlock state
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  useEffect(() => {
    sdk.actions.ready();

    // Only allow scroll up (decrease progress) until auto-reveal
    const handleScroll = (e: WheelEvent) => {
      if (!hasAutoRevealed && !revealed) {
        // Only allow scroll up
        if (e.deltaY < 0) {
          const newProgress = Math.max(scrollProgress + e.deltaY * 0.002, 0);
          setScrollProgress(newProgress);
          if (newProgress <= 0) setRevealed(false);
        }
        return;
      }
      // After auto-reveal, allow normal scroll
      const newProgress = Math.min(Math.max(scrollProgress + e.deltaY * 0.002, 0), 1);
      setScrollProgress(newProgress);
      if (newProgress >= 1) setRevealed(true);
      else if (newProgress <= 0) setRevealed(false);
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart(e.touches[0].clientY);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (touchStart === null) return;
      const currentY = e.touches[0].clientY;
      const deltaY = touchStart - currentY;
      if (!hasAutoRevealed && !revealed) {
        // Only allow scroll up
        if (deltaY < 0) {
          const newProgress = Math.max(scrollProgress + deltaY * 0.005, 0);
          setScrollProgress(newProgress);
          if (newProgress <= 0) setRevealed(false);
        }
        return;
      }
      // After auto-reveal, allow normal scroll
      const newProgress = Math.min(Math.max(scrollProgress + deltaY * 0.005, 0), 1);
      setScrollProgress(newProgress);
      if (newProgress >= 1) setRevealed(true);
      else if (newProgress <= 0) setRevealed(false);
    };
    const handleTouchEnd = () => {
      setTouchStart(null);
    };
    window.addEventListener('wheel', handleScroll);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [revealed, scrollProgress, touchStart, hasAutoRevealed]);

  const animateProgress = (timestamp: number) => {
    if (!pressing || revealed) return;
    if (startTimeRef.current === null) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;
    const prog = Math.min(elapsed / HOLD_DURATION, 1);
    if (prog < 1) {
      rafRef.current = requestAnimationFrame(animateProgress);
    }
  };

  const handlePress = () => {
    setPressing(true);
    setIsWarping(true);
    startTimeRef.current = null;
    rafRef.current = requestAnimationFrame(animateProgress);
    holdTimeout.current = setTimeout(() => {
      setRevealed(true);
      setPressing(false);
    }, HOLD_DURATION);
  };

  const handleRelease = () => {
    setPressing(false);
    if (holdTimeout.current) clearTimeout(holdTimeout.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startTimeRef.current = null;
    setIsWarping(false);
  };

  // Transparent unlock button handler
  const handleUnlockAudio = async () => {
    try {
      // Create a silent audio buffer and play it
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      setAudioUnlocked(true);
    } catch (e) {
      // fallback: try to play a silent HTML5 audio
      const silent = new window.Audio();
      silent.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
      silent.play();
      setAudioUnlocked(true);
    }
  };

  // Toggle audio on/off
  const handleToggleAudio = () => {
    if (!audioUnlocked) {
      handleUnlockAudio();
    } else {
      setAudioUnlocked(false);
    }
  };

  // Quadrant click handler
  const handleQuadrantClick = (idx: number) => {
    // Play sound only if audio is unlocked
    if (audioUnlocked) {
      const audio = new window.Audio(quadrantSounds[idx]);
      audio.currentTime = 0;
      audio.play();
    }
    // Flash color
    setFlash({ color: quadrantColors[idx], visible: true });
    setTimeout(() => setFlash(f => f && { ...f, visible: false }), 120); // quick in
    setTimeout(() => setFlash(null), 120 + 1200); // slow, chic fade out
    // Mark as clicked
    setQuadrantsClicked(prev => {
      if (prev[idx]) return prev;
      const updated = prev.map((v, i) => (i === idx ? true : v));
      // If all four clicked and not yet auto-revealed, reveal
      if (updated.every(Boolean) && !hasAutoRevealed) {
        setTimeout(() => {
          setRevealed(true);
          setHasAutoRevealed(true);
          setScrollProgress(1);
        }, 400); // slight delay for last flash
      }
      return updated;
    });
  };

  return (
    <div
      style={{
        background: "#F1ECCE",
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        fontFamily: "monospace",
        overflow: "hidden",
        transition: "filter 1.4s cubic-bezier(.4,2,.6,1), transform 1.4s cubic-bezier(.4,2,.6,1)",
        filter: isWarping ? "blur(8px) brightness(1.2)" : "none",
        transform: isWarping ? "scale(1.04)" : "none",
      }}
    >
      {/* Color flash overlay */}
      {flash && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: flash.color,
            opacity: flash.visible ? 1 : 0,
            pointerEvents: "none",
            transition: "opacity 1.2s cubic-bezier(.77,0,.18,1)",
            zIndex: 100,
          }}
        />
      )}
      {/* First screen: Initial message + quadrant overlay */}
      <div
        style={{
          opacity: revealed ? 0 : 1,
          pointerEvents: revealed ? 'none' : 'auto',
          transition: 'opacity 0.5s, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          transform: `translateY(${-scrollProgress * 100}%)`,
          filter: `blur(${scrollProgress * 10}px)`,
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "#111",
            fontWeight: "bold",
            fontSize: "1.05rem",
            lineHeight: 1.4,
            maxWidth: "80%",
            animation: "bounce 2s ease-in-out infinite",
            animationDelay: "0s"
          }}
        >
          Beings are gathering soon.
        </div>
        {/* Quadrant overlay */}
        <div style={{ position: "absolute", inset: 0, width: "100vw", height: "100vh", zIndex: 10 }}>
          {/* Top left */}
          <div
            onClick={() => handleQuadrantClick(0)}
            style={{ position: "absolute", left: 0, top: 0, width: "50vw", height: "50vh", cursor: "pointer", background: "transparent" }}
          />
          {/* Top right */}
          <div
            onClick={() => handleQuadrantClick(1)}
            style={{ position: "absolute", left: "50vw", top: 0, width: "50vw", height: "50vh", cursor: "pointer", background: "transparent" }}
          />
          {/* Bottom left */}
          <div
            onClick={() => handleQuadrantClick(2)}
            style={{ position: "absolute", left: 0, top: "50vh", width: "50vw", height: "50vh", cursor: "pointer", background: "transparent" }}
          />
          {/* Bottom right */}
          <div
            onClick={() => handleQuadrantClick(3)}
            style={{ position: "absolute", left: "50vw", top: "50vh", width: "50vw", height: "50vh", cursor: "pointer", background: "transparent" }}
          />
        </div>
      </div>

      {/* Portal effect overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, var(--background) 70%)',
          opacity: scrollProgress,
          transform: `scale(${1 + scrollProgress * 0.2})`,
          transition: 'opacity 0.3s, transform 0.3s',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Second screen: Invitation revealed */}
      <div
        style={{
          opacity: revealed ? 1 : 0,
          pointerEvents: revealed ? 'auto' : 'none',
          transition: 'opacity 0.5s, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateRows: '1fr 1fr 1fr 1fr 1fr 1fr',
          height: '100vh',
          width: '100vw',
          alignItems: 'center',
          justifyItems: 'center',
          zIndex: 3,
          transform: `translateY(${(1 - scrollProgress) * 100}%)`,
        }}
      >
        {/* Row 1: empty for spacing */}
        <div />
        {/* Row 2: Event text */}
        <div
          style={{
            position: "absolute",
            top: "20vh",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            width: "100vw",
            zIndex: 2,
            color: "#111"
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1.05rem",
              color: "#111",
              lineHeight: 1.25,
              animation: "bounceSmall 2.3s ease-in-out infinite",
              animationDelay: "0.7s"
            }}
          >
            May 18th, 8pm UTC
            <br />
            That&apos;s when it starts.
          </div>
        </div>
        {/* Row 3: empty for spacing */}
        <div />
        {/* Row 4: Character and Share Button */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50vh",
            transform: "translate(-40%, 0)",
            zIndex: 2,
            width: "100px",
            height: "100px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            animation: "bounceSmall 2.1s ease-in-out infinite",
            animationDelay: "0.3s"
          }}
        >
          {/* Character (bean1) - easily movable in all directions */}
          <div
            style={{
              position: "absolute",
              width: "54px",
              height: "54px",
              transform: "translate(-50%, -50%)", // Center the character
              left: "-10%", // Center horizontally
              top: "-8%", // Center vertically
              zIndex: 2,
            }}
          >
            <img
              src="/pp0503-45.png"
              alt="bean1"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>
          {/* Circle with SHARE */}
          <div
            style={{
              position: "relative",
              width: "80px",
              height: "80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "-110px"
            }}
          >
            <img
              src="/pp0503-46.png"
              alt="circle-line1"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                position: "absolute",
                zIndex: 1,
              }}
            />
            <span
              style={{
                position: "relative",
                zIndex: 3,
                fontWeight: "bold",
                fontSize: "1rem",
                color: "#111",
                letterSpacing: 0,
                marginTop: "2px",
              }}
            >
              SHARE
            </span>
          </div>
        </div>
        {/* Row 5: empty for spacing */}
        <div />
        {/* Row 6: Stars, Explosions, and /beingsclub absolutely positioned over the full viewport */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 10 }}>
          {/* Grid reference: 8 columns x 12 rows */}
          {ICONS.map((icon, i) => {
            // Randomize duration between 7s and 12s
            const duration = 7 + Math.random() * 5;
            return (
              <img
                key={i}
                src={icon.src}
                alt={icon.alt}
                style={{
                  position: "absolute",
                  left: icon.left,
                  top: icon.top,
                  width: "12px",
                  height: "12px",
                  zIndex: 1,
                  animation: `soft-blink ${duration}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * duration}s`,
                }}
                data-comment={icon.comment}
              />
            );
          })}
          {/* /beingsclub text in lower left, aligned to grid */}
          <a
            href="https://warpcast.com/~/channel/beings-club"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: "absolute",
              left: "50%",
              bottom: "5vh",
              transform: "translateX(-50%)",
              fontSize: "1rem",
              color: "#111",
              opacity: 1,
              fontFamily: "monospace",
              letterSpacing: "0.01em",
              fontWeight: "bold",
              zIndex: 9999,
              textDecoration: "none",
              pointerEvents: "auto",
            }}
          >
            /beings-club
          </a>
        </div>
      </div>

      {/* Audio toggle button (top right) */}
      <button
        aria-label={audioUnlocked ? "Turn sound off" : "Turn sound on"}
        onClick={handleToggleAudio}
        style={{
          position: "fixed",
          top: 12,
          right: 12,
          width: 36,
          height: 36,
          opacity: 0.32,
          zIndex: 200,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <img
          src={audioUnlocked ? "/sound-on.png" : "/sound-off.png"}
          alt={audioUnlocked ? "Sound on" : "Sound off"}
          style={{ width: 32, height: 32, display: "block" }}
        />
      </button>
    </div>
  );
}

const bounceKeyframes = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes bounceSmall {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
`;

// Add the keyframes to the document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = bounceKeyframes;
  document.head.appendChild(style);
}
