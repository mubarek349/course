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

    let devtoolsOpen = false;

    // Comprehensive DevTools Detection
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      // Check for common DevTools properties
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const devtoolsCheck = (window as any).devtools?.isOpen || 
                           // eslint-disable-next-line @typescript-eslint/no-explicit-any
                           !!(window as any).Firebug || 
                           // eslint-disable-next-line @typescript-eslint/no-explicit-any
                           ((window as any).console?.firebug);
      
      // Performance timing check
      const start = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      const end = performance.now();
      const timingCheck = end - start > 100;

      if ((widthThreshold || heightThreshold || devtoolsCheck || timingCheck) && !devtoolsOpen) {
        devtoolsOpen = true;
        redirectToNotFound();
      }
    };

    // Console detection trick
    const consoleDetect = () => {
      const element = document.createElement('div');
      Object.defineProperty(element, 'id', {
        get: function() {
          redirectToNotFound();
          return '';
        }
      });
      // This will trigger the getter if console is open
      console.log('%c', element);
    };

    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts
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
    };

    // Disable text selection, copy, paste
    const handleSelectStart = (e: Event) => e.preventDefault();
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };
    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // Monitor window resize (DevTools opening/closing)
    const handleResize = () => {
      detectDevTools();
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);
    document.addEventListener("paste", handlePaste);
    window.addEventListener("resize", handleResize);

    // Run detection checks
    const interval = setInterval(() => {
      detectDevTools();
      try {
        consoleDetect();
      } catch {
        // Console detection triggered
      }
    }, 500);

    // Initial check
    detectDevTools();

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("paste", handlePaste);
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, [router, pathname]);

  return null;
}
