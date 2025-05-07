import { headers } from 'next/headers';

export default function Head() {
  // Always use the main embed preview image
  const imageUrl = 'https://beings-club.vercel.app/embed-preview.png';

  return (
    <>
      {/* Adobe Fonts Roc Grotesk */}
      <link rel="stylesheet" href="https://use.typekit.net/adq1bgp.css" />
      {/* Farcaster Mini App Embed Meta Tag */}
      <meta
        name="fc:frame"
        content={JSON.stringify({
          version: 'next',
          imageUrl,
          button: {
            title: 'Open Beings Club',
            action: {
              type: 'launch_frame',
              url: 'https://beings-club.vercel.app',
              name: 'Beings Club',
              splashImageUrl: 'https://beings-club.vercel.app/splash.png',
              splashBackgroundColor: '#000000',
            },
          },
        })}
      />
    </>
  );
} 