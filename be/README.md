# Plango Backend Monorepo

## Working with Python packages
```shell
# Step 1: Add dependencies in pyproject.toml file to include your new dependency (If you need to add test/tools deps add it in test/tools.in file of requirements folder)

# Step 2: Update python deps by running
make update-py-deps

# Step 3: Generate BUILD.bazel script with gazelle
bazelisk run //:gazelle
# Or
make generate-build
```
For local development, make sure to create python venv by running
```shell
bazelisk run //requirements:create_venv
#Or
make create-py-venv
```
Make sure you update venv manually when adding new deps by re-run the above command

## Working with Java packages
To add depedencies, navigate to `gradle/libs.versions.toml` then add your dependencies. Refer https://docs.gradle.org/current/userguide/version_catalogs.html for more information about version catalogs.

Then run this following command to update deps
```shell
make update-jvm-deps
```
Or
```shell
REPIN=1 bazelisk run @maven//:pin
```

You need to handwriting the BUILD.bazel script yourself in this moment. (Maybe can have auto-gen toolchain in the future)

## Working with Go packages
To add external dependencies, you can run this following command:
```shell
bazelisk run @rules_go//go get go/external/dependencies
```

For Auto-generate BUILD.bazel script file, run:
```shell
make generate-build
```

## Building project
For building the whole project, run this command
```shell
bazelisk build //...
# Or
make build
```

If you want to build the specific package
```shell
bazelisk build //path/to/specific/package:target
```
You can find the target in the BUILD.bazel file

## Git commit conventions
- feat(scope): A brief description of a new feature (Always include scope when working with particular service, agent, worker)
- fix(scope): A patch of bugs in codebase (include scope like above rule)
- hotfix(scope): A hot patch of critical bugs in other env like uat or prod (include scope like above rule and always checkout new branch when doing a hotfix)
- refactor(scope): A code change that neither fixes a bug nor adds a feature
- docs: Documentation only changes.
- config(scope): Changes that affect the build system, ci, git-related config. (scope include: build, ci, git)
- style(scope): Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- test(scope): Adding missing tests or correcting existing tests (include scope live the first rule, prioritize integration testing over unit testing)
- ! suffix: annotate that the commit introduces a breaking API change (e.g: feat(iam)!: change the user registration api). Minimize this type of commit

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.com/plango-travel/backend/-/settings/integrations)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***
