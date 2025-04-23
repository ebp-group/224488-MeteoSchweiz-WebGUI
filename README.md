Original Repository: https://github.com/MeteoSwiss/opendata-explorer

# Open Data Explorer

**Relevant resources**

- End-user flows dependent on OGD products

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 18.2.12.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever
you modify any of the source files.

### Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

### Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your
application for performance and speed.

### Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

### i18n: Translation keys

To extract all translation keys from the source code, run:

```bash
ng i18n:extract
```

And if you want to check if all keys are used and none missing, run:

```bash
ng i18n:find
```

### Formatting and linting

To format the code, you can use the following commands:

```bash
ng format
```

And if you want to check for formatting issues, run:

```bash
ng format:check
```

To check the linting of the code, you can use the following command:

```bash
ng lint
```

as well as

```bash
type:check
```

### STAC type generation

To generate the STAC types, you can use the following command:

```bash
ng generate-stac-api
```

This will generate the STAC types based on the current configuration. The generated types will be stored in the `src/app/stac/generated`
directory.

## Conventions

### Naming conventions

Generally, we are orientating ourselves at the default Typescript naming conventions. We try to avoid abbreviations.

#### File names and locations

Generally files are grouped based on topic. For files used by multiple topics the file is put into the shared folder.

For file names for services and components we use the Angular standard with `.service` or `.component` suffixes.

Definitions of types and interfaces are located in the models folder.

Configs are located in the `config` folder. For each config there should be a corresponding interface definition in the `models/configs`
folder.

Constants should be avoided if possible and should be part of configs if needed. If a constant is required that should not be considered
configurable, they are located in the `constants` folder. To make the usage of the constants more explicit, the values are scoped in an
object that is exported. The object should also be typed `as const`.

### Angular conventions

We use private readonly properties with `inject` to inject a service rather than using a constructor where we would provide them as
arguments.

### Branchname and commit message

Whenever possible, a Github issue should be referenced in both branchname and commit message:

- Branches: `[feature|hotfix]/[xxx]-[name-of-branch]`, where `xxx` refers to a Github issue number and the `name-of-branch`
  is a short summary of the feature/hotfix.`
- Commits: `Your commit message #[xxx]`, , where `xxx` refers to a Github issue number. Make sure to write meaningful commit messages (
  see [this blog post](https://cbea.ms/git-commit/) for details)

Our githooks check for both the branch name and the commit message, but they will only output a warning if they don't
match. This is because there are times when you _might_ want to deviate from these rules.
ES Lint is enabled in the precommit hook. This means that every commit will be checked for linting errors. If there are any, the commit will
be rejected.
Either fix the error (unused variable or import, etc.) or disable the rule for the specific line or file (`any` in `.spec.ts` files).
In case of the latter, add a comment explaining why the rule was disabled. Example for such a case:

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Allow "any" in test file
const action = {} as any;
```

The rules are defined in the `.eslintrc.config.mjs` file.

### Testing

Due to the difficult nature of UI-testing, components are not tested. However, this means that components should contain as little logic as
possible. Services and ngrx-effects should be tested.

### (S)CSS structure

We are using BEM to structure our (S)CSS: https://getbem.com/introduction/

Basically there are three important elements to keep track of:

- **blocks** \
  Standalone entity that is meaningful on its own. \
  Example: `download-asset-section` \
  How to use: `download-asset-section` (no change)
- **Element** \
  A part of a block that has no standalone meaning and is semantically tied to its block. \
  Example: `title` \
  How to use in HTML: `download-asset-section__title` (connect to a _block_ using two underscores) \
  How to use in SCSS: `&__title` (connect to a higher level _block_ using two underscores)
- **Modifier** \
  A flag on a block or element. Use them to change appearance or behavior. \
  Example: `disabled` \
  How to use in HTML: `download-asset-section--disabled` (connect to a _block_ or _element_ using two dashes) \
  How to use in SCSS: `&--disabled` (connect to a higher level _block_ or _element_ using two dashes)

## Code documentation

### SCSS

We are using SCSS for styling. The styles are located in the `src/styles` folder.

- `_design-variables.scss`: Contains some variables that are used in the application. \
  How to use in any SCSS file: `@use 'design-variables' as variables;`
- `_material-mixins.scss`: Contains some helper mixins to customize Angular Materials. \
  How to use in any SCSS file: `@use 'material-mixins' as mat-mixins;`
- `_opendata-explorer-theme.scss`: Contains the generated theme for the application. This is already referenced in the global `styles.scss`
  file.
- `_overrides.scss`: Contains some global style overrides for the application. This is already referenced in the global `styles.scss` file.

### State

All application-wide state is handled by [NGRX](https://ngrx.io/) and is located in the `src/app/state` folder.
This folder has some subfolders that are used to group the state by topic. Each subfolder can contain the following folders:

- `actions`: Contains the actions for the state. File names should be named `*.actions.ts`.
- `effects`: Contains the effects for the state. File names should be named `*.effects.ts`. Effects should be implemented as pure functions
  and therefore can (and should) be easily tested. Effects are used to handle side effects of actions, such as API calls or other
  asynchronous operations.
- `reducers`: Contains the reducers for the state. File names should be named `*.reducer.ts`. Reducers are pure functions and therefore
  can (and should) be easily tested.
- `selectors`: Contains the selectors for the state. File names should be named `*.selector.ts`. Selectors are pure functions and therefore
  can (and should) be easily tested.
- `states`: Contains the state interfaces. File names should be named `*.state.ts`.

Don't forget to add new state, reducer and effect files to `src/app/state/index.ts`.

### Configs

Configs are used to store configuration values for the application. They are located in the `src/app/shared/configs` folder.
They should always end with `as const satisfies [Config interface]` where `[Config interface]` is the interface that describes the config.

Constants should be only used for values that will never change.

### Error handling

The global error handler is located in the `src/app/error-handling` folder. All errors are caught by Angular and delegated to this handler
which then handles the errors according to their type. Additionally, while in develop mode, the errors are logged to the console.

The application itself defines errors that extend the native `Error` object, which allows for easier
handling and runtime error checks. These abstract errors are defined within `src/app/shared/errors/base.error.ts`. The
abstract base class of all custom errors is `OpendataExplorerRuntimeError`. It defines an (optional) property `originalError`
of `unknown` type which can be used to wrap any caught error. There is also a property `translationArguments` that can contain
a set of translation arguments that can be used to translate the error message.
In case an error will be displayed to the user, the error handler will check whether the `originalError` and `translationArguments` are set
to potentially translate the original message and log it as well. See below for an example.

All errors should extend from the following abstract classes, extending `OpendataExplorerRuntimeError`. They have different behaviour
in the error handler:

- `FatalError`: This error will raise an error that prevents the current screen from being used by redirecting to our
  fatal error page.
- `RecoverableError` and `SilentError`: Those errors will do nothing, except (in dev mode) log itself to the console. Useful for errors that
  should not be communicated to the user. The `RecoverableError` was originally intended to be used for errors that are shown to the user
  which is not the case in this application.

Of course, all other errors that might be thrown in the code and that are not caught (e.g.
simple `throw new Error('Fail!')`) will be handled as well; and currently, they are treated as `FatalError` because we
cannot reliably determine whether an error is critical or not.

#### Example

```typescript
export class AssetParseError extends SilentError {
  public override message = marker('asset.parse.error');
  public override translationArguments: Record<'filename', string>;

  constructor(filename: string, originalError?: unknown) {
    super(originalError);
    this.translationArguments = {filename};
  }
}
```

This will create a silent error (which will not be shown to the user) with the message `asset.parse.error` and the translation argument
`filename`.
The corresponding translation key in the `en.json` file looks like this:

```json
{
  "asset.parse.error": "Error while parsing file '{{filename}}'"
}
```

The error handler will log this error to the console in development mode in the following format:

```text
AssetParseError: asset.parse.error
    at _AssetService.parseStacStationAsset (asset.service.ts:76:11)
    at asset.service.ts:37:23
    (...)
    at ZoneImpl.run (zone.js:111:43)
"Error while parsing file 'ogd-phenology_jet_y.csv'"
```

#### Handling errors

In general, throwing an error is straight-forward: Just `throw` it.

In practice, there are situations where this is not as simple: In situations where we have an API call within an effect
and also use a `loadingState`, we cannot directly use `catchError` in the service API call's pipe chain, because this
would only show the error message without updating the loading state. For these cases, you should add a
dedicated `setError` action which sets the loading state through the reducer, and then have another effect that listens
to this action and then raises the appropriate error. In order to also have the originally thrown error, the
helper `errorProps()` can be used as `ActionProp` so you can pass along the original error for usage within the effect.
For examples of this, see e.g. the `loadStations` effect.

## Contributors

The project was developed for the [Bundesamt für Meteorologie und Klimatologie MeteoSchweiz](https://www.meteoschweiz.admin.ch).

<img src="./.readme/ebp.png" width="150"/>

It has been initially developed by [EBP Schweiz AG](https://ebp.ch) as an open-source project.

### Individual contributors

The following people have contributed to this project:

<a href="https://github.com/ebp-group/224488-MeteoSchweiz-WebGUI/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ebp-group/224488-MeteoSchweiz-WebGUI" />
</a>
