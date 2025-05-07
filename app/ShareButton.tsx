import { useCallback } from 'react';
import { sdk } from "@farcaster/frame-sdk";

interface ShareButtonProps {
  eventTitle: string;
  eventDate: string;
  eventUrl: string;
}

export default function ShareButton({ eventTitle, eventDate, eventUrl }: ShareButtonProps) {
  const handleShare = useCallback(async () => {
    try {
      // Create the share text
      const shareText = `Hey everyone, I'm going to this event! ${eventTitle} on ${eventDate}`;
      
      // Create the frame metadata
      const frameMetadata = {
        version: "next",
        imageUrl: `${eventUrl}/share-frame.png`, // Custom image for in-app sharing
        button: {
          title: "Join Event",
          action: {
            type: "launch_frame",
            url: eventUrl,
            name: "Beings Club",
            splashImageUrl: `${eventUrl}/embed-preview.png`, // Normal embed image
            splashBackgroundColor: "#f5f0ec"
          }
        }
      };

      // Share the cast using MiniKit
      await sdk.actions.addFrame();
      
      // Add the frame metadata to the page
      const meta = document.createElement('meta');
      meta.name = 'fc:frame';
      meta.content = JSON.stringify(frameMetadata);
      document.head.appendChild(meta);
    } catch (error) {
      console.error('Error sharing:', error);
      // You might want to show an error message to the user here
    }
  }, [eventTitle, eventDate, eventUrl]);

  return (
    <button
      onClick={handleShare}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "8px 16px",
        borderRadius: "20px",
        backgroundColor: "#111",
        color: "#fff",
        fontSize: "14px",
        fontWeight: "bold",
        transition: "transform 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      Share Event
    </button>
  );
} 