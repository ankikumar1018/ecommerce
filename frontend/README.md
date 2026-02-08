# ShopSphere Frontend

A modern, responsive React e-commerce frontend built with Vite, React Router, and Axios.

## Features

- 🎨 **Modern UI/UX**: Clean, professional design with responsive layout
- 🛍️ **Product Catalog**: Browse products with detailed variant information
- 🛒 **Shopping Cart**: Add/remove items, update quantities, persistent cart
- 🔐 **Authentication**: Secure JWT-based login and registration
- 💳 **Checkout**: Multiple payment methods support
- 📱 **Mobile Friendly**: Fully responsive design for all devices
- ⚡ **Fast**: Built with Vite for optimal performance
- 🎯 **State Management**: React Context API for auth and cart state
- 🌐 **Error Handling**: Comprehensive error messages and loading states
- ♿ **Accessible**: Semantic HTML and accessible form controls

## Technology Stack

- **React 18.2**: UI library
- **React Router 6.14**: Client-side routing
- **Axios 1.4**: HTTP client
- **Vite 5.1**: Build tool and development server
- **CSS3**: Styling with custom properties and Grid/Flexbox

## Project Structure

```
frontend/
├── src/
│   ├── main.jsx              # App entry point with routing
│   ├── api.js                # Axios instance with auth interceptors
│   ├── styles.css            # Global styles with CSS variables
│   ├── context/
│   │   ├── AuthContext.jsx   # Authentication state management
│   │   └── CartContext.jsx   # Shopping cart state management
│   └── pages/
│       ├── Products.jsx      # Product listing with variants
│       ├── Cart.jsx          # Shopping cart and checkout
│       ├── Login.jsx         # User login
│       └── Register.jsx      # User registration
├── index.html                # HTML entry point
├── vite.config.js            # Vite configuration
├── Dockerfile                # Docker build configuration
├── package.json              # Dependencies
└── .env.example              # Environment variables template
```

## Installation

### Prerequisites

- Node.js 16+ and npm/yarn

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create environment file**:
   ```bash
   cp .env.example .env.local
   ```

3. **Configure API base URL** (if needed):
   Edit `.env.local`:
   ```
   VITE_API_BASE=http://localhost:8000
   ```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Development Features

- Hot module replacement (HMR)
- Fast refresh
- Development server with proxy support
- Source maps for debugging

## Building for Production

Build optimized production bundle:

```bash
npm run build
```

Output is in the `dist/` directory:
- Minified JavaScript and CSS
- Optimized images
- Production-ready assets

Preview production build locally:

```bash
npm run preview
```

## Docker

### Build Image

```bash
docker build -t shopsphere-frontend .
```

### Run Container

```bash
docker run -p 80:80 shopsphere-frontend
```

Access at `http://localhost`

### Docker Compose

```bash
docker compose up frontend
```

## Context Providers

### AuthContext

Manages user authentication state:

```javascript
import { useAuth } from './context/AuthContext'

function MyComponent() {
  const { user, token, login, logout } = useAuth()
  // ...
}
```

**Available:**
- `user`: Current user object
- `token`: JWT access token
- `setToken`: Set authentication token
- `logout`: Clear authentication
- `loading`: Loading state

### CartContext

Manages shopping cart operations:

```javascript
import { useCart } from './context/CartContext'

function MyComponent() {
  const { cart, addToCart, removeFromCart, checkout } = useCart()
  // ...
}
```

**Available:**
- `cart`: Current cart object
- `loading`: Loading state
- `error`: Error message
- `fetchCart()`: Refresh cart from API
- `addToCart(variantId, quantity)`: Add item to cart
- `removeFromCart(itemId)`: Remove item from cart
- `updateCartItem(itemId, quantity)`: Update item quantity
- `checkout(paymentMethod)`: Process checkout

## API Integration

The frontend communicates with the backend API at `http://localhost:8000/api/`

### Authentication Endpoints

- `POST /auth/register/` - User registration
- `POST /auth/login/` - User login
- `POST /auth/logout/` - User logout

### Product Endpoints

- `GET /products/` - List all products
- `GET /products/{id}/` - Get product details

### Cart Endpoints

- `GET /cart/` - Get current cart
- `POST /cart/add/` - Add item to cart
- `DELETE /cart/item/{id}/` - Remove item from cart
- `PATCH /cart/item/{id}/` - Update item quantity
- `POST /checkout/` - Process checkout

### Error Handling

All 401 Unauthorized responses automatically redirect to login page. API errors are displayed in the UI with user-friendly messages.

## Styling

Global styles use CSS custom properties (variables) for easy theming:

```css
:root {
  --primary: #2563eb;
  --secondary: #64748b;
  --success: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;
  /* ... more variables */
}
```

### Responsive Design

- Mobile-first approach
- Breakpoints: 768px (tablet), 1200px (desktop)
- Flexbox and CSS Grid for layouts
- Responsive typography

## Testing

Currently using manual testing. For automated testing:

```bash
# Install testing dependencies
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom

# Run tests
npm run test
```

## Performance Optimization

- Code splitting for routes
- Lazy loading components
- Image optimization
- Minified production build
- CSS-in-JS optimization
- Tree shaking unused code

## Security

- JWT token stored in localStorage
- CSRF protection via API
- Content Security Policy ready
- Secure password input handling
- Input validation and sanitization

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers

## Troubleshooting

### CORS Issues

If you see CORS errors, ensure:
1. Backend is running at `http://localhost:8000`
2. `CORS_ALLOWED_ORIGINS` includes frontend URL in Django settings
3. Check `VITE_API_BASE` in `.env.local`

### 404 Errors on Routes

Ensure backend API is running and responding to requests. Check browser network tab.

### Login/Cart Issues

- Clear browser localStorage: `localStorage.clear()`
- Check JWT token validity
- Verify backend is running
- Check API endpoints in network tab

## Contributing

1. Follow the existing code style
2. Use descriptive branch names
3. Write meaningful commit messages
4. Test changes before submitting

## License

MIT
