# Frontend File Structure Reference

## Source Code (`src/`)

```
src/
├── main.jsx                 - App root component with providers and routing
├── api.js                  - Axios HTTP client with JWT interceptor
├── config.js               - Environment configuration (dev/staging/prod)
├── utils.js                - Utility functions (validation, formatting, storage)
├── styles.css              - Global styles with CSS variables and responsive design
├── context/
│   ├── AuthContext.jsx     - Authentication state (user, token, login/logout)
│   └── CartContext.jsx     - Shopping cart state (items, totals, checkout)
└── pages/
    ├── Products.jsx        - Product listing with variants and add-to-cart
    ├── Cart.jsx            - Shopping cart with checkout
    ├── Login.jsx           - User login form
    └── Register.jsx        - User registration form
```

## Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and npm scripts |
| `vite.config.js` | Vite build config with React plugin |
| `.env.example` | Template for environment variables |
| `.gitignore` | Git ignored files and folders |
| `index.html` | HTML entry point |
| `Dockerfile` | Docker image for production |

## Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Frontend overview and quick start |
| `FRONTEND_SETUP.md` | Complete setup, configuration, and usage guide |
| `FRONTEND_BUILD_SUMMARY.md` | Build summary and feature overview |
| `FILE_REFERENCE.md` | This file - quick reference |

## Generated Files

| Folder | Purpose |
|--------|---------|
| `dist/` | Built production assets (created by `npm run build`) |
| `node_modules/` | Installed npm dependencies |

---

## Key Files Explanation

### `main.jsx`
- App root component
- Sets up AuthProvider and CartProvider
- Defines all routes
- Renders Header, main content, and Footer
- Shows cart item badge on navigation

### `api.js`
- Creates Axios instance with base URL
- Automatically adds JWT token to requests
- Handles 401 responses by redirecting to login
- Provides `setAuthToken()` function for auth management

### `AuthContext.jsx`
- Provides global auth state
- Methods: `setToken()`, `logout()`
- Properties: `user`, `token`, `loading`
- Persists token to localStorage
- Use with `useAuth()` hook

### `CartContext.jsx`
- Provides global cart state
- Methods: `addToCart()`, `removeFromCart()`, `updateCartItem()`, `checkout()`
- Properties: `cart`, `loading`, `error`
- Syncs with backend API
- Use with `useCart()` hook

### `Pages`

#### Products.jsx
Shows product listing with:
- Responsive grid layout
- Expandable variant details
- Add to cart functionality
- Stock availability
- Loading/error states

#### Cart.jsx
Shopping cart with:
- Item list in table format
- Quantity controls
- Remove buttons
- Order summary
- Payment method selection
- Checkout button

#### Login.jsx
Login form with:
- Username and password inputs
- Form validation
- Password visibility toggle
- Error messages
- Demo credentials display
- Registration link

#### Register.jsx
Registration form with:
- Username, email, password inputs
- Password confirmation
- Comprehensive validation
- Success message
- Auto-redirect to login
- Login link

### `styles.css`
Global styles including:
- CSS custom properties for colors and spacing
- Header and navigation styles
- Button styles (primary, secondary, danger)
- Form styles and validation states
- Product grid and cards
- Cart table and summary
- Auth form styles
- Responsive breakpoints
- Mobile optimizations
- Loading and error states

---

## Hooks & Context Usage

### Authentication
```javascript
import { useAuth } from './context/AuthContext'

function MyComponent() {
  const { user, token, setToken, logout } = useAuth()
}
```

### Shopping Cart
```javascript
import { useCart } from './context/CartContext'

function MyComponent() {
  const { cart, addToCart, checkout, error } = useCart()
}
```

---

## API Endpoints Used

| Method | Endpoint | Used In |
|--------|----------|---------|
| GET | /products/ | Products.jsx |
| POST | /auth/register/ | Register.jsx |
| POST | /auth/login/ | Login.jsx, api.js |
| GET | /cart/ | Cart.jsx, CartContext |
| POST | /cart/add/ | Products.jsx, CartContext |
| PATCH | /cart/item/{id}/ | Cart.jsx, CartContext |
| DELETE | /cart/item/{id}/ | Cart.jsx, CartContext |
| POST | /checkout/ | Cart.jsx, CartContext |

---

## Environment Variables

```bash
# Available in src/config.js and components
VITE_API_BASE    # Backend API URL (default: http://localhost:8000)
VITE_ENV         # Environment name (development/staging/production)
```

---

## Build Commands

```bash
# Development
npm install      # Install dependencies
npm run dev      # Start dev server

# Production
npm run build    # Build for production
npm run preview  # Preview production build

# Code quality
npm run lint     # Lint code (if eslint configured)
npm run format   # Format code with Prettier
```

---

## Folder Structure Summary

- **src/** - Source code
  - **pages/** - Page components (4 pages)
  - **context/** - State management (2 providers)
  - **Root files** - Config, utils, api, main, styles
- **dist/** - Build output (after `npm run build`)
- **Root** - Configuration and documentation
  - **package.json** - Dependencies
  - **vite.config.js** - Build config
  - **index.html** - HTML template
  - **Dockerfile** - Container config
  - **README.md** - Quick start
  - **FRONTEND_SETUP.md** - Complete guide

---

## Quick Navigation

| Want to... | Go to... |
|-----------|----------|
| Add authentication logic | `context/AuthContext.jsx` |
| Add cart logic | `context/CartContext.jsx` |
| Make API calls | `api.js` |
| Add utility functions | `utils.js` |
| Edit styling | `styles.css` |
| Add new page | Create in `pages/` and add route in `main.jsx` |
| Change colors | Edit CSS variables in `styles.css` |
| Change API URL | Update `.env.local` or `config.js` |
| Deploy to Docker | Run `npm run build` then `docker build` |

---

## Dependencies

- **react** (18.2.0) - UI library
- **react-dom** (18.2.0) - React DOM rendering
- **react-router-dom** (6.14.1) - Client routing
- **axios** (1.4.0) - HTTP client
- **vite** (5.1.0) - Build tool
- **@vitejs/plugin-react** (4.0.0) - Vite React plugin

---

This reference covers all files and their purposes. For detailed information, see the setup guide or individual file comments.
