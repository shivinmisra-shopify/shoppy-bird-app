# Shoppy Bird v2 - Deployment Guide

## 🚀 Production Deployment

### Quick Deploy to Vercel

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

2. **Automatic Deployment**
   - Push to main branch for automatic deployment
   - Vercel will automatically build and deploy

### Build Configuration

- **Framework**: Next.js 15.3.2
- **Node.js Version**: 20.x
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## 🔧 Environment Setup

### Production Environment Variables
```bash
NODE_ENV=production
NEXT_PUBLIC_GAME_VERSION=2.0.0
```

### Build Settings
- **SWC Minification**: Enabled
- **React Strict Mode**: Enabled
- **Console Removal**: Production only (keeps errors/warnings)
- **Image Optimization**: WebP/AVIF formats

## 📊 Performance Optimizations

### Caching Strategy
- **Static Assets**: 1 year cache (`max-age=31536000`)
- **Game Assets**: Immutable caching
- **Dynamic Content**: Standard Next.js caching

### Security Headers
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security` for HTTPS
- `Referrer-Policy: origin-when-cross-origin`

## 📱 PWA Features

### Installable Game
- **Manifest**: `/public/manifest.json`
- **Standalone Display**: Full-screen mobile experience
- **Landscape Orientation**: Optimized for gaming
- **Offline Capability**: Core game assets cached

### Mobile Optimization
- **Touch Controls**: Optimized for mobile devices
- **Responsive Design**: Works on all screen sizes
- **Viewport Settings**: Optimized for mobile gaming

## 🎮 Game-Specific Features

### Performance Features
- **Dynamic Imports**: Phaser loaded client-side only
- **Asset Preloading**: All game assets preloaded
- **Procedural Generation**: Pipes and clouds generated at runtime
- **Object Pooling**: Efficient memory management

### Responsive Gaming
- **Mobile Detection**: Different controls for mobile vs desktop
- **Adaptive UI**: Text and buttons scale with screen size
- **Touch-Friendly**: Large buttons and touch areas on mobile

## 🔍 Monitoring & Analytics

### Performance Monitoring
- **Lighthouse Scores**: Aim for 90+ in all categories
- **Core Web Vitals**: Optimized for gaming experience
- **Bundle Analysis**: Monitor JavaScript bundle size

### Error Tracking
- Console errors preserved in production
- Phaser physics debug disabled in production
- Graceful error handling for game failures

## 📈 Deployment Checklist

### Pre-Deployment
- [ ] Run `npm run build` locally
- [ ] Test production build with `npm run start`
- [ ] Verify mobile responsiveness
- [ ] Check game performance on different devices
- [ ] Validate PWA manifest

### Post-Deployment
- [ ] Verify deployment URL accessibility
- [ ] Test game functionality on live site
- [ ] Check mobile installation capability
- [ ] Monitor performance metrics
- [ ] Verify all routes work correctly

## 🛠 Maintenance

### Regular Updates
- Keep dependencies updated (especially Phaser and Next.js)
- Monitor security advisories
- Update game balance based on user feedback
- Optimize asset sizes as needed

### Backup Strategy
- Source code in Git repository
- Game assets backed up separately
- High score data persisted in localStorage
- Configuration files versioned

## 📊 Performance Targets

### Loading Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Game Performance
- **Frame Rate**: Consistent 60 FPS
- **Input Latency**: < 16ms
- **Memory Usage**: < 100MB
- **Asset Load Time**: < 3s

## 🌐 Domain Configuration

### Custom Domain Setup
1. Add domain in Vercel dashboard
2. Configure DNS records
3. Enable HTTPS (automatic)
4. Update manifest.json if needed

### SEO Optimization
- Meta tags optimized for game discovery
- Open Graph tags for social sharing
- Structured data for gaming content
- Sitemap for search engines

---

## 🎯 Success Metrics

- **User Engagement**: Session duration and return visits
- **Performance**: Lighthouse scores and Core Web Vitals
- **Accessibility**: Mobile installation rate
- **Stability**: Error rate and crash reports

Built with ❤️ using Next.js 15, Phaser 3, and modern web technologies.