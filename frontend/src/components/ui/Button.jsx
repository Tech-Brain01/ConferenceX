// ./ui/Button.jsx
import React from "react";

export function buttonVariants({ variant = "default", className = "" } = {}) {
  const base = "rounded px-4 py-2 font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    secondary: "bg-blue-200 text-blue-800 hover:bg-blue-300 focus:ring-blue-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400",
  };

  return `${base} ${variants[variant] || variants.default} ${className}`.trim();
}

const Button = React.forwardRef(({ variant, className = "", disabled, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={buttonVariants({ variant, className })}
      disabled={disabled}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };
