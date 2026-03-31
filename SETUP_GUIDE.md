# SETUP_GUIDE.md

# EdLink Offline Inspection - Complete Setup Guide

This guide walks you through all steps to set up, develop, and deploy the application.

## Prerequisites

Before starting, ensure you have:

- **Node.js** 16 or higher ([Download](https://nodejs.org/))
- **npm** 7+ (comes with Node.js)
- **Git** (optional, for version control)
- **Windows 10/11** (or macOS/Linux)
- **Updated OS** with latest security patches

### Verify Installation

```bash
node --version    # Should show v16 or higher
npm --version     # Should show 7 or higher
```

## Step-by-Step Setup

### 1. Clone or Download the Repository

```bash
# If using Git
git clone https://github.com/edlink/offline-inspection.git
cd EdLinkOpsOfflineInspection_v2

# OR manually extract the ZIP file
```

### 2. Install Dependencies

```bash
# From the project directory
npm install
```

This will:
- Download all required packages
- Install Electron, Vue, Prisma, and dependencies
- Build native modules for SQLite
- Generate Prisma client

**Time estimate**: 5-10 minutes on first install

### 3. Configure Environment

```bash
# Copy the example config
cp .env.example .env
```

Edit the `.env` file with your settings:

```env
# Database location (leave as-is for local)
DATABASE_URL="file:./offline-inspection.db"

# API Server Configuration
VITE_APP_API_URL=http://your-edlink-server/api
# Example: VITE_APP_API_URL=https://api.edlink.org/api

# Application Info
VITE_APP_NAME="EdLink Offline Inspection"
VITE_APP_VERSION=2.0.0

# Environment
NODE_ENV=development

# Sync Settings
SYNC_INTERVAL_MS=30000      # Sync every 30 seconds when online
SYNC_RETRY_ATTEMPTS=3       # Try up to 3 times
SYNC_BATCH_SIZE=50          # Process 50 records per batch

# Logging
LOG_LEVEL=info              # debug|info|warn|error
```

### 4. Generate Prisma Client

```bash
npm run db:generate
```

This creates the database client from the schema.

### 5. Initialize Database

On first run, the application will automatically:
- Create the SQLite database file
- Run all migrations
- Initialize tables with proper schema
- Create indexes

No manual setup needed!

---

## Development Workflow

### Running the Application

#### Option A: Combined Development Server (Recommended)

```bash
npm run electron:dev
```

This starts:
- Vite dev server on http://localhost:5173
- Electron app window
- Hot reload on file changes

### Option B: Separate Terminals

**Terminal 1**: Start the Vite dev server
```bash
npm run dev
```

Output will show:
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

**Terminal 2** (in another window): Start Electron
```bash
npm run electron
```

Wait for the Vite message before running Electron.

### Hot Reload

When you edit files:
- **Vue files** (.vue): Auto-reload in app
- **TypeScript files** (.ts): May need manual reload
- **CSS changes**: Auto-reload
- **Electron main**: Full app restart needed

### Stopping the Application

Press `Ctrl + C` in the terminal where the app is running.

---

## Database Management

### Using Prisma Studio

View and edit database data visually:

```bash
npm run db:studio
```

Opens http://localhost:5555 with:
- Browse all tables
- Create/edit/delete records
- Run raw SQL
- View relationships

### Making Database Changes

1. **Modify** `prisma/schema.prisma`

2. **Create migration**:
```bash
npm run db:migrate
```

3. **When prompted**, give your migration a name:
```
Enter migration name: add_new_column
```

4. **Review** the generated SQL (if needed)

5. **The migration applies automatically**

### Resetting Database

```bash
# Warning: This deletes all local data!
rm offline-inspection.db
rm offline-inspection.db-shm
rm offline-inspection.db-wal
```

The app will recreate on next start.

### Backing Up Database

```bash
# Create a backup
cp offline-inspection.db offline-inspection.db.backup.$(date +%Y%m%d_%H%M%S)
```

---

## Development Tasks

### Type Checking

Verify TypeScript files have no errors:

```bash
npm run type-check
```

### Code Linting

Check code quality:

```bash
npm run lint
```

Fix automatically:

```bash
npm run lint -- --fix
```

### Running Tests

```bash
npm run test
```

With UI:

```bash
npm run test:ui
```

---

## Building for Production

### Creating the Windows Installer

```bash
npm run build
```

This:
1. Builds Vue app (`dist/` folder)
2. Compiles Electron main process
3. Packages with electron-builder
4. Creates installer and portable exe

**Output files**:
```
dist-electron/
├── EdLink Offline Inspection Setup 2.0.0.exe  (Installer - 150MB)
└── EdLink Offline Inspection 2.0.0.exe        (Portable - 120MB)
```

### Building Web Only

```bash
npm run build:web
```

Creates only the web app in `dist/` folder.

### Signing (Windows Code Signing)

For production, add certificate in `package.json`:

```json
"build": {
  "win": {
    "certificateFile": "/path/to/certificate.pfx",
    "certificatePassword": "password"
  }
}
```

---

## Debugging

### Enable Developer Tools

During development:
- Press `Ctrl + Shift + I` to open DevTools
- Console shows errors and logs
- Inspector for DOM debugging

### Debug Mode

Set in `.env`:

```env
LOG_LEVEL=debug
NODE_ENV=development
```

### Enabling Detailed Logs

```typescript
// In any service file
const logger = createLogger('MyModule');
logger.debug('Detailed message', data);
logger.info('Information message');
logger.warn('Warning message', error);
logger.error('Error message', error);
```

View logs in:
- Browser console (in app dev tools)
- Electron console (main process)

---

## Troubleshooting

### Problem: npm install fails

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules
rm package-lock.json

# Try install again
npm install
```

### Problem: Prisma client not found

```bash
npm run db:generate
```

### Problem: Port 5173 already in use

```bash
# Kill process on port 5173
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5173 | xargs kill -9
```

### Problem: Database locked

```bash
# Stop the app, then:
rm offline-inspection.db-shm
rm offline-inspection.db-wal
# Restart app
```

### Problem: Electron won't start

1. Check if Vite dev server is running (`npm run dev`)
2. Wait a few seconds before starting Electron
3. Check terminal for error messages
4. Try `npm run electron -- --disable-gpu`

---

## Next Steps

### Ready to Start Developing?

1. ✅ Install dependencies
2. ✅ Configure `.env`
3. ✅ Run `npm run electron:dev`
4. ✅ Open the app
5. ✅ Start editing files in `src/`

### Where to Start?

- **New Pages**: Create in `src/pages/`
- **New Components**: Add to `src/components/`
- **Business Logic**: Add to `src/services/`
- **State**: Modify `src/store/modules/`
- **Styles**: Edit CSS in `.vue` files

### Important Files

- `src/App.vue` - Root component
- `src/main.ts` - App entry point
- `src/router/index.ts` - Routes configuration
- `src/store/index.ts` - Vuex store
- `main/electron-main.ts` - Electron window management
- `prisma/schema.prisma` - Database schema

---

## Getting Help

### Documentation

- **Full Implementation**: See `IMPLEMENTATION.md`
- **API Contracts**: See `IMPLEMENTATION.md#API-Contracts`
- **Database Schema**: See `IMPLEMENTATION.md#Database-Design`

### Common Issues

Check `IMPLEMENTATION.md#Troubleshooting-Guide` for:
- Database issues
- Sync problems
- Performance tips
- Security questions

### Logging Issues

Check all logs:
- **Browser console**: Frontend errors
- **Electron console**: Main process errors
- **Terminal**: Build and startup messages

---

## Development Best Practices

### File Organization

```
src/
├── pages/          # Full page components
├── components/     # Reusable components
├── services/       # Business logic
├── store/          # State management
├── router/         # Routing
├── utils/          # Helper functions
└── types.d.ts      # Type definitions
```

### Naming Conventions

- **Components**: PascalCase (Dashboard.vue)
- **Functions**: camelCase (getInspections)
- **Constants**: UPPER_CASE (API_URL)
- **Files**: kebab-case or PascalCase

### Code Style

- **TypeScript**: Strict mode enabled
- **Vue**: Composition API OR Options API (consistent)
- **Formatting**: Prettier (optional)
- **Linting**: ESLint with Vue plugin

### Testing

Write tests for:
- Service functions
- Store actions
- Utility functions
- Business logic

---

## Performance Tips

1. **Use Pagination**: Load 50 records at a time
2. **Lazy Load**: Components import only when needed
3. **Index Queries**: Frequently searched columns
4. **Cache Results**: Store SearchResults in Vuex
5. **Debounce Input**: On search fields

---

## Security Reminders

- ✅ Never commit `.env` file
- ✅ Never hardcode API keys
- ✅ Validate all user input
- ✅ Use HTTPS for API calls
- ✅ Keep dependencies updated

```bash
# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## Deployment Checklist

Before releasing to production:

- [ ] Update version in `package.json`
- [ ] Update `VITE_APP_VERSION` in `.env`
- [ ] Run `npm run type-check` (no errors)
- [ ] Run `npm run lint` (no errors)
- [ ] Test all features offline
- [ ] Test sync functionality
- [ ] Build production app: `npm run build`
- [ ] Test installer
- [ ] Test portable exe
- [ ] Create release notes
- [ ] Upload to distribution server

---

## Quick Reference

```bash
# Development
npm run electron:dev       # Start dev app

# Database
npm run db:studio         # Open data browser
npm run db:migrate        # Create migration
npm run db:generate       # Regenerate client

# Code Quality
npm run type-check        # Check TypeScript
npm run lint             # Check code style
npm run test             # Run tests

# Production
npm run build            # Build installer & portable
npm run build:web        # Build web only

# Cleanup
npm cache clean --force
rm -rf node_modules
npm install
```

---

## Support

For issues:
1. Check this guide first
2. Look at IMPLEMENTATION.md  
3. Check GitHub issues
4. Review logs for errors
5. Contact development team

---

**Last Updated**: March 13, 2026  
**Version**: 2.0.0-setup-guide
