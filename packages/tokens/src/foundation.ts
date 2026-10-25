/** Resolved values from the inherited contract; see PROVENANCE.md for changes. */
export const foundation = {
  "breakpoint": {
    "xs": "0px",
    "sm": "640px",
    "md": "768px",
    "lg": "1024px",
    "xl": "1280px",
    "2xl": "1536px"
  },
  "space": {
    "0": "0px",
    "0_5": "2px",
    "1": "4px",
    "1_5": "6px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "5": "20px",
    "6": "24px",
    "8": "32px",
    "10": "40px",
    "12": "48px",
    "16": "64px"
  },
  "radius": {
    "none": "0px",
    "sm": "6px",
    "md": "10px",
    "lg": "14px",
    "full": "9999px"
  },
  "borderWidth": {
    "hairline": "1px",
    "thick": "2px"
  },
  "shadow": {
    "none": "none",
    "xs": "0 1px 1px rgba(0,0,0,0.04)",
    "sm": "0 1px 2px rgba(0,0,0,0.06)",
    "md": "0 8px 20px rgba(0,0,0,0.10)",
    "lg": "0 18px 50px rgba(0,0,0,0.16)",
    "xl": "0 24px 60px rgba(0,0,0,0.20)"
  },
  "motion": {
    "delay": {
      "tooltip": "220ms"
    },
    "duration": {
      "fast": "120ms",
      "base": "160ms",
      "slow": "220ms",
      "spinner": "800ms"
    },
    "easing": {
      "standard": "cubic-bezier(0.2, 0.8, 0.2, 1)",
      "emphasized": "cubic-bezier(0.2, 0.0, 0.0, 1)"
    }
  },
  "font": {
    "family": {
      "sans": "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
      "mono": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
    },
    "weight": {
      "regular": "400",
      "medium": "500",
      "semibold": "600"
    },
    "size": {
      "xs": "12px",
      "sm": "14px",
      "base": "16px",
      "lg": "18px",
      "xl": "20px",
      "2xl": "24px",
      "3xl": "30px",
      "4xl": "36px"
    },
    "lineHeight": {
      "tight": "1.2",
      "snug": "1.35",
      "normal": "1.5",
      "relaxed": "1.65"
    },
    "letterSpacing": {
      "tight": "-0.01em",
      "normal": "0em",
      "wide": "0.01em"
    },
    "preset": {
      "body": {
        "fontSize": "16px",
        "lineHeight": "1.5",
        "fontWeight": "400",
        "letterSpacing": "0em"
      },
      "bodySmall": {
        "fontSize": "14px",
        "lineHeight": "1.5",
        "fontWeight": "400",
        "letterSpacing": "0em"
      },
      "label": {
        "fontSize": "14px",
        "lineHeight": "1.35",
        "fontWeight": "500",
        "letterSpacing": "0em"
      },
      "labelSmall": {
        "fontSize": "12px",
        "lineHeight": "1.35",
        "fontWeight": "500",
        "letterSpacing": "0.01em"
      },
      "heading1": {
        "fontSize": "36px",
        "lineHeight": "1.2",
        "fontWeight": "600",
        "letterSpacing": "-0.01em"
      },
      "heading2": {
        "fontSize": "30px",
        "lineHeight": "1.2",
        "fontWeight": "600",
        "letterSpacing": "-0.01em"
      },
      "heading3": {
        "fontSize": "24px",
        "lineHeight": "1.35",
        "fontWeight": "600",
        "letterSpacing": "0em"
      },
      "heading4": {
        "fontSize": "20px",
        "lineHeight": "1.35",
        "fontWeight": "600",
        "letterSpacing": "0em"
      }
    }
  },
  "zIndex": {
    "base": 0,
    "dropdown": 50,
    "sticky": 60,
    "overlay": 70,
    "modal": 80,
    "popover": 85,
    "toast": 90,
    "tooltip": 100
  },
  "palette": {
    "neutral": {
      "0": "#FFFFFF",
      "50": "#FAFAFA",
      "100": "#F4F4F5",
      "200": "#E4E4E7",
      "300": "#D4D4D8",
      "400": "#A1A1AA",
      "500": "#71717A",
      "600": "#52525B",
      "700": "#3F3F46",
      "800": "#27272A",
      "900": "#18181B",
      "1000": "#0A0A0B"
    },
    "blue": {
      "50": "#EFF6FF",
      "100": "#DBEAFE",
      "200": "#BFDBFE",
      "300": "#93C5FD",
      "400": "#60A5FA",
      "500": "#0A84FF",
      "600": "#0077E6",
      "700": "#0062BF",
      "800": "#004A99",
      "900": "#003373"
    },
    "green": {
      "50": "#F0FDF4",
      "100": "#DCFCE7",
      "200": "#BBF7D0",
      "300": "#86EFAC",
      "400": "#4ADE80",
      "500": "#34C759",
      "600": "#28A745",
      "700": "#15803D",
      "800": "#166534",
      "900": "#14532D"
    },
    "amber": {
      "50": "#FFFBEB",
      "100": "#FEF3C7",
      "200": "#FDE68A",
      "300": "#FCD34D",
      "400": "#FBBF24",
      "500": "#FF9F0A",
      "600": "#E38700",
      "700": "#B45309",
      "800": "#92400E",
      "900": "#78350F"
    },
    "red": {
      "50": "#FEF2F2",
      "100": "#FEE2E2",
      "200": "#FECACA",
      "300": "#FCA5A5",
      "400": "#F87171",
      "500": "#FF3B30",
      "600": "#E02A21",
      "700": "#B91C1C",
      "800": "#991B1B",
      "900": "#7F1D1D"
    }
  },
  "control": {
    "height": {
      "sm": "32px",
      "md": "40px",
      "lg": "48px"
    },
    "paddingX": {
      "sm": "12px",
      "md": "16px",
      "lg": "20px"
    },
    "optionHeight": "36px"
  },
  "layout": {
    "sidebar": "260px",
    "sidebarCollapsed": "72px",
    "tooltip": "280px",
    "menuMin": "180px",
    "menuMax": "320px",
    "toast": "360px",
    "content": "1280px",
    "reading": "720px",
    "form": "480px",
    "dialog": "560px",
    "dialogSm": "420px",
    "dialogLg": "720px",
    "touch": "44px",
    "icon": "20px",
    "prose": "65ch",
    "header": "56px",
    "headerMobile": "52px"
  },
  "icon": {
    "size": {
      "sm": "16px",
      "md": "20px",
      "lg": "24px"
    },
    "strokeWidth": 2
  },
  "table": {
    "rowHeight": {
      "compact": "36px",
      "default": "44px"
    }
  },
  "opacity": {
    "disabled": 0.55,
    "skeleton": 0.55
  },
  "spinner": {
    "size": "16px"
  },
  "feedback": {
    "toastDuration": {
      "success": "3000ms",
      "info": "3500ms",
      "warning": "4500ms",
      "error": "6000ms"
    }
  }
} as const;

export const metadata = {
  "name": "Evenkit tokens",
  "version": "0.1.0",
  "source": {
    "id": "tokens.apple-minimal.v1",
    "version": "1.0.0",
    "updated": "2026-03-10",
    "sha256": "762bc8068bca72494f58164871f8488c589e19940ee1431c30a267ceeec3a4d3"
  }
} as const;
