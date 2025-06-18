import { redirect } from "next/navigation";
import React from "react";

export default async function Default() {
  redirect("/");
  return <div></div>;
}
