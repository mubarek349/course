"use server";

import { cookies } from "next/headers";

export async function getLang() {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("lang")?.value == "en";
  } catch {
    // console.log("ERROR ", error);
    return null;
  }
}
