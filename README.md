# EdLink Offline Inspection Application - v2.0.0

A complete desktop application for offline inspection management, built with Electron, Vue 3, TypeScript, and SQLite.

## Features

✅ **Zero Pre-Download Requirement** - Start working immediately without online mode preparation  
✅ **Offline-First Architecture** - Complete functionality without internet connection  
✅ **SQLite Local Database** - Robust local storage handling thousands of inspections  
✅ **Intelligent Sync** - Delta-sync with automatic queuing when reconnected  
✅ **Parent-Child Relationships** - Preserves database relationships and ID mappings  
✅ **Multi-Inspection Support** - Work on multiple inspections simultaneously  
✅ **Comprehensive Search** - Fast indexed searching on metadata  
✅ **Electron Desktop App** - Standalone application, no browser required  

## Technology Stack

- **Frontend**: Vue 3 + TypeScript
- **Desktop**: Electron 27+
- **Database**: SQLite + Prisma ORM
- **State Management**: Vuex
- **Build Tools**: Vite + Electron Builder
- **Network**: Axios for API calls
- **Styling**: CSS3

## Project Structure

```
EdLinkOpsOfflineInspection_v2/
├── main/                          # Electron main process
│   ├── electron-main.ts          # App initialization
│   └── preload.ts                # IPC bridge
├── src/
│   ├── main.ts                   # Vue app entry
│   ├── App.vue                   # Root component
│   ├── pages/                    # Page components
│   │   ├── Dashboard.vue
│   │   ├── InspectionSearch.vue
│   │   └── InspectionDetail.vue
│   ├── components/               # Reusable components
│   ├── services/
│   │   └── database/
│   │       ├── db-connection.ts  # Database initialization
│   │       ├── inspection.service.ts  # Inspection operations
│   │       └── sync.service.ts   # Sync operations
│   ├── store/
│   │   ├── index.ts
│   │   └── modules/
│   │       ├── inspection.ts     # Inspection state
│   │       └── sync.ts           # Sync state
│   ├── router/
│   │   └── index.ts              # Vue Router config
│   ├── utils/
│   │   └── logger.ts             # Logging utility
│   └── types.d.ts                # TypeScript definitions
├── prisma/
│   └── schema.prisma             # Database schema
├── public/
│   └── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.example
```

## Installation & Setup

### Prerequisites

- Node.js 16+ and npm
- Windows 10+ (or macOS/Linux)

### Step 1: Install Dependencies

```bash
cd EdLinkOpsOfflineInspection_v2
npm install
```

### Step 2: Setup Environment

```bash
cp .env.example .env
# Edit .env with your API configuration
```

Update the `.env` file:
```
DATABASE_URL="file:./offline-inspection.db"
VITE_APP_API_URL=http://your-api-server/api
VITE_APP_VERSION=2.0.0
```

### Step 3: Generate Prisma Client

```bash
npm run db:generate
```

### Step 4: Run the Application

#### Development Mode (Web + Electron)
```bash
# Terminal 1: Start development server
npm run dev

# Terminal 2 (in another window): Start Electron
npm run electron
```

#### Combined Development (Web + Electron together)
```bash
npm run electron:dev
```

#### Build for Production
```bash
npm run build
```

## Development Workflow

### Add Database Migration

After modifying `prisma/schema.prisma`, create a migration:

```bash
npm run db:migrate
```

Follow the prompts to name your migration (e.g., "add_new_table").

### Database Studio

Inspect and manage data with Prisma Studio:

```bash
npm run db:studio
```

Opens browser at `http://localhost:5555`

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## API Integration

The application communicates with EdLink Ops backend API.

### Required Endpoints

```
POST   /api/sync/apply          # Apply local changes to server
POST   /api/sync/delta          # Fetch delta changes from server
GET    /api/inspection/list     # Get user's inspection list
GET    /api/inspection/:id      # Get full inspection details
GET    /api/lookup/all          # Get lookup data
POST   /api/inspection/update   # Update inspection
```

### Request/Response Format

**Sync Delta Request:**
```typescript
{
  since: "2024-03-13T10:00:00Z",
  userId: "user@edlink.org"
}
```

**Sync Delta Response:**
```typescript
{
  changes: [
    {
      entityType: "InspectionScheduling",
      entityId: "123456",
      entityData: { ... },
      timestamp: "2024-03-13T10:30:00Z"
    }
  ]
}
```

## Database Schema Overview

### Core Tables

- **Entity**: Centers/facilities being inspected
- **ActionRequest**: Inspection requests linked to entities
- **AllInspectionScheduling**: Scheduled inspections  
- **InspectionScheduling**: Action-specific inspections
- **ActionItem**: Individual inspection items/tasks
- **ActionItemData**: Data for action items

### System Tables

- **SyncOperation**: Queues pending changes
- **SyncMetadata**: Tracks sync history
- **OfflineSession**: User session tracking

## Features Explained

### 1. Offline-First Design

The application prioritizes offline functionality:
- All operations work without internet
- Data stored locally in SQLite
- Automatic sync when reconnected
- No pre-download requirements

### 2. Smart Synchronization

- **Delta Sync**: Only changed records are synced
- **Retry Logic**: Failed syncs retry up to 3 times
- **Batching**: Large transfers split into manageable batches
- **Queuing**: Changes queue automatically when offline
- **Conflict Resolution**: Local data favored when timestamps equal

### 3. Relationship Preservation

Database schema maintains:
- Parent-child relationships via foreign keys
- ActionRequest ID mappings preserved
- AllInspectionScheduling associations
- Referential integrity

### 4. Performance Optimization

- Indexed columns for fast searches
- Connection pooling
- Write-Ahead Logging (WAL) for concurrency
- Query result caching in Vuex store

## Building for Production

### Windows Installer

```bash
npm run build
```

Creates:
- `dist-electron/EdLink Offline Inspection Setup 2.0.0.exe` (Installer)
- `dist-electron/EdLink Offline Inspection 2.0.0.exe` (Portable)

### macOS

```bash
npm run build
```

Creates `.dmg` and `.pkg` files

## Troubleshooting

### Database Locked Error
- Close all instances of the application
- Delete `offline-inspection.db-shm` and `offline-inspection.db-wal` files
- Restart the application

### Sync Failures
- Check `VITE_APP_API_URL` in `.env` is correct
- Verify server API endpoints are accessible
- Check network connectivity
- Review detailed logs in console

### Prisma Client Issues
```bash
rm -rf node_modules/.prisma
npm run db:generate
```

## Testing

```bash
npm run test
```

## Deployment Checklist

- [ ] Update version in `package.json`
- [ ] Update `VITE_APP_VERSION` in `.env`
- [ ] Run `npm run type-check` - no errors
- [ ] Run `npm run lint` - no errors
- [ ] Test offline functionality
- [ ] Test sync with backend
- [ ] Build production executable
- [ ] Test installer
- [ ] Update documentation
- [ ] Create release notes

## Security Considerations

- Electron sandbox enabled
- Context isolation enabled  
- No Node.js integration in renderer
- Secure IPC with preload script
- HTTPS for all API calls
- Local database no sensitive plaintext

## Performance Benchmarks (Target)

- **App Startup**: < 2 seconds
- **Search**: < 500ms for 1000 records
- **Sync**: < 10s for 100 records
- **Memory**: < 256MB under normal load
- **Database Size**: < 500MB for 1000+ inspections

## Support & Issues

For issues or feature requests:
1. Check existing GitHub issues
2. Provide detailed error message
3. Include version information
4. Share database size if relevant

## License

Copyright © EdLink. All rights reserved.

## Version History

### v2.0.0 (Current)
- Complete Electron migration
- SQLite database (replacing PouchDB)
- Zero pre-download requirement
- Delta sync implementation
- Multi-inspection support
- Improved performance

### v1.0.0 (Previous)
- PouchDB-based solution
- Vue 2 + Web App
- Limited offline capabilities

---

**Last Updated**: March 13, 2026  
**App Version**: 2.0.0
#   E d L i n k O p s O f f l i n e I n s p e c t i o n _ v 2  
 