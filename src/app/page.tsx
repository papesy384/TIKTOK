"use client";

import { useEffect } from "react";
import { HomeClient } from "@/components/HomeClient";

export default function Home() {
  useEffect(() => {
    const el = document.getElementById("root-loading");
    if (el) el.style.display = "none";
  }, []);
  return <HomeClient />;
}
