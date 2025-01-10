# 16. Unused CSS removal

Date: 2025-01-10

## Status

Approved

## Context

During the build of the application, the entirety of USWDS was imported into the project to ease prototyping. As the application is nearing MVP the number of new components that will go into the application has started to level off, and we're nearing a point where the application will need to be production ready. Since CSS is a render-blocking asset, we want to provide a better experience for the users of the application by shipping less code down the wire.

## Decision

Instead of importing all USWDS as a SASS package, we will instead use the [packages](https://designsystem.digital.gov/components/packages/) imports that USWDS provides out of the box.

Using [PurgeCSS](https://purgecss.com/) and its corresponding Astro integration was also evaluated. Although this method resulted in a much smaller CSS file (110kb on disk compared to 575kb on disk for the USWDS packages build at the time of testing), it requires more setup and a careful audit to make we aren't being too aggressive with removal and accidentally removing styles we do need.

Using the provided USWDS packages is the sweet spot until there are visual regression and more comprehensive end-to-end test coverage available.

## Consequences

As new features are introduced, developers will need to also make sure that the styles are imported as well.
