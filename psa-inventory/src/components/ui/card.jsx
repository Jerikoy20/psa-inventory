import React from "react";

// The "children" prop allows you to put content INSIDE the card
// The "className" prop allows you to add Tailwind classes
export function Card({ className, children }) {
  return (
    <div className={`rounded-xl border bg-white text-gray-950 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children }) {
  return (
    <h3 className={`font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children }) {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
}