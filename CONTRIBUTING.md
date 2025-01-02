# Contribution Guidelines for StartupCorporation

Welcome to StartupCorporation! We value your contributions and collaboration to ensure a smooth development process across our repositories. This document outlines our conventions for pull requests (PRs) and commit messages. Please follow these guidelines to maintain consistency and readability in our codebase.

---

## Repositories

The following repositories belong to the **StartupCorporation** organization. Each repository serves a distinct purpose in the ecosystem:

### Frontend Applications
- [**fe-customer-app**](https://github.com/StartupCorporation/fe-customer-app)  
  The frontend application for customers.
- [**fe-admin-app**](https://github.com/StartupCorporation/fe-admin-app)  
  The frontend application for administrative users.

### Backend Applications
- [**customer-app**](https://github.com/StartupCorporation/customer-app)  
  The backend service powering customer-related functionality.
- [**admin-app**](https://github.com/StartupCorporation/admin-app)  
  The backend service for administrative tasks.

### Infrastructure and Coordination
- [**infrastructure**](https://github.com/StartupCorporation/infrastructure)  
  Contains infrastructure code for deploying and managing services.
- [**coordinator**](https://github.com/StartupCorporation/coordinator)  
  Orchestrates interactions between services.

---

## Pull Request (PR) Guidelines

1. **Branch Naming**
   - Use a descriptive branch name to indicate the purpose of your changes.
     ```
     feat-<scope>-<short-description>
     fix-<scope>-<short-description>
     chore-<scope>-<short-description>
     ```
     Example: `feature-products-add-filtering` or `fix-cart-price-rounding`

2. **PR Title**
   - Use the same format as the commit header:
     `<type>(<scope>):<short summary>`
    Example: `feature(products): Virtual scroll for filter page

3. **PR Description**
   - Provide a detailed description of the changes in the PR, including the problem being solved and the approach taken.
   - Reference related issues by including `Closes #<issue-number>`.

4. **Review Process**
   - Assign reviewers.
   - Ensure all automated checks and tests pass before requesting a review.

---

## Commit Message Format

To maintain a clean and readable Git history, each commit message should include a header, an optional body, and an optional footer.

```
<header>

<body>

<footer>
```

### 1. Commit Message Header

Format:
```
<type>(<scope>): <short summary>
```
- **type**: Indicates the type of change. Valid values are:
  - `feat`: A new feature
  - `fix`: A bug fix
  - `docs`: Documentation only changes
  - `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
  - `refactor`: A code change that neither fixes a bug nor adds a feature
  - `perf`: A code change that improves performance
  - `test`: Adding missing tests or correcting existing tests
  - `build`: Changes that affect the build system or external dependencies
  - `ci`: Changes to our CI configuration files and scripts
  - `chore`: Other changes that don’t modify src or test files

- **scope**: The module or feature being affected. Scopes vary by repository:
  - **fe-customer-app**: `landing`, `product`, `cart`, `docs`, `infra`
  - **customer-app**: [placeholder for scopes]
  - **fe-admin-app**: [placeholder for scopes]
  - **admin-app**: [placeholder for scopes]
  - **infrastructure**: [placeholder for scopes]
  - **coordinator**: [placeholder for scopes]

- **short summary**: Concisely describe the change in the present tense. Do not capitalize the first word or add a period at the end.

Example:
```
feat(products): add filtering by category
```

### 2. Commit Message Body (Optional)

- The body should be mandatory for all commits except those of type `docs`.
- Must be at least 20 characters long.
- Describe what changed and why in detail.

Example:
```
feat(products): add filtering by category

Added functionality to filter products by category in the product listing page. This improves user experience by allowing users to find desired items faster.
```

### 3. Commit Message Footer (Optional)

- Used for references to issues, breaking changes, or other important notes.
- Example for referencing an issue:
  ```
  Closes #123
  ```
- Example for breaking changes:
  ```
  BREAKING CHANGE: Refactored the API endpoint for product categories. Update API consumers accordingly.
  ```

---

## Contribution Process

1. Fork the repository.
2. Create a feature branch based on the naming conventions.
3. Commit changes following the commit message format.
4. Push the branch to your fork and open a pull request to the main repository.
5. Follow the review process and make necessary adjustments.

---

By adhering to these guidelines, we ensure a smooth and efficient collaboration process for all contributors. Thank you for contributing to StartupCorporation!
