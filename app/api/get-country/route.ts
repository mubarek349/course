import { NextRequest, NextResponse } from "next/server";

// Simple in-memory cache to reduce API calls
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache = new Map<string, any>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    // Get the user's IP address from various headers
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const cfConnectingIp = request.headers.get("cf-connecting-ip");
    const xForwardedFor = request.headers.get("x-forwarded-for");
    const xRealIp = request.headers.get("x-real-ip");
    const xClientIp = request.headers.get("x-client-ip");
    const xClusterClientIp = request.headers.get("x-cluster-client-ip");
    const xForwarded = request.headers.get("x-forwarded");
    const xForwardedForOriginal = request.headers.get(
      "x-forwarded-for-original"
    );
    const xOriginalForwardedFor = request.headers.get(
      "x-original-forwarded-for"
    );
    const remoteAddr = request.headers.get("remote-addr");
    const clientIp = request.headers.get("client-ip");

    // Try to get IP from different sources (VPN-friendly)
    let ip =
      forwarded?.split(",")[0]?.trim() ||
      realIp?.trim() ||
      cfConnectingIp?.trim() ||
      xForwardedFor?.split(",")[0]?.trim() ||
      xRealIp?.trim() ||
      xClientIp?.trim() ||
      xClusterClientIp?.trim() ||
      xForwarded?.split(",")[0]?.trim() ||
      xForwardedForOriginal?.split(",")[0]?.trim() ||
      xOriginalForwardedFor?.split(",")[0]?.trim() ||
      remoteAddr?.trim() ||
      clientIp?.trim() ||
      "127.0.0.1";

    // Clean up the IP (remove port if present)
    ip = ip.split(":")[0].trim();

    console.log("Detected IP:", ip);
    console.log("All headers:", {
      forwarded,
      realIp,
      cfConnectingIp,
      xForwardedFor,
      xRealIp,
      xClientIp,
      xClusterClientIp,
      xForwarded,
      xForwardedForOriginal,
      xOriginalForwardedFor,
      remoteAddr,
      clientIp,
    });

    // For localhost/development, try to get real device IP
    if (
      ip === "127.0.0.1" ||
      ip === "::1" ||
      ip === "localhost" ||
      ip === "undefined" ||
      ip.startsWith("192.168.") ||
      ip.startsWith("10.") ||
      ip.startsWith("172.")
    ) {
      console.log("Localhost detected, trying to get real device IP...");

      try {
        // Try to get real IP from external service
        const realIpResponse = await fetch("https://api.ipify.org?format=json");
        const realIpData = await realIpResponse.json();

        if (realIpData.ip && realIpData.ip !== "127.0.0.1") {
          ip = realIpData.ip;
          console.log("Real device IP detected:", ip);
        } else {
          // Fallback to test IP
          // ip = "41.207.251.142"; // Ethiopian IP for testing
          console.log("Using test IP for development:", ip);
        }
      } catch (error) {
        console.log("Failed to get real IP, using test IP:", error);
        // ip = "41.207.251.142"; // Ethiopian IP for testing
        console.log("Using test IP for development:", ip);
      }
    }

    // Check cache first
    const cacheKey = `geo_${ip}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log("Using cached geolocation data for IP:", ip);
      return NextResponse.json({
        ...cached.data,
        cached: true,
      });
    }

    try {
      // Try multiple geolocation services for better reliability
      let geoData = null;
      let serviceUsed = "";

      // Try ipapi.co first
      try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; NextJS-App)",
          },
        });
        const data = await response.json();

        if (!data.error) {
          geoData = data;
          serviceUsed = "ipapi.co";
        }
      } catch {
        console.log("ipapi.co failed, trying alternative...");
      }

      // If ipapi.co fails, try ip-api.com (free, no rate limits)
      if (!geoData) {
        try {
          const response = await fetch(
            `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,city,timezone`,
            {
              headers: {
                "User-Agent": "Mozilla/5.0 (compatible; NextJS-App)",
              },
            }
          );
          const data = await response.json();

          if (data.status === "success") {
            geoData = {
              country_name: data.country,
              country_code: data.countryCode,
              city: data.city,
              region: data.region,
              timezone: data.timezone,
              ip: data.ipapi,
            };
            serviceUsed = "ip-api.com";
          }
        } catch {
          console.log("ip-api.com failed, using fallback...");
        }
      }

      // If both services fail, use fallback
      if (!geoData) {
        console.log("All geolocation services failed, using fallback");
        return NextResponse.json({
          success: true,
          ip: ip,
          country: "Ethiopia",
          countryCode: "ET",
          isEthiopia: true,
          paymentMethod: "chapa",
          currency: "ETB",
          fallback: true,
          error: "All geolocation services failed, using fallback",
        });
      }

      const country = geoData.country_name;
      const countryCode = geoData.country_code;
      const isEthiopia =
        countryCode === "ET" || country.toLowerCase().includes("ethiopia");

      console.log(
        "Country detected:",
        country,
        "Code:",
        countryCode,
        "Is Ethiopia:",
        isEthiopia,
        "Service:",
        serviceUsed
      );

      const result = {
        success: true,
        ip: ip,
        country: country,
        countryCode: countryCode,
        isEthiopia: isEthiopia,
        paymentMethod: isEthiopia ? "chapa" : "stripe",
        currency: isEthiopia ? "ETB" : "USD",
        city: geoData.city,
        region: geoData.region,
        timezone: geoData.timezone,
        service: serviceUsed,
      };

      // Cache the result
      cache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
      });

      return NextResponse.json(result);
    } catch (geoError) {
      console.error("Geolocation error:", geoError);

      // Fallback: assume Ethiopia for development
      return NextResponse.json({
        success: true,
        ip: ip,
        country: "Ethiopia",
        countryCode: "ET",
        isEthiopia: true,
        paymentMethod: "chapa",
        currency: "ETB",
        fallback: true,
        error: "Geolocation failed, using fallback",
      });
    }
  } catch (error) {
    console.error("Get country error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to detect country",
        fallback: {
          paymentMethod: "chapa",
          currency: "ETB",
          isEthiopia: true,
        },
      },
      { status: 500 }
    );
  }
}
