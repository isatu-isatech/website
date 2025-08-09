"use client";

import { createContext, useContext, useEffect, useState } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import type { CookieConsentConfig } from "vanilla-cookieconsent";

// Define the shape of our context
interface CookieConsentContextType {
  acceptedCategories: string[];
}

// Create the context with a default value
const CookieConsentContext = createContext<CookieConsentContextType>({
  acceptedCategories: ["necessary"], // Only necessary cookies enabled by default
});

// Custom hook to easily access the context
export const useCookieConsent = () => useContext(CookieConsentContext);

// The main provider component
export function CookieConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [acceptedCategories, setAcceptedCategories] = useState<string[]>([
    "necessary", // Only necessary cookies enabled by default
  ]);

  useEffect(() => {
    const cc_cookie = CookieConsent.getCookie();
    if (cc_cookie && cc_cookie.categories) {
      setAcceptedCategories(cc_cookie.categories);
    }

    const config: CookieConsentConfig = {
      guiOptions: {
        consentModal: {
          layout: "box",
          position: "bottom right",
        },
      },
      categories: {
        necessary: {
          readOnly: true,
        },
        analytics: {
          enabled: false, // Require explicit consent
          services: {
            vercel_speed_insights: {
              label: "Vercel Speed Insights",
              cookies: [{ name: "_vercel_speed_insights" }],
            },
            vercel_analytics: {
              label: "Vercel Analytics",
              cookies: [{ name: "_vercel_analytics" }],
            },
          },
        },
        preferences: {
          enabled: false, // Require explicit consent
        },
      },
      language: {
        default: "en",
        translations: {
          en: {
            consentModal: {
              title: "We value your privacy",
              description:
                "We use cookies to enhance your experience. Non-essential cookies (analytics, preferences) are disabled by default. You can accept all, accept necessary cookies, or manage your preferences.",
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Accept Necessary",
              showPreferencesBtn: "Manage preferences",
            },
            preferencesModal: {
              title: "Manage cookie preferences",
              acceptAllBtn: "Enable all",
              acceptNecessaryBtn: "Enable only necessary",
              savePreferencesBtn: "Save preferences",
              sections: [
                {
                  title: "Cookie Usage",
                  description:
                    "We use cookies to improve your experience. Non-essential cookies are disabled by default. You can enable or disable them below.",
                },
                {
                  title: "Strictly Necessary Cookies",
                  description:
                    "These cookies are required to enable basic site functionality.",
                  linkedCategory: "necessary",
                },
                {
                  title: "Analytics Cookies",
                  description:
                    "These cookies help us analyze site usage and improve performance. They are only set if you enable them.",
                  linkedCategory: "analytics",
                },
                {
                  title: "Preference Cookies",
                  description:
                    "These cookies remember your preferences, such as language or theme. They are only set if you enable them.",
                  linkedCategory: "preferences",
                },
              ],
            },
          },
        },
      },
      onFirstConsent: ({ cookie }) => {
        if (cookie.categories) {
          setAcceptedCategories(cookie.categories);
        }
      },
      onChange: ({ cookie }) => {
        if (cookie.categories) {
          setAcceptedCategories(cookie.categories);
        }
      },
    };

    CookieConsent.run(config);
  }, []);

  return (
    <CookieConsentContext.Provider value={{ acceptedCategories }}>
      {children}
    </CookieConsentContext.Provider>
  );
}
