import { configure } from "@testing-library/dom";

// Configure testing-library to work with happy-dom
configure({
  // Custom error output to improve test failures
  getElementError: (message: string | null, container: Element) => {
    const error = new Error(message || "");
    error.name = "TestingLibraryElementError";
    error.stack = undefined;
    return error;
  },
});
