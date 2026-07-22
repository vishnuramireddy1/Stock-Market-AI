import React, { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Hardcode dark mode for this dashboard
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return <>{children}</>;
}
