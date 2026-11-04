import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdSenseBannerProps {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  responsive?: boolean;
  className?: string;
  label?: string;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slot = 'default',
  format = 'auto',
  responsive = true,
  className = '',
  label = 'Advertisement',
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const isPushed = useRef(false);

  useEffect(() => {
    // Only execute client-side
    if (typeof window === 'undefined') return;

    try {
      // Check if ad slot has already been initialized
      if (adRef.current && !isPushed.current) {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        isPushed.current = true;
      }
    } catch (e) {
      // Gracefully handle AdSense initialization errors (e.g., ad blockers)
      console.debug('AdSense initialization notice:', e);
    }
  }, []);

  return (
    <div
      className={`w-full max-w-full overflow-hidden my-3 px-2 py-1 flex flex-col items-center justify-center transition-opacity ${className}`}
      aria-label={label}
    >
      <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-1 select-none">
        {label}
      </span>
      <div className="w-full flex justify-center items-center min-h-[60px] max-w-full overflow-hidden rounded-lg bg-slate-50/50 border border-dashed border-slate-200">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', textAlign: 'center' }}
          data-ad-client="ca-pub-3166168589952262"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    </div>
  );
};
