import { headers } from 'next/headers';

export default function Head() {
  // Get the current URL and query params
  const headersList = headers();
  const url = headersList.get('x-url') || '';
  let imageUrl = 'https://beings-club.vercel.app/embed-preview.png';

  try {
    const u = new URL(url);
    if (u.searchParams.get('share') === '1') {
      imageUrl = 'https://beings-club.vercel.app/share-frame.png';
    }
  } catch {}

  return (
    <>
      {/* Adobe Fonts Roc Grotesk */}
      <link rel="stylesheet" href="https://use.typekit.net/adq1bgp.css" />
      {/* Farcaster Mini App Embed Meta Tag (dynamic) */}
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