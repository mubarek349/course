import { useState, useEffect } from "react";

interface IPData {
  ip: string;
  isLocalhost: boolean;
  loading: boolean;
  error: string | null;
}

export function useClientIP(): IPData {
  const [data, setData] = useState<IPData>({
    ip: "127.0.0.1",
    isLocalhost: true,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const detectIP = async () => {
      try {
        setData((prev) => ({ ...prev, loading: true, error: null }));

        // Try server-side detection first
        const response = await fetch("/api/get-ip");
        const result = await response.json();

        if (result.success) {
          setData({
            ip: result.ip,
            isLocalhost: result.isLocalhost,
            loading: false,
            error: null,
          });
        } else {
          throw new Error(result.error || "Failed to detect IP");
        }
      } catch (error) {
        console.error("IP detection error:", error);

        // Fallback: try client-side detection
        try {
          const response = await fetch("https://api.ipify.org?format=json");
          const data = await response.json();

          setData({
            ip: data.ip,
            isLocalhost: false,
            loading: false,
            error: null,
          });
        } catch (clientError) {
          console.error("Client-side IP detection failed:", clientError);
          setData((prev) => ({
            ...prev,
            loading: false,
            error: "Failed to detect IP from both server and client",
          }));
        }
      }
    };

    detectIP();
  }, []);

  return data;
}
