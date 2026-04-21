import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "happy-dom",
    setupFiles: ["./vitest.setup.ts"],
    globals: false,
    css: false,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // Provide stub values so the Supabase client module initialises without
    // throwing during tests. Individual test files mock the client itself via
    // vi.mock to avoid real network calls.
    env: {
      NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
    },
  },
});
