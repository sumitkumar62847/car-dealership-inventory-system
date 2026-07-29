# AI Prompts and Development Notes

This file documents how I used AI assistance while building the Car Dealership Inventory Management System.

I used AI mainly as a development assistant for planning the project, reviewing implementation approaches, debugging errors, writing tests, and improving the frontend. I did not treat generated code as final by default. I tested the APIs manually, ran the automated test suites, checked failures, and updated the implementation when necessary.

The prompts below are representative of the main questions and tasks I worked through during development. Some have been cleaned up slightly for readability.

---

## 1. Project Planning

At the beginning, I wanted to divide the application into smaller backend and frontend tasks instead of trying to build everything at once.

Some of my initial prompts were similar to:

> Help me plan a full-stack car dealership inventory management system using React, Node.js, Express, MongoDB, and TypeScript for the backend.

> Break the project into small development steps so I can implement and test each feature separately.

This helped me organize the project around authentication, vehicles, inventory operations, search, frontend pages, and testing.

---

# Backend Development

## 2. Backend Project Structure

I wanted the backend to have separate responsibilities instead of putting all the logic inside route files.

Prompt:

> Suggest a clean Node.js + Express + TypeScript backend structure for this project using controllers, services, models, middleware, routes, and tests.

The backend was organized around folders such as:

```text
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── app.ts
│   └── server.ts
│
├── tests/
├── package.json
└── tsconfig.json
```

I kept database operations and business logic separated where possible so that controllers were not responsible for everything.

---

## 3. Authentication

One of the first backend features was user authentication.

Prompts included:

> Create registration and login APIs using Express, TypeScript, MongoDB, bcrypt, and JWT.

> How should I hash the password before storing a user in MongoDB?

> How should I generate and verify a JWT after login?

The authentication flow became:

```text
Register
   ↓
Validate request
   ↓
Hash password
   ↓
Save user


Login
   ↓
Find user
   ↓
Compare password
   ↓
Generate JWT
   ↓
Return token
```

I also worked through invalid credentials, duplicate users, and missing authentication tokens.

---

## 4. Authentication Middleware

After authentication was working, I needed protected APIs.

Prompt:

> Create authentication middleware that reads a Bearer token from the Authorization header, verifies the JWT, and makes the authenticated user available to the next middleware/controller.

Expected request format:

```http
Authorization: Bearer <token>
```

I also tested requests where the token was missing or invalid.

---

## 5. Admin Authorization

Some inventory operations should only be available to administrators.

Prompt:

> How can I add role-based authorization so only an admin can create, update, delete, and restock vehicles?

The authorization flow became:

```text
Request
   ↓
Authentication middleware
   ↓
JWT verification
   ↓
Admin authorization
   ↓
Controller
```

This was important because hiding admin controls on the frontend alone would not secure the API.

---

## 6. Vehicle Model

I needed a MongoDB model representing dealership inventory.

Prompt:

> Create a Mongoose vehicle schema containing make, model, category, price, and quantity with validation for required fields and non-negative numeric values.

A vehicle has data similar to:

```json
{
  "make": "Toyota",
  "model": "Fortuner",
  "category": "SUV",
  "price": 45000,
  "quantity": 5
}
```

I added backend validation because API requests should not be trusted just because the frontend also validates input.

---

## 7. Create Vehicle API

The first major inventory endpoint was:

```http
POST /api/vehicles
```

Prompt:

> Implement POST /api/vehicles so an admin can create a vehicle. Return proper validation and authorization errors for invalid requests.

I tested cases such as:

```text
Valid vehicle
Missing make
Missing model
Negative price
Negative quantity
Missing authentication token
Non-admin request
```

---

## 8. Get Vehicles API

Next I implemented:

```http
GET /api/vehicles
```

Prompt:

> Implement GET /api/vehicles to return the vehicle inventory and handle an empty database correctly.

An important test case was making sure an empty database returned an empty vehicle list rather than causing an error.

While writing the Jest tests, I also encountered a nested-test error:

```text
Tests cannot be nested
```

I used AI assistance to identify that some `it()` blocks had accidentally been placed inside another test instead of directly inside the `describe()` block.

---

## 9. Update Vehicle

The update endpoint was:

```http
PUT /api/vehicles/:id
```

Prompt:

> Implement an admin-only endpoint for updating an existing vehicle by ID. Handle invalid IDs, missing vehicles, validation errors, and successful updates.

I tested updating values such as price and quantity and verified the changes in MongoDB.

---

## 10. Delete Vehicle

The delete endpoint was:

```http
DELETE /api/vehicles/:id
```

Prompt:

> Implement DELETE /api/vehicles/:id for admins and return a proper response when the vehicle does not exist.

The frontend later used this endpoint from the Admin Dashboard with a confirmation step before deletion.

---

## 11. Vehicle Search

The search endpoint was:

```http
GET /api/vehicles/search
```

Prompt:

> Build a vehicle search API that supports filters such as make, model, category, minimum price, and maximum price.

I wanted filtering to be handled by the backend rather than loading the entire database and implementing all filtering only in React.

The frontend later used these filters for:

```text
Brand
Model
Category
Minimum price
Maximum price
```

---

## 12. Purchase Vehicle

The purchase endpoint was:

```http
POST /api/vehicles/:id/purchase
```

Prompt:

> Implement a purchase endpoint that decreases vehicle quantity by one but does not allow quantity to go below zero.

A simple implementation that first reads the vehicle and then updates it can create problems when multiple requests happen at nearly the same time.

I therefore used an atomic MongoDB update based on the quantity:

```ts
Vehicle.findOneAndUpdate(
  {
    _id: id,
    quantity: { $gt: 0 },
  },
  {
    $inc: {
      quantity: -1,
    },
  },
  {
    returnDocument: "after",
  }
);
```

This allows the database operation itself to check that stock is available before decreasing the quantity.

I also tested the out-of-stock case.

---

## 13. Restock Vehicle

The admin restock endpoint was:

```http
POST /api/vehicles/:id/restock
```

Prompt:

> Implement an admin-only restock endpoint that increases the existing quantity by the amount supplied in the request.

For example:

```text
Existing quantity: 5
Restock amount: 3

Result: 8
```

I also validated that the restock quantity must be greater than zero.

---

## 14. Mongoose Deprecation Warning

During development, the server repeatedly displayed:

```text
mongoose: the `new` option for `findOneAndUpdate()` and
`findOneAndReplace()` is deprecated.
Use `returnDocument: 'after'` instead.
```

Prompt:

> Why is Mongoose showing a warning for `new: true` in findOneAndUpdate, and what should I replace it with?

I updated operations from:

```ts
{
  new: true
}
```

to:

```ts
{
  returnDocument: "after"
}
```

where applicable.

---

# Backend Testing

## 15. Testing Strategy

I wanted to test the API behavior instead of checking only whether individual functions executed.

Prompt:

> Help me write backend tests using Jest, Supertest, and a test database for authentication and vehicle APIs.

The backend tests covered areas such as:

```text
Authentication
Authorization
Vehicle creation
Vehicle retrieval
Vehicle updates
Vehicle deletion
Search
Purchase
Restocking
Validation
Error responses
```

---

## 16. Debugging Inventory Tests

At one stage, several tests returned unexpected values such as:

```text
Expected: 200
Received: 404
```

and:

```text
Expected quantity: 4
Received: undefined
```

Prompt:

> Analyze these Jest failures and help me determine whether the problem is in the route, test data, vehicle model, or database setup.

I compared the routes, model fields, test setup, and database state instead of changing assertions simply to make tests pass.

---

## 17. Manual API Testing

After the automated backend tests were working, I also wanted to test the API manually against an empty database.

Prompt:

> Give me the URL, HTTP method, headers, request body, and expected response for each API so I can test the production database using Thunder Client.

I manually tested the authentication and vehicle endpoints, including protected and admin operations.

This was useful for verifying the complete request flow outside Jest.

---

# Frontend Development

## 18. Frontend Setup

For the frontend, I chose React.js using Create React App rather than Vite.

Prompt:

> Set up the frontend using React.js without Vite. I need React Router, Axios, Tailwind CSS, authentication context, protected routes, a user dashboard, and an admin dashboard.

The main frontend structure became:

```text
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── VehicleCard.jsx
│   │   ├── SearchBar.jsx
│   │   ├── VehicleForm.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   └── AdminDashboard.jsx
│   │
│   ├── services/
│   │   └── api.jsx
│   │
│   └── App.js
│
└── package.json
```

---

## 19. API Service

Instead of calling Axios independently everywhere, I created a service layer.

Prompt:

> Create an Axios API service for authentication, vehicle CRUD operations, search, purchase, and restocking.

This gave the frontend a central place for API configuration and requests.

---

## 20. AuthContext

Prompt:

> Create an AuthContext that reads the JWT, restores the logged-in user after refresh, detects expired or invalid tokens, provides login/logout functions, and exposes whether the user is an admin.

The context provides values such as:

```js
user
token
login
logout
isAuthenticated
isAdmin
```

I used `jwt-decode` to read the token payload on the frontend.

The backend still performs the actual authorization checks.

---

## 21. Registration and Login

Prompts:

> Build a registration page connected to the backend registration API with loading, validation, and error states.

> Build a login page that stores the JWT through AuthContext and redirects the user after successful authentication.

I tried to keep API errors visible to the user instead of failing silently.

---

## 22. Protected Routes

Prompt:

> Create a ProtectedRoute component that redirects unauthenticated users to login and prevents regular users from accessing admin routes.

The basic logic is:

```text
Not authenticated
      ↓
    /login


Authenticated + admin route
      ↓
Check admin role
      ↓
Allow or redirect
```

---

## 23. Navbar

Prompt:

> Build a responsive Navbar that changes based on authentication state and shows admin navigation only when the logged-in user is an admin.

The Navbar also provides logout functionality.

---

## 24. User Dashboard

Prompt:

> Build the main dashboard to load vehicles from the API, display inventory cards, support search/filtering, and allow users to purchase available vehicles.

The Dashboard handles:

```text
Loading
API errors
Empty inventory
Vehicle list
Search results
Purchase requests
Stock updates
```

---

## 25. Vehicle Card

Prompt:

> Create a reusable VehicleCard component showing make, model, category, price, stock quantity, stock status, and a purchase button.

The card disables purchasing when a vehicle is unavailable.

I also formatted prices consistently in the UI.

---

## 26. Search and Filters

The search interface became more than simple text inputs.

Prompt:

> Build search filters for brand, model, category, and price. The model filter should depend on the selected brand.

For example:

```text
Brand: Toyota

Available models:
- Fortuner
- Camry
```

rather than showing models belonging to every brand.

The component loads inventory information to build the available filter options and sends the selected filters when searching.

---

## 27. Purchase UI

Prompt:

> Connect the VehicleCard purchase button to the purchase API and refresh/update the inventory after a successful purchase.

I also handled:

```text
Successful purchase
Out of stock
API failure
Loading state
```

---

## 28. Admin Dashboard

Prompt:

> Build an Admin Dashboard where administrators can view inventory statistics and manage vehicles.

The dashboard includes statistics such as:

```text
Vehicle Models
Total Units
In Stock
Out of Stock
```

and inventory management functionality.

---

## 29. Add and Update Vehicle

I used a reusable form rather than maintaining completely separate forms.

Prompt:

> Create a VehicleForm that can be used for both adding a new vehicle and editing an existing vehicle.

This reduced duplicate form logic.

The form handles values such as:

```text
Make
Model
Category
Price
Quantity
```

along with validation and submission states.

---

## 30. Delete and Restock

Prompts:

> Add vehicle deletion to the Admin Dashboard with a confirmation before sending the request.

> Add a restock action that asks for a quantity, validates it, calls the restock API, and updates the inventory.

I also handled invalid quantities and failed API requests.

---

## 31. Frontend Refactoring and UI

After the core functionality worked, I used AI assistance to review components and improve the interface.

Prompts included:

> Refactor the frontend without changing the existing API behavior.

> Improve the dashboard and admin dashboard UI while keeping the application responsive.

> Reduce duplicated logic where possible and keep components reusable.

I kept functionality and tests as the priority while making UI changes.

---

# Frontend Testing

## 32. Testing Setup

Prompt:

> Help me add frontend tests using Jest and React Testing Library to my Create React App project.

I tested application behavior rather than Tailwind class names or implementation details wherever possible.

---

## 33. VehicleCard Tests

One VehicleCard test originally expected:

```text
$45,000
```

while the UI actually displayed:

```text
₹45,000
```

Prompt:

> Why does React Testing Library fail to find `$45,000` when the component renders `₹45,000`?

The test was corrected to match the actual UI instead of changing working application code to satisfy an incorrect assertion.

---

## 34. SearchBar Tests

The SearchBar required API mocking because it loads vehicle data when mounted.

Initially the tests accidentally tried to contact the real backend, which caused:

```text
Cross origin http://localhost forbidden
```

and:

```text
AxiosError: Network Error
```

Prompt:

> How should I mock getVehicles in SearchBar tests so Jest does not call my real backend?

After mocking the API, I tested:

```text
Loading state
Filter rendering
Brand options
Model dependency
Category options
Search submission
API loading behavior
```

---

## 35. React `act(...)` Warning

Even after the SearchBar tests passed, the test output contained:

```text
An update to FilterBar inside a test was not wrapped in act(...)
```

The issue came from the loading-state test finishing while the mocked asynchronous request was still resolving and updating component state.

Prompt:

> All SearchBar tests pass, but React still shows an act warning for state updates after getVehicles resolves. How should I fix the test?

For the loading-state test, I kept the request pending:

```js
getVehicles.mockReturnValue(
  new Promise(() => {})
);
```

This allowed the test to verify the loading UI without letting asynchronous state updates finish after the test had already ended.

---

## 36. ProtectedRoute Testing

While testing `ProtectedRoute`, I encountered compatibility issues involving React Router and Jest.

Errors included:

```text
Cannot find module 'react-router/dom'
```

and later:

```text
ReferenceError: TextEncoder is not defined
```

Prompts:

> Why does react-router-dom fail inside Jest with Cannot find module react-router/dom?

> How do I fix TextEncoder is not defined when testing React Router?

I checked the installed React Router versions and adjusted the test environment/polyfills needed for the version being used.

After that, ProtectedRoute tests covered:

```text
Unauthenticated redirect
Authenticated access
Admin access
Non-admin redirect
```

---

## 37. AuthContext Tests

Prompt:

> Write tests for AuthContext covering stored tokens, login, logout, invalid JWTs, expired JWTs, authentication state, and admin state.

AuthContext eventually reached full coverage for statements, branches, functions, and lines.

---

## 38. VehicleForm Tests

Prompt:

> Test VehicleForm for rendering, user input, validation, add mode, edit mode, form submission, and cancellation.

This was especially useful because the same form is used for both creating and updating inventory.

---

## 39. Dashboard Tests

Prompt:

> Write core Dashboard tests for vehicle loading, empty inventory, API failures, search results, purchase behavior, and rendering child components.

I mocked the API layer so these tests focused on the Dashboard behavior rather than making real network requests.

---

## 40. AdminDashboard Tests

AdminDashboard had the largest set of frontend behaviors.

Prompt:

> Write tests for AdminDashboard covering loading, inventory statistics, empty inventory, API errors, adding, editing, deleting, restocking, confirmation behavior, and child components.

One test failed because the page contained multiple elements with the text:

```text
In Stock
```

There was an inventory statistics label as well as status badges.

Prompt:

> React Testing Library finds multiple elements with the text "In Stock". How can I test the statistics card without making the test depend too heavily on styling?

I updated the assertion to target the statistics label rather than assuming `"In Stock"` appeared only once.

---

## 41. Final Frontend Test Results

After completing and debugging the frontend tests, I ran:

```bash
npm test -- --coverage --watchAll=false
```

The final result at the time of writing was:

```text
Test Suites: 9 passed, 9 total
Tests:       93 passed, 93 total
Snapshots:   0 total
```

Coverage:

| Metric | Coverage |
|--------|----------|
| Statements | 78.46% |
| Branches | 75.33% |
| Functions | 68.98% |
| Lines | 78.75% |

Some individual application areas have significantly higher coverage. For example, authentication context, registration, protected routes, and the vehicle form reached full or near-full coverage.

I decided not to add meaningless tests only to increase the overall percentage. The main goal was to cover important application behavior and failure cases.

---

# Documentation and Git

## 42. README

Prompt:

> Help me write a detailed README for the project that explains the application naturally, including features, architecture, authentication, APIs, testing, setup, security, and what I learned.

I reviewed the generated documentation and kept only features that actually exist in the project.

I intentionally avoided adding things such as Docker, Swagger, CI/CD, deployment URLs, or screenshots unless they were actually implemented.

---

## 43. `.gitignore`

Prompt:

> Why should node_modules, dist, .env, coverage, and .DS_Store be in .gitignore?

The final ignore rules include generated files, dependencies, secrets, test coverage output, and operating-system files.

For example:

```gitignore
node_modules/
dist/
.env
coverage/
.DS_Store
```

The TypeScript backend generates JavaScript inside `dist/`, so that directory can be recreated from the source using the build command.

---

# How I Used AI During This Project

AI was most useful when I already had a specific problem to solve.

For example, instead of asking it to generate the entire project at once, I generally worked feature by feature:

```text
Implement feature
      ↓
Run application/tests
      ↓
Inspect error
      ↓
Ask a focused question
      ↓
Understand suggested fix
      ↓
Update code
      ↓
Run tests again
```

This process was particularly useful for debugging because many problems were not obvious from reading one file alone.

Examples included:

- Jest tests accidentally nested inside other tests
- API routes returning 404 during tests
- Incorrect assumptions about rendered currency
- SearchBar tests calling the real backend
- React asynchronous state update warnings
- React Router/Jest compatibility problems
- Multiple matching elements in React Testing Library
- Mongoose deprecation warnings
- Inventory quantity updates

I also tried to verify generated suggestions instead of accepting them only because they looked correct.

For backend APIs, I used automated tests and manual Thunder Client requests.

For frontend functionality, I ran the application and used Jest/React Testing Library.

This helped make AI part of the development and debugging process rather than a replacement for testing the application.

---

# Main Areas Where AI Assisted

During this project, AI assistance was mainly used for:

1. Breaking the project into manageable development steps.
2. Reviewing backend architecture.
3. Implementing and reviewing REST API logic.
4. Understanding JWT authentication and role-based authorization.
5. Debugging TypeScript, Mongoose, React, and Jest errors.
6. Designing atomic inventory operations.
7. Creating frontend component structures.
8. Improving responsive UI implementation.
9. Writing and reviewing automated tests.
10. Mocking API dependencies in frontend tests.
11. Understanding failed test output.
12. Refactoring code after functionality was working.
13. Writing project documentation.

The final implementation was validated by running the application, manually testing APIs, and running the automated test suites.

---

## Final Notes

The most useful part of using AI in this project was not generating large amounts of code. It was being able to work through individual problems quickly and understand why something was failing.

Testing also played an important role. A suggestion was not considered complete until the related feature or test behaved as expected.

The project currently includes a working authentication system, role-based access control, vehicle inventory management, search and filtering, purchasing, restocking, user and admin dashboards, backend tests, and frontend tests.