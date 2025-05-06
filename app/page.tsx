"use client";

import React, { useState, useRef } from 'react';

// Responsive positions for stars/explosions based on your reference image
const ICONS = [
  // Each entry: { src, alt, left, top, comment }
  {
    src: "/pp0503-47.png", // star
    alt: "star",
    left: "16vw",
    top: "71vh",
    comment: "Bottom far left star"
  },
  {
    src: "/pp0503-48.png", // explosion
    alt: "explosion",
    left: "15vw",
    top: "94vh",
    comment: "Bottom left explosion"
  },
  {
    src: "/pp0503-47.png", // star
    alt: "star",
    left: "32vw",
    top: "85vh",
    comment: "Left center star"
  },
  {
    src: "/pp0503-47.png", // star
    alt: "star",
    left: "50vw",
    top: "75vh",
    comment: "Center bottom star"
  },
  {
    src: "/pp0503-47.png", // star
    alt: "star",
    left: "83vw",
    top: "70vh",
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
  const holdTimeout = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [isWarping, setIsWarping] = useState(false);

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

  return (
    <div
      style={{
        background: "var(--background)",
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
      {/* First screen: Press & Hold */}
      <div
        style={{
          opacity: revealed ? 0 : 1,
          pointerEvents: revealed ? 'none' : 'auto',
          transition: 'opacity 0.5s',
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "96px",
            height: "96px",
            margin: "0 auto",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            outline: "none"
          }}
          onMouseDown={handlePress}
          onMouseUp={handleRelease}
          onMouseLeave={handleRelease}
          onTouchStart={handlePress}
          onTouchEnd={handleRelease}
        >
          {/* Hand-drawn circle outline */}
          <img
            src="/pp0503-46.png"
            alt="circle-line1"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              position: "absolute",
              left: 0,
              top: 0,
              zIndex: 1,
              pointerEvents: "none"
            }}
          />
          {/* Centered text */}
          <span
            style={{
              position: "relative",
              zIndex: 2,
              fontWeight: "bold",
              fontSize: "0.9rem",
              color: "#111",
              lineHeight: 1.3,
              letterSpacing: 0,
              textAlign: "center",
              userSelect: "none",
              marginTop: "9px"
            }}
          >
            PRESS &<br />HOLD
          </span>
        </div>
      </div>

      {/* Second screen: Invitation revealed */}
      <div
        style={{
          opacity: revealed ? 1 : 0,
          pointerEvents: revealed ? 'auto' : 'none',
          transition: 'opacity 0.5s',
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateRows: '1fr 1fr 1fr 1fr 1fr 1fr',
          height: '100vh',
          width: '100vw',
          alignItems: 'center',
          justifyItems: 'center',
          zIndex: 3,
        }}
      >
        {/* Row 1: empty for spacing */}
        <div />
        {/* Row 2: Event text */}
        <div
          style={{
            position: "absolute",
            top: "30vh",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            width: "100vw",
            zIndex: 2,
            color: "#111"
          }}
        >
          <div style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 18 }}>
            Beings are gathering soon.
          </div>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1.3rem",
              color: "#111",
              lineHeight: 1.05
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
            top: "60vh",
            transform: "translate(-50%, 0)",
            zIndex: 2,
            width: "100px",
            height: "100px",
          }}
        >
          {/* Character (bean1) - absolutely positioned so feet touch the circle */}
          <img
            src="/pp0503-45.png"
            alt="bean1"
            style={{
              position: "absolute",
              left: "45%",
              top: "-52px", // Adjust this value for perfect feet alignment
              transform: "translateX(-50%)",
              width: "64px",
              height: "64px",
              zIndex: 2
            }}
          />
          {/* Circle with SHARE */}
          <img
            src="/pp0503-46.png"
            alt="circle-line1"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              position: "absolute",
              left: 0,
              top: 0,
              zIndex: 1
            }}
          />
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 3,
              fontWeight: "bold",
              fontSize: "1rem",
              color: "#111",
              letterSpacing: 0
            }}
          >
            SHARE
          </span>
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
                  width: "19.2px",
                  height: "19.2px",
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
              bottom: "4vh",
              transform: "translateX(-50%)",
              fontSize: "1.3rem",
              color: "#111",
              opacity: 0.8,
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
    </div>
  );
}
