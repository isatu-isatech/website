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
  acceptedCategories: [],
});

// Custom hook to easily access the context
export const useCookieConsent = () => useContext(CookieConsentContext);

// The main provider component
export function CookieConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [acceptedCategories, setAcceptedCategories] = useState<string[]>([]);

  useEffect(() => {
    // Get the current consent cookie, if it exists
    const cc_cookie = CookieConsent.getCookie();

    // Set initial state from the cookie
    if (cc_cookie && cc_cookie.categories) {
      setAcceptedCategories(cc_cookie.categories);
    }

    // Configuration for the cookie consent banner
    const config: CookieConsentConfig = {
      guiOptions: {
        consentModal: {
          layout: "box",
          position: "bottom right",
        },
      },
      // This will be called once the banner is initialized
      onFirstConsent: ({ cookie }) => {
        if (cookie.categories) {
          setAcceptedCategories(cookie.categories);
        }
      },
      // This will be called on any consent change
      onChange: ({ cookie }) => {
        if (cookie.categories) {
          setAcceptedCategories(cookie.categories);
        }
      },
      categories: {
        necessary: {
          readOnly: true, // Always enabled
        },
        analytics: {
          enabled: true, // This makes the category accepted by default
          // The YouTube player will be under this category
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
          // The theme preference will be under this category
        },
      },
      language: {
        default: "en",
        translations: {
          en: {
            consentModal: {
              title: "We use cookies!",
              description:
                "This website uses cookies to enhance your browsing experience and to analyze our traffic. By clicking 'Accept all', you consent to our use of cookies.",
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Reject all",
              showPreferencesBtn: "Manage preferences",
            },
            preferencesModal: {
              title: "Manage cookie preferences",
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Reject all",
              savePreferencesBtn: "Save preferences",
              sections: [
                {
                  title: "Cookie Usage",
                  description:
                    "We use cookies to help you navigate efficiently and perform certain functions. You will find detailed information about all cookies under each consent category below.",
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
    };

    CookieConsent.run(config);
  }, []);

  return (
    <CookieConsentContext.Provider value={{ acceptedCategories }}>
      {children}
    </CookieConsentContext.Provider>
  );
}
