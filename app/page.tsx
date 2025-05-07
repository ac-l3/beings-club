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

// Set the scroll distance multiplier for a longer journey
const SCROLL_DISTANCE = 4; // 4x longer than before

// Easing function for scroll progress
function easeInOutCubic(x: number) {
  return x < 0.5
    ? 4 * x * x * x
    : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export default function BeingsClubWelcome() {
  const [revealed, setRevealed] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const holdTimeout = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [isWarping, setIsWarping] = useState(false);

  useEffect(() => {
    sdk.actions.ready();

    const handleScroll = (e: WheelEvent) => {
      // Allow back and forth travel
      // Make the scroll journey longer
      const newProgress = Math.min(Math.max(scrollProgress + e.deltaY * 0.002 / SCROLL_DISTANCE, 0), 1);
      setScrollProgress(newProgress);
      if (newProgress >= 1) {
        setRevealed(true);
      } else if (newProgress < 1) {
        setRevealed(false);
      }
    };

    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
  }, [revealed, scrollProgress]);

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

  // Use eased progress for all animations
  const easedProgress = easeInOutCubic(scrollProgress);

  // Helper for staggered element arrival with only opacity and blur (no scale or Z)
  function getStaggeredFadeStyle(start: number, end: number, baseBlur = 10, finalBlur = 0, progressOverride?: number) {
    const prog = progressOverride !== undefined ? progressOverride : scrollProgress;
    const p = Math.min(Math.max((prog - start) / (end - start), 0), 1);
    return {
      opacity: p,
      filter: `blur(${baseBlur + (finalBlur - baseBlur) * p}px)`
    };
  }

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
        perspective: "1000px",
      }}
    >
      {/* First screen: Only the portal intro text */}
      <div
        style={{
          opacity: revealed || scrollProgress > 0 ? 0 : 1,
          pointerEvents: revealed || scrollProgress > 0 ? 'none' : 'auto',
          transition: 'opacity 0.5s, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          transform: `scale(${1 + scrollProgress * 2}) translateZ(${scrollProgress * 1000}px)`,
          filter: `blur(${scrollProgress * 5}px) brightness(${1 + scrollProgress})`,
        }}
      >
        <div
          style={{
            fontWeight: 'bold',
            fontSize: 22,
            color: '#111',
            textAlign: 'center',
            fontFamily: 'monospace',
            letterSpacing: 0,
            userSelect: 'none',
          }}
        >
          Beings are gathering soon.
        </div>
      </div>

      {/* Portal tunnel effect */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(
              circle at 50% 50%,
              transparent 0%,
              rgba(241, 236, 206, 0.1) 20%,
              rgba(241, 236, 206, 0.2) 40%,
              rgba(241, 236, 206, 0.3) 60%,
              rgba(241, 236, 206, 0.4) 80%,
              var(--background) 100%
            )
          `,
          opacity: easedProgress,
          transform: `
            scale(${1 + easedProgress * 0.7})
            rotate(${easedProgress * 360}deg)
            translateZ(${easedProgress * 500}px)
          `,
          transition: 'opacity 0.3s, transform 0.3s',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Second screen: Invitation revealed, with staggered elements */}
      <div
        style={{
          opacity: revealed ? 1 : scrollProgress,
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
        }}
      >
        {/* Row 1: empty for spacing */}
        <div />
        {/* Row 2: Event text (arrives 0.35-0.55) */}
        <div
          style={{
            position: "absolute",
            top: "15vh",
            left: "50%",
            width: "100vw",
            zIndex: 2,
            color: "#111",
            textAlign: "center",
            transform: "translateX(-50%)",
            ...getStaggeredFadeStyle(0.35, 0.55, 10, 0, easedProgress),
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1.05rem",
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
        {/* Row 4: Character and Share Button (arrives 0.55-0.75) */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "60vh",
            width: "100px",
            height: "100px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: "translate(-50%, 0)",
            ...getStaggeredFadeStyle(0.55, 0.75, 10, 0, easedProgress),
          }}
        >
          {/* Character (bean1) */}
          <div
            style={{
              position: "absolute",
              width: "54px",
              height: "54px",
              transform: "translate(-50%, -50%)",
              left: "45%",
              top: "-8%",
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
          {/* Staggered stars (arrive 0.15-0.45) */}
          {ICONS.map((icon, i) => {
            // Each star can have a slightly different arrival window for more depth
            const base = 0.15 + (i * 0.03);
            const end = 0.45 + (i * 0.03);
            const baseZ = -1200 + i * 120; // Stagger Z-depth for parallax
            const finalZ = 400; // Pass through the camera
            // Calculate progress for this star
            const p = Math.min(Math.max((easedProgress - base) / (end - base), 0), 1);
            // Z position for this star
            const z = baseZ + (finalZ - baseZ) * p;
            // Opacity: 1 when z < 0, fades to 0 as z > 0
            const opacity = z < 0 ? 1 : Math.max(1 - (z / 400), 0);
            // Scale: normal until z > 0, then scale up for whoosh
            const scale = z < 0 ? 1 : 1 + (z / 400) * 1.5;
            const style = {
              position: "absolute",
              left: icon.left,
              top: icon.top,
              width: "12px",
              height: "12px",
              zIndex: 1,
              animation: `soft-blink 8s ease-in-out infinite`,
              animationDelay: `${Math.random() * 8}s`,
              opacity,
              transform: `translateZ(${z}px) scale(${scale})`,
              filter: `blur(${10 * (1 - p)}px)`
            };
            return (
              <img
                key={i}
                src={icon.src}
                alt={icon.alt}
                style={style}
                data-comment={icon.comment}
              />
            );
          })}
          {/* /beingsclub text (arrives 0.8-1.0) */}
          <a
            href="https://warpcast.com/~/channel/beings-club"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: "absolute",
              left: "50%",
              bottom: "5vh",
              fontSize: "1rem",
              color: "#111",
              fontFamily: "monospace",
              letterSpacing: "0.01em",
              fontWeight: "bold",
              zIndex: 9999,
              textDecoration: "none",
              pointerEvents: "auto",
              transform: "translateX(-50%)",
              ...getStaggeredFadeStyle(0.8, 1.0, 10, 0, easedProgress),
            }}
          >
            /beings-club
          </a>
        </div>
      </div>
    </div>
  );
}
