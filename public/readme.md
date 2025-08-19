# Public Assets for Application Assessment Software

This folder contains static assets and configuration files that are served directly by the web server.

## Files Overview

### Core Files
- **`index.html`** - Main HTML template with meta tags, loading screen, and PWA setup
- **`manifest.json`** - Progressive Web App configuration for installable experience
- **`robots.txt`** - Search engine crawler directives
- **`sitemap.xml`** - XML sitemap for SEO (to be created)

### Icons and Images (to be added)
- **`favicon.ico`** - Browser tab icon (32x32, 16x16)
- **`logo192.png`** - PWA icon for mobile devices
- **`logo512.png`** - PWA icon for high-resolution displays
- **`maskable-icon-192.png`** - Adaptive icon for Android
- **`maskable-icon-512.png`** - Adaptive icon for Android (high-res)
- **`og-image.png`** - Open Graph image for social media sharing
- **`twitter-image.png`** - Twitter card image

### Additional Assets Needed

#### Icons Directory (`/icons/`)
- `new-assessment.png` - Shortcut icon for creating assessments
- `dashboard.png` - Shortcut icon for dashboard
- `recommendations.png` - Shortcut icon for recommendations

#### Screenshots Directory (`/screenshots/`)
- `dashboard-wide.png` - Desktop dashboard screenshot (1280x720)
- `mobile-view.png` - Mobile app screenshot (750x1334)

## Icon Requirements

### Favicon
- Format: ICO or PNG
- Sizes: 16x16, 32x32, 48x48
- Transparent background recommended

### PWA Icons
- **192x192**: Used on Android home screen
- **512x512**: Used for splash screen and app icons
- **Maskable icons**: Android adaptive icons with safe zone

### Social Media Images
- **Open Graph**: 1200x630px (1.91:1 ratio)
- **Twitter Card**: 1200x675px (16:9 ratio)

## PWA Features

The manifest.json enables:
- **Installable app experience** on mobile and desktop
- **Offline capability** (when service worker is added)
- **Native app-like behavior** with standalone display
- **Custom theme colors** matching brand
- **App shortcuts** for quick actions

## SEO Configuration

The index.html includes:
- **Structured meta tags** for search engines
- **Open Graph tags** for social media
- **Twitter Card tags** for Twitter sharing
- **Semantic HTML** structure
- **Performance optimizations** with preconnect

## Security Headers

Consider adding these files for enhanced security:
- `.well-known/security.txt` - Security contact information
- `_headers` - Custom HTTP headers (if using Netlify/Vercel)

## Development Notes

1. **Local Development**: All public assets are served from this directory
2. **Build Process**: Files are copied as-is to the build output
3. **Environment Variables**: Use `%PUBLIC_URL%` prefix in HTML
4. **Asset Optimization**: Consider optimizing images before deployment

## Deployment Checklist

- [ ] Add all required icon files
- [ ] Optimize images for web (WebP format recommended)
- [ ] Update manifest.json with correct domain
- [ ] Add sitemap.xml with actual routes
- [ ] Configure proper HTTP headers
- [ ] Test PWA installation on mobile devices
- [ ] Validate all meta tags with social media debuggers

## Brand Guidelines

When creating icons and images:
- **Primary Color**: #2563eb (blue-600)
- **Background**: #f8fafc (slate-50)
- **Font**: Inter (included via Google Fonts)
- **Style**: Modern, clean, professional
- **Logo**: Should represent AI/technology assessment theme