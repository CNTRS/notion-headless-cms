import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
    {
        extends: true,
        test: {
            name: "unit",
            include: ["src/domain/**/*.test.ts"],
        },
    },
    {
        extends: true,
        test: {
            name: "integration",
            include: ["src/**/*.test.ts"],
            exclude: ["src/domain/**", "**/*.smoke.test.ts"],
        },
    },
    {
        extends: true,
        test: {
            name: "smoke",
            include: ["src/**/*.smoke.test.ts"],
        },
    },
]);
