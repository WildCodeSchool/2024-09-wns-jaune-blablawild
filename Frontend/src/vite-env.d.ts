/// <reference types="vite/client" />

import "@testing-library/jest-dom";

declare module "vitest" {
  interface Assertion<T = unknown> {
    toBeInTheDocument(): T;
    toHaveClass(className: string): T;
    toHaveAttribute(attr: string, value?: string): T;
  }
}
