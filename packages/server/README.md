# @atj/server

The Forms Platform web server.

## Build

The build consists of Astro's node.js adapter's output, as well as a constructor for running the web server with user-provided configuration. The build target produces both:

```bash
pnpm build
```

## Development

```bash
pnpm dev
```

## Usage example

To start the provided Express server:

```typescript
import { createServer } from '@atj/server';

const port = process.env.PORT || 4321;

const app = createServer({
  title: 'Example Form Service',
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```
