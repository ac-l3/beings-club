import { headers } from 'next/headers';

export default function Head() {
  // Always use the main embed preview image
  const imageUrl = 'https://beings-club.vercel.app/embed-preview.png';

  return (
    <>
      {/* Adobe Fonts Roc Grotesk */}
      <link rel="stylesheet" href="https://use.typekit.net/adq1bgp.css" />
      {/* Minimal Farcaster Frame Meta Tags */}
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="https://beings-club.vercel.app/embed-preview.png" />
      <meta property="fc:frame:button:1" content="Open Beings Club" />
      <meta property="og:image" content="https://beings-club.vercel.app/embed-preview.png" />
    </>
  );
} 