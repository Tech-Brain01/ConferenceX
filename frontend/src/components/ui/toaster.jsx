"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  // Custom colors for toast
  // You can tweak these values to suit your background better
  const toastStyles =
    theme === "dark"
      ? {
          "--normal-bg": "#333333", // dark gray, lighter than black
          "--normal-text": "#f0f0f0", // light gray/white text
          "--normal-border": "#555555",
          boxShadow: "0 4px 12px rgba(0,0,0,0.7)",
          borderRadius: "8px",
          padding: "12px 20px",
        }
      : {
          "--normal-bg": "#f9fafb", // light background for light theme
          "--normal-text": "#111827", // dark text
          "--normal-border": "#e5e7eb",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderRadius: "8px",
          padding: "12px 20px",
        };

  return <Sonner theme={theme} className="toaster group" style={toastStyles} {...props} />;
};

export { Toaster };
