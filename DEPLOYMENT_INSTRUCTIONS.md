# JENKSALPHA.COM DEPLOYMENT INSTRUCTIONS

## Domain Configuration (once jenksalpha.com is purchased)

### 1. Netlify Custom Domain Setup
1. Go to Netlify dashboard → Domain management
2. Add custom domain: jenksalpha.com
3. Configure DNS records:
   - A record: @ → 75.2.60.5
   - CNAME: www → jenksalpha.netlify.app

### 2. Subdomain Configuration  
1. Add subdomains in Netlify:
   - crypto.jenksalpha.com
   - course.jenksalpha.com
2. Configure DNS:
   - CNAME: crypto → jenksalpha.netlify.app
   - CNAME: course → jenksalpha.netlify.app

### 3. Professional Email Setup
1. Set up email hosting (Google Workspace recommended)
2. Configure MX records for jenksalpha.com
3. Create professional addresses:
   - hello@jenksalpha.com
   - signals@jenksalpha.com  
   - crypto@jenksalpha.com
   - course@jenksalpha.com
   - support@jenksalpha.com

### 4. SSL & Security
- SSL certificates: Automatic via Netlify
- Security headers: Configured in netlify.toml
- Domain verification: Complete in Netlify dashboard

## File Structure
```
jenksalpha-deployment/
├── index.html (main landing page)
├── main/ (signals platform)
├── crypto/ (crypto signals)
├── course/ (trading course)
├── email-templates/
└── netlify.toml (configuration)
```

## Deployment Steps
1. Upload entire jenksalpha-deployment/ to Netlify
2. Configure custom domain in Netlify dashboard
3. Update DNS records at domain registrar
4. Verify SSL certificates
5. Test all subdomains and functionality

## Post-Deployment
1. Update all marketing materials with new domain
2. Set up analytics and tracking
3. Configure email marketing with professional addresses
4. Begin customer acquisition with professional domain

---
**RESULT: Professional jenksalpha.com business empire**
