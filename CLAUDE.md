# Project Guidelines

## Development Workflow

This project follows modern web development practices with focus on:
- **Performance**: Optimized loading and rendering
- **Accessibility**: WCAG compliant interfaces
- **Responsive Design**: Mobile-first approach
- **Security**: Input validation and secure API practices

## Code Standards

### JavaScript
- Use modern ES6+ features
- Implement proper error handling
- Follow consistent naming conventions
- Add JSDoc comments for complex functions

### CSS
- Use semantic class names
- Implement responsive breakpoints
- Prefer CSS Grid and Flexbox for layouts
- Use CSS custom properties for theming

### HTML
- Use semantic HTML5 elements
- Ensure proper heading hierarchy
- Include appropriate meta tags
- Optimize for SEO and accessibility

## Project Structure

```
/
├── css/           # Stylesheets
├── js/            # JavaScript modules
├── images/        # Static assets
├── api/           # Backend API endpoints
└── index.html     # Main application file
```

## Development Commands

### Local Development
```bash
# Start local server
python -m http.server 8000

# Or use Node.js
npx serve .
```

### Testing
```bash
# Run tests (when available)
npm test

# Check for linting issues
npm run lint
```

### Deployment
The project is configured for automatic deployment via Git hooks.

## API Integration

The project includes backend API endpoints for:
- User authentication
- Data processing
- File uploads
- Real-time communication

Ensure proper error handling and rate limiting for all API calls.

## Security Considerations

- Validate all user inputs
- Implement CORS policies
- Use HTTPS in production
- Sanitize data before display
- Implement proper authentication

## Performance Guidelines

- Optimize images and assets
- Minimize HTTP requests
- Use efficient loading strategies
- Implement caching where appropriate
- Monitor Core Web Vitals

## Browser Support

Target modern browsers with ES6+ support:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+