'use client';

import { useCallback, useState } from 'react';
import { sdk } from "@farcaster/frame-sdk";

interface ShareButtonProps {
  eventText?: string;
  className?: string;
}

export default function ShareButton({ eventText = "Hey everyone, I'm going to this event!", className = '' }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShare = useCallback(async () => {
    try {
      setIsSharing(true);
      setError(null);

      // Use the canonical app URL as the card, not in the text
      const appUrl = 'https://beings-club.vercel.app';
      const castText = eventText;
      await sdk.actions.openUrl(
        `https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}&url=${encodeURIComponent(appUrl)}`
      );

    } catch (err) {
      console.error('Error sharing:', err);
      setError('Failed to share. Please try again.');
    } finally {
      setIsSharing(false);
    }
  }, [eventText]);

  return (
    <div className={className}>
      <button
        onClick={handleShare}
        disabled={isSharing}
        style={{
          position: "relative",
          width: "100px",
          height: "100px",
          cursor: isSharing ? "not-allowed" : "pointer",
          opacity: isSharing ? 0.7 : 1,
          background: "none",
          border: "none",
          outline: "none",
          padding: 0,
        }}
      >
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
          {isSharing ? "SHARING..." : "SHARE"}
        </span>
      </button>
      {error && (
        <div style={{ 
          color: "red", 
          fontSize: "0.8rem", 
          marginTop: "0.5rem",
          textAlign: "center" 
        }}>
          {error}
        </div>
      )}
    </div>
  );
} 