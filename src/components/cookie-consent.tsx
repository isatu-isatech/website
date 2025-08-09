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
  acceptedCategories: ["necessary", "analytics", "preferences"], // Accept all by default
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
    "necessary",
    "analytics",
    "preferences",
  ]); // Accept all by default

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
          enabled: true, // Accept by default
          services: {
            youtube: {
              label: "YouTube Videos",
              cookies: [{ name: "YSC" }, { name: "VISITOR_INFO1_LIVE" }],
            },
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
          enabled: true, // Accept by default
        },
      },
      language: {
        default: "en",
        translations: {
          en: {
            consentModal: {
              title: "Cookies are enabled",
              description:
                "We use cookies to enhance your experience. All cookies are enabled by default. You can manage your preferences at any time.",
              acceptAllBtn: "OK",
              showPreferencesBtn: "Manage preferences",
            },
            preferencesModal: {
              title: "Manage cookie preferences",
              acceptAllBtn: "Enable all",
              acceptNecessaryBtn: "Disable all except necessary",
              savePreferencesBtn: "Save preferences",
              sections: [
                {
                  title: "Cookie Usage",
                  description:
                    "All cookies are enabled by default. You can disable non-essential cookies below.",
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
                    "These cookies allow us to analyze your use of the website to evaluate and improve our performance. They are also used to provide a better customer experience on this website. For example, remembering your log-in details, and providing video embeds.",
                  linkedCategory: "analytics",
                },
                {
                  title: "Preference Cookies",
                  description:
                    "These cookies are used to remember your preferences, such as your language or theme choice.",
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

    // Hide the consent modal after 5 seconds (5000 ms)
    const hideTimeout = setTimeout(() => {
      CookieConsent.hide();
    }, 5000);

    return () => {
      clearTimeout(hideTimeout);
    };
  }, []);

  return (
    <CookieConsentContext.Provider value={{ acceptedCategories }}>
      {children}
    </CookieConsentContext.Provider>
  );
}
