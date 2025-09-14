"use client";
import { useEffect, useState } from "react";

export default function ClientBody({ children, className }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <body className={className}>{children}</body>;
  }

  return <body className={className}>{children}</body>;
}
