import { useEffect, useRef, useState } from "react";
import channelsAsset from "@/assets/payment-channels.png.asset.json";

const ALT =
  "Payment channels supported by Noqoody: Visa, Mastercard, NAPS, Himyan, Amex, JCB, Apple Pay, Google Pay, Samsung Pay, GCCNET, WeChat Pay, UnionPay, Alipay, Fitbit Pay, Garmin Pay and HSBC";

export function PaymentChannelsCard() {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Cached/SSR-rendered images can finish loading before onLoad is attached
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <div className="surface-card mx-auto mt-10 w-full max-w-3xl overflow-hidden p-4 sm:p-6 md:p-8">
      <div
        className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl"
        style={{ aspectRatio: "1119 / 581" }}
      >
        {!loaded && (
          <div
            className="absolute inset-0 animate-pulse rounded-2xl bg-muted"
            aria-hidden="true"
          />
        )}
        <img
          ref={imgRef}
          src={channelsAsset.url}
          alt={ALT}
          width={1119}
          height={581}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 h-full w-full rounded-2xl object-contain transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
}
