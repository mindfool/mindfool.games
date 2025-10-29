# Vercel Domain Setup for app.mindfool.games

## Current Status

- ✅ App deployed to Vercel: https://mindfoolgames-ct7fgdbg7-favourses-projects.vercel.app
- ✅ GitHub repository connected: https://github.com/mindfool/mindfool.games
- ⏳ Custom domain needs to be added: app.mindfool.games

## Steps to Add Custom Domain

### 1. Access Vercel Dashboard

Go to: https://vercel.com/favourses-projects/mindfool.games/settings/domains

### 2. Add Domain

1. Click "Add Domain"
2. Enter: `app.mindfool.games`
3. Click "Add"

### 3. Configure DNS

Vercel will provide DNS records. You'll need to add these to your domain registrar (Namecheap):

**Option A: If using Vercel nameservers (recommended)**
- Already configured for mindfull.games
- Should automatically work for app.mindfool.games subdomain

**Option B: If using Namecheap nameservers**
Add CNAME record:
```
Type: CNAME
Host: app
Value: cname.vercel-dns.com
TTL: Automatic
```

### 4. Verify Domain

- Vercel will automatically verify the DNS configuration
- This may take a few minutes to propagate
- Once verified, the domain will show as "Valid"

### 5. SSL Certificate

Vercel automatically provisions SSL certificates via Let's Encrypt.
- This happens automatically after DNS verification
- Usually takes 1-2 minutes

## Verification

Once complete, the app will be accessible at:
- https://app.mindfool.games

## Additional Configuration

### Redirect www subdomain (optional)

If you want www.app.mindfool.games to redirect to app.mindfool.games:
1. Add `www.app.mindfool.games` as a domain
2. Vercel will automatically redirect it

### Production Branch

The `main` branch is set as the production branch. Every push to `main` automatically triggers a new deployment.

## Deployment Info

- **Project**: mindfool.games
- **Team**: favourses-projects
- **Build Command**: `npm run build:web`
- **Output Directory**: `dist`
- **Install Command**: Auto-detected (npm install)

## Current Deployment

Latest production deployment: https://mindfoolgames-ct7fgdbg7-favourses-projects.vercel.app

View deployment logs:
```bash
npx vercel inspect mindfoolgames-ct7fgdbg7-favourses-projects.vercel.app --logs
```

## Troubleshooting

### Domain not verifying
- Check DNS propagation: https://dnschecker.org
- Ensure you're adding the CNAME to the correct domain (mindfool.games)
- Wait up to 48 hours for full DNS propagation (usually much faster)

### Build failing
- Check build logs in Vercel dashboard
- Verify all dependencies are in package.json
- Test build locally: `npm run build:web`

### App not loading
- Check browser console for errors
- Verify all API endpoints are configured
- Check Expo Web compatibility for any native-specific code

## Notes

- The web app shares the same codebase as the React Native app
- Metro bundler is used for both web and native builds
- AsyncStorage persistence is temporarily disabled (needs re-enabling after native fix)
