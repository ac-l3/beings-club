export interface Env {
  // Add your environment variables here if needed
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const html = `
        <div style="
          background: #F1ECCE;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
        ">
          <img
            src="https://beings-club.vercel.app/share-frame.png"
            alt="Beings Club"
            style="
              width: 100%;
              height: 100%;
              object-fit: contain;
            "
          />
        </div>
      `;

      return new Response(html, {
        headers: {
          'content-type': 'text/html',
          'cache-control': 'public, max-age=300', // Cache for 5 minutes
        },
      });
    } catch (e) {
      return new Response('Failed to generate image', { status: 500 });
    }
  },
}; 