# 12. Rich Text Editor

Date: 2024-08-12

## Status

Approved

## Context

In user testing, there was an expressed interest to be able to apply a limited set of rich text formatting to imported forms and new builds from scratch.

## Decision

TipTap was selected to provide the rich text formatting features after evaluating several alternatives (QuillJS, Prose, TinyMCE).

Quill was originally installed, but there was a known issue in being able to execute a line break inside a bulleted list, which caused an issue with reformatting imported text when it was edited for the first time. TipTap was installed as an alternative.

## Consequences

TipTap is a popular package that works outside the React ecosystem, so it is portable if there is ever a need to move to a different JS framework. The plugin does operate on a freemium model with the subset of features being free with additional, more advanced features having a cost. However, based on the features we use at the time of this ADR, the free features are robust enough to current requirements as well as the most likely requirements in the future.
