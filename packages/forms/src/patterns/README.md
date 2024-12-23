# Forms Platform - Patterns

Patterns are the Forms Platform's primary building block, a reusable module that may be configured via the no-code form builder to craft custom user experiences.

Patterns are stored on the form `Blueprint`'s pattern attribute.

## Pattern configuration

Each pattern must define a configuration object, which provides the definition of its behavior.

The `PatternConfig` type is defined in [../pattern.ts](../pattern.ts).

## Data structure

Patterns are defined by the generic `Pattern<C>` type in `pattern.ts`.

```typescript
export type Pattern<C = any> = {
  type: string;   // A string identifier for the pattern type
  id: PatternId;  // A unique identifier for the pattern instance
  data: C;        // The configuration data specific to the pattern type
};
```

Constructing patterns may be accomplished manually, or via `PatternBuilder` helper classes.

For example, an input pattern may be defined directly:

```typescript
const input: InputPattern = {
  type: 'input',
  id: 'my-input',
  data: {
    label: 'My input',
    initial: '',
    required: true,
    maxLength: 64
  },
}
```

... or patterns may be created with the builder's object-oriented interface:

```typescript
const input1 = new InputPatternBuilder();
const input2 = new InputPatternBuilder();
const page1 = new Page({ title: 'Page 1', patterns: [input1.id] });
const pageSet = new PageSet({ pages: [page1.id] });
const page2 = new Page({ title: 'Page 2', patterns: [input2.id] });
pageSet.addPage(page2)

// Construct the pattern objects
page1.toPattern();
page2.toPattern();
pageSet.toPattern();
```

