'use client';

import { base } from 'wagmi/chains';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import type { ReactNode } from 'react';

export function Providers(props: { children: ReactNode }) {
  return (
    <MiniKitProvider
      projectId={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      notificationProxyUrl="/api/notification"
      chain={base}
      config={{ appearance: { mode: 'light' } }}
    >
      {props.children}
    </MiniKitProvider>
  );
}

