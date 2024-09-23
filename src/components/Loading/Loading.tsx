import React from "react";

export default function Loading() {
  return (
    <div className="flex justify-center" aria-label="Now Loading...">
      <div className="animate-spin h-20 w-20 mt-5 border-8 border-blue-500 rounded-full border-b-transparent"></div>
    </div>
  );
}
