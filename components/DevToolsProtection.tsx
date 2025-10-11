"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function DevToolsProtection() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Get current language from URL
    const getLang = () => {
      const pathParts = pathname?.split("/") || [];
      return pathParts[1] || "en"; // Default to 'en' if no language found
    };

    const redirectToNotFound = () => {
      const lang = getLang();
      router.push(`/${lang}/notfound`);
    };

    // Import and initialize disable-devtool
    import("disable-devtool").then((module) => {
      const disableDevtool = module.default;
      disableDevtool({
        ondevtoolopen: () => {
          redirectToNotFound();
        },
        ondevtoolclose: () => {
          // DevTools closed, but we already redirected
        },
        interval: 200, // Check every 200ms
        disableMenu: true, // Disable right-click
        clearIntervalWhenDevOpenTrigger: true,
        detectors: [0, 1, 2, 3, 4, 5, 6, 7], // Enable all detectors
        clearLog: true,
        disableSelect: true, // Disable text selection
        disableCopy: true, // Disable copy
        disableCut: true, // Disable cut
        disablePaste: true, // Disable paste
      });
    });

    // Additional devtools-detect for backup
    import("devtools-detect").then((module) => {
      const devtools = module.default;
      
      // Check if DevTools is already open
      if (devtools.isOpen) {
        redirectToNotFound();
      }

      // Listen for DevTools open/close events
      const handleDevToolsChange = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail.isOpen) {
          redirectToNotFound();
        }
      };

      window.addEventListener("devtoolschange", handleDevToolsChange);
    });

    // Disable specific keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.keyCode === 123 || e.key === "F12") {
        e.preventDefault();
        redirectToNotFound();
        return false;
      }
      // Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.key === "I")) {
        e.preventDefault();
        redirectToNotFound();
        return false;
      }
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 74 || e.key === "J")) {
        e.preventDefault();
        redirectToNotFound();
        return false;
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && (e.keyCode === 85 || e.key === "u" || e.key === "U")) {
        e.preventDefault();
        redirectToNotFound();
        return false;
      }
      // Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 67 || e.key === "C")) {
        e.preventDefault();
        redirectToNotFound();
        return false;
      }
      // Ctrl+Shift+M (Toggle Device Toolbar)
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 77 || e.key === "M")) {
        e.preventDefault();
        redirectToNotFound();
        return false;
      }
      // Ctrl+Shift+K (Firefox Console)
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 75 || e.key === "K")) {
        e.preventDefault();
        redirectToNotFound();
        return false;
      }
      // F11 (Fullscreen - sometimes used with DevTools)
      if (e.keyCode === 122 || e.key === "F11") {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [router, pathname]);

  return null;
}
