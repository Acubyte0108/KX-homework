import React from "react";
import { render, RenderOptions } from "@testing-library/react";

// Create a custom render that includes any providers if needed
function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, {
    // Add providers here if needed
    ...options,
  });
}

export * from "@testing-library/react";
export { customRender as render };
