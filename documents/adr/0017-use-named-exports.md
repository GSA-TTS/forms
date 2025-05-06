# 17. Use Named Exports Over Default Exports and Avoid index Files

Date: 04-16-2025

## Status

Approved

## Context

During the recent refactoring of the `Form` and `FormManager` components in the `design` package, we noticed inconsistencies in the use of default exports, named exports, and `index` files. Some files used default exports, while others used named exports. Additionally, many directories relied on `index.tsx` files, which made it harder to locate specific components or utilities in the codebase.

Default exports can sometimes lead to ambiguity, especially when renaming imports, and they do not provide the same level of tooling support (e.g., auto-imports in IDEs) as named exports. Named exports, on the other hand, make it clear what is being exported and allow for more consistent imports across the codebase.

Similarly, `index` files can introduce ambiguity when navigating the codebase, as multiple `index.tsx` files across different directories make it harder to locate specific functionality. Using descriptive file names improves clarity and maintainability.

## Decision

We will adopt the following guidelines for exports and file structure moving forward:
1. **Use named exports** for all components, utilities, and types.
2. **Avoid default exports**, except in cases where a file exports a single, primary entity (e.g., a React component that represents the main purpose of the file).
3. **Avoid `index` files** in favor of descriptive file names (e.g., `FormManager.tsx` instead of `index.tsx`).

## Consequences

- **Consistency:** The codebase will have a consistent export style and file structure, making it easier to read and maintain.
- **Tooling Support:** Named exports improve IDE tooling, such as auto-imports and refactoring.
- **Clarity:** Named exports and descriptive file names make it clear what is being exported and where functionality resides, reducing ambiguity.
- **Ease of Navigation:** Avoiding `index` files ensures that file names are descriptive, making it easier to locate specific components or utilities.

## Examples

### Before (Default Export):

```tsx
// FormManager.tsx
export default function FormManager() { ... }

// Importing in other files
import FormManager from './FormManager';
```

### After (Named Export):
```tsx

// FormManager.tsx
export function FormManager() { ... }

// Importing in other files
import { FormManager } from './FormManager';
```

## Related Changes

This decision was applied during the refactoring of the `Form` and `FormManager` components in the design package. As part of this refactor:

- Default exports were replaced with named exports.
- `index.tsx` files were replaced with descriptive file names (e.g., `FormManager.tsx`, `PatternComponents.tsx`).
