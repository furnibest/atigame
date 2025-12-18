"use client";

import React from "react";

interface LoadingSpinnerProps {
  message?: string;
  fullscreen?: boolean;
}

export default function LoadingSpinner({ message = "Memuat...", fullscreen = true }: LoadingSpinnerProps) {
  return (
    <div className={fullscreen ? "loading-container" : "loading-inline"} role="status" aria-live="polite">
      <div className="spinner spinner-xl" aria-hidden="true" />
      <p style={{ marginTop: '0.75rem' }}>{message}</p>
    </div>
  );
}
