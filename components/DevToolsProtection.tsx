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

    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable specific keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
        redirectToNotFound();
        return false;
      }
      // Ctrl+Shift+I
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        redirectToNotFound();
        return false;
      }
      // Ctrl+Shift+J
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        redirectToNotFound();
        return false;
      }
      // Ctrl+U (view source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        redirectToNotFound();
        return false;
      }
      // Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        redirectToNotFound();
        return false;
      }
    };

    // Detect DevTools by checking window size changes
    let devtoolsOpen = false;
    const threshold = 160;

    const detectDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        if (!devtoolsOpen) {
          devtoolsOpen = true;
          redirectToNotFound();
        }
      } else {
        devtoolsOpen = false;
      }
    };

    // Detect using console detection
    const detectConsole = () => {
      const element = new Image();
      Object.defineProperty(element, "id", {
        get: function () {
          redirectToNotFound();
          throw new Error("DevTools detected");
        },
      });
      console.log(element);
    };

    // Check for Firebug
    const detectFirebug = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).console && (window as any).console.firebug) {
        redirectToNotFound();
      }
    };

    // Detect debugger
    const detectDebugger = () => {
      const start = new Date().getTime();
      // eslint-disable-next-line no-debugger
      debugger;
      const end = new Date().getTime();
      if (end - start > 100) {
        redirectToNotFound();
      }
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    // Run detection checks
    const interval = setInterval(() => {
      detectDevTools();
      detectFirebug();
      detectDebugger();
    }, 1000);

    // Initial console detection
    try {
      detectConsole();
    } catch {
      // DevTools detected
    }

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(interval);
    };
  }, [router]);

  return null;
}
