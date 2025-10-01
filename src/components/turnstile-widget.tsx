"use client";

import { publicEnv } from "@/lib/public-env";
import React from "react";
import Turnstile from "react-turnstile";
import { useTheme } from "next-themes";

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

  const siteKey = publicEnv.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

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
