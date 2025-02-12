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

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Conventions

### Naming conventions

Generally, we are orientating ourselves at the default Typescript naming conventions. We try to avoid abbreviations.

#### File names and locations

Generally files are grouped based on topic. For files used by multiple topics the file is put into the shared folder.

For file names for services and components we use the Angular standard with `.service` or `.component` suffixes.

Definitions of types and interfaces are located in the models folder.

Configs are located in the `config` folder. For each config there should be a corresponding interface definition in the `models/configs` folder.

Constants should be avoided if possible and should be part of configs if needed. If a constant is required that should not be considered configurable, they are located in the `constants` folder. To make the usage of the constants more explicit, the values are scoped in an object that is exported. The object should also be typed `as const`.

### Angular conventions

We use private readonly properties with `inject` to inject a service rather than using a constructor where we would provide them as arguments.

### Branchname and commit message

Whenever possible, a Github issue should be referenced in both branchname and commit message:

- Branches: `[feature|hotfix]/[xxx]-[name-of-branch]`, where `xxx` refers to a Github issue number and the `name-of-branch`
  is a short summary of the feature/hotfix.`
- Commits: `Your commit message #[xxx]`, , where `xxx` refers to a Github issue number. Make sure to write meaningful commit messages (see [this blog post](https://cbea.ms/git-commit/) for details)

Our githooks check for both the branch name and the commit message, but they will only output a warning if they don't
match. This is because there are times when you _might_ want to deviate from these rules.

### Testing

Due to the difficult nature of UI-testing, components are not tested. However, this means that components should contain as little logic as possible. Services and ngrx-effects should be tested.
