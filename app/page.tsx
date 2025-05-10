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
  const holdTimeout = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [isWarping, setIsWarping] = useState(false);

  // === BEGIN: Button/Bean Position Controls ===
  // You can easily tweak these numbers to move the beans/buttons
  const GROUP_LEFT_OFFSET = -10; // px, negative = move group left, positive = right
  const MINIAPP_BEAN_LEFT = -15; // px, negative = left of button center
  const MINIAPP_BEAN_TOP = -49;   // px, negative = above button
  const MINIAPP_BTN_LEFT = -110;     // px, relative to group center
  const MINIAPP_BTN_TOP = -20;      // px

  const SHARE_BEAN_LEFT = -240;      // px, negative = left of button center
  const SHARE_BEAN_TOP = -77;     // px, negative = above button
  const SHARE_BTN_LEFT = -140;     // px, relative to group center
  const SHARE_BTN_TOP = 10;        // px
  // === END: Button/Bean Position Controls ===

  useEffect(() => {
    sdk.actions.ready();
    // Allow scroll up from the second screen to return to the main screen
    const handleScroll = (e: WheelEvent) => {
      if (revealed && e.deltaY < 0) {
        setRevealed(false);
      }
    };
    const handleTouchStart = (e: TouchEvent) => {
      (window as any)._touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (revealed && typeof (window as any)._touchStartY === 'number') {
        const deltaY = (window as any)._touchStartY - e.touches[0].clientY;
        if (deltaY < -20) { // swipe down
          setRevealed(false);
          (window as any)._touchStartY = undefined;
        }
      }
    };
    window.addEventListener('wheel', handleScroll);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [revealed]);

  const animateProgress = (timestamp: number) => {
    if (!pressing || revealed) return;
    if (startTimeRef.current === null) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;
    const prog = Math.min(elapsed / HOLD_DURATION, 1);
    if (prog < 1) {
      rafRef.current = requestAnimationFrame(animateProgress);
    } else {
      setRevealed(true);
      setPressing(false);
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

  // Play unlocked sound when invite screen appears
  useEffect(() => {
    if (revealed) {
      const audio = new window.Audio('/sounds/unlocked.mp3');
      audio.currentTime = 0;
      audio.play();
    }
  }, [revealed]);

  useEffect(() => {
    sdk.actions.addFrame();
  }, []);

  return (
    <div
      style={{
        background: "#F1ECCE",
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        fontFamily: "monospace",
        overflow: "hidden",
        transition: "filter 1.4s cubic-bezier(.4,2,.6,1)",
        filter: isWarping ? "blur(8px) brightness(1.2)" : "none",
      }}
    >
      {/* First screen: Initial message */}
      <div
        style={{
          opacity: revealed ? 0 : 1,
          pointerEvents: revealed ? 'none' : 'auto',
          transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.5s',
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          filter: revealed ? 'blur(10px)' : 'none',
          transform: revealed ? 'translateY(-100vh)' : 'translateY(0)',
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
        {/* Press and Hold Button */}
        <div
          style={{
            position: 'absolute',
            bottom: '6vh',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 20,
            pointerEvents: 'auto',
          }}
        >
          <button
            onMouseDown={handlePress}
            onMouseUp={handleRelease}
            onMouseLeave={handleRelease}
            onTouchStart={e => { e.preventDefault(); handlePress(); }}
            onTouchEnd={handleRelease}
            style={{
              background: 'transparent',
              color: '#888',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              padding: '12px 32px',
              opacity: 0.5,
              letterSpacing: 0.01,
              outline: 'none',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
              userSelect: 'none',
            }}
          >
            PRESS AND HOLD
          </button>
        </div>
      </div>

      {/* Portal effect overlay */}
      <div
        style={{
          display: 'none',
        }}
      />

      {/* Second screen: Invitation revealed */}
      <div
        style={{
          opacity: revealed ? 1 : 0,
          pointerEvents: revealed ? 'auto' : 'none',
          transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.5s',
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateRows: '1fr 1fr 1fr 1fr 1fr 1fr',
          height: '100vh',
          width: '100vw',
          alignItems: 'center',
          justifyItems: 'center',
          zIndex: 3,
          transform: revealed ? 'translateY(0)' : 'translateY(100vh)',
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
            left: `calc(50% + ${GROUP_LEFT_OFFSET}px)`,
            top: "50vh",
            transform: "translate(-40%, 0)",
            zIndex: 2,
            width: "260px",
            height: "100px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "40px",
            animation: "bounceSmall 2.1s ease-in-out infinite",
            animationDelay: "0.3s"
          }}
        >
          {/* Right: SHARE button and bean (existing) */}
          <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            {/* Bean1 */}
            <div
              style={{
                position: "absolute",
                width: "54px",
                height: "54px",
                transform: `translate(-50%, -50%) translate(${SHARE_BEAN_LEFT}px, ${SHARE_BEAN_TOP}px)`,
                left: "50%",
                top: "50%",
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
            {/* Share Button */}
            <div
              style={{
                position: "relative",
                width: "80px",
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0px",
                cursor: "pointer",
                left: SHARE_BTN_LEFT,
                top: SHARE_BTN_TOP,
              }}
              onClick={() => {
                const shareUrl = new URL("https://warpcast.com/~/compose");
                shareUrl.searchParams.set("text", "This is a test");
                shareUrl.searchParams.set("embeds[]", "https://beings-club.vercel.app/");
                window.open(shareUrl.toString(), '_blank');
              }}
            >
              <img
                src="/share-line.png"
                alt="share-line"
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
                  fontSize: "0.85rem",
                  color: "#111",
                  letterSpacing: 0,
                  marginTop: "2px",
                }}
              >
                SHARE
              </span>
            </div>
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
