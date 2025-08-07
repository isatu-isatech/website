"use client";

import { useTheme } from "next-themes";
import React from "react";
import Turnstile from "react-turnstile";

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (error: string) => void;
  action?: string; // Optional: A string that can be used to customize the widget
  cData?: string; // Optional: Customer data that is passed to the server
}

const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({
  onVerify,
  onExpire,
  onError,
  action,
  cData,
}) => {
  const { theme } = useTheme();

  const siteKey: string | undefined =
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    console.error(
      "Cloudflare Turnstile site key is not set. Please set NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY in your .env.local file.",
    );
    return (
      <div className="rounded-md border border-red-400 bg-red-100 p-4 text-red-700">
        Turnstile widget could not load: Site key missing.
      </div>
    );
  }

  return (
    <div className="my-4">
      <Turnstile
        sitekey={siteKey}
        onVerify={onVerify}
        onExpire={onExpire}
        onError={onError}
        action={action}
        cData={cData}
        theme={theme === "dark" ? "dark" : "light"}
        size="normal"
      />
    </div>
  );
};

export default TurnstileWidget;
