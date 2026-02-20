# ArchiveBase - Smart Archive & Data Lifecycle Manager for Airtable

**The missing archive solution for Airtable bases approaching record limits.**

ArchiveBase automatically archives old records to external storage, keeping your Airtable base fast and within limits while maintaining searchability through metadata.

## 🎯 Problem Solved

- **54% of Airtable users** cite performance issues above 100K records
- No native archiving solution exists in Airtable
- Users manually duplicate bases and delete records (risky & tedious)
- Airtable bases slow down as record counts increase

## ✨ Features

- **Automated Archiving**: Set rules to auto-archive old/completed records
- **Smart Rules**: Age-based, status-based, or custom filter rules
- **CSV Export**: Archives exported as downloadable CSV files (MVP)
- **One-Click Restore**: Easy restoration of archived data (roadmap)
- **Dashboard**: Track record counts, archive history, storage savings
- **Configurable**: Flexible rules for different tables and use cases

## 💰 Pricing

- **Free**: 500 records/month, 1 base
- **Pro ($29/mo)**: Unlimited records, 10 bases, scheduled archives
- **Team ($79/mo)**: Unlimited bases, team management, compliance features

## 🛠️ Tech Stack

- **Frontend**: Airtable Extension (React + TypeScript)
- **SDK**: @airtable/blocks
- **Backend**: Next.js API routes (Vercel) - future integration
- **Billing**: Lemon Squeezy (structure ready)
- **Storage**: CSV export (MVP), cloud storage (roadmap)

## 📦 Installation

### Prerequisites

- Node.js 16+ and npm
- Airtable account with a base
- Airtable Blocks CLI (optional, for development)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/anish632/archivebase-airtable.git
   cd archivebase-airtable
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the extension locally**
   ```bash
   npm run dev
   ```

4. **Add to your Airtable base**
   - Open your Airtable base
   - Click "Extensions" in the top-right
   - Click "Add an extension"
   - Choose "Build a custom extension"
   - Click "Remix from GitHub" and paste the repo URL
   - Or run `npx @airtable/blocks-cli init` to scaffold

### Development Workflow

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Release to Airtable
npm run release
```

## 🚀 Usage

### 1. Create Archive Rules

Navigate to the **Archive Rules** tab:

- Click "Add Rule"
- Choose rule type:
  - **Age-based**: Archive records older than X days
  - **Status-based**: Archive records with specific status
- Configure the rule parameters
- Enable/disable rules as needed

### 2. Archive Records

Navigate to the **Archive Now** tab:

- Select the table to archive
- Select an archive rule
- Click "Scan for Matching Records"
- Review the count and click "Archive & Delete Records"
- Records are exported to CSV and deleted from Airtable

### 3. Monitor Dashboard

The **Dashboard** tab shows:

- Total records in base
- Archived records count
- Storage saved
- Last archive date
- Usage stats for your plan

## 📁 Project Structure

```
archivebase-airtable/
├── frontend/               # Airtable extension UI
│   ├── components/         # React components
│   │   ├── Dashboard.tsx
│   │   ├── ArchiveRules.tsx
│   │   ├── ArchiveExecutor.tsx
│   │   └── Pricing.tsx
│   ├── utils/              # Utility functions
│   │   ├── csvExport.ts
│   │   └── recordFilter.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   └── index.tsx           # Main app entry
├── backend/                # Next.js backend (future)
│   └── api/                # API routes
│       ├── archive.ts
│       └── billing.ts
├── block.json              # Airtable extension config
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Configuration

### Archive Rules

**Age-based rules:**
```typescript
{
  type: 'age',
  field: 'Created Date',
  olderThanDays: 365
}
```

**Status-based rules:**
```typescript
{
  type: 'status',
  field: 'Status',
  statusValue: 'Completed'
}
```

### Global Config Storage

Rules and stats are persisted using Airtable's `globalConfig`:

- `archiveRules`: Array of archive rule configurations
- `archiveStats`: Archive statistics and history

## 🗺️ Roadmap

### MVP (Current)
- ✅ Archive rules UI
- ✅ Record scanning
- ✅ CSV export
- ✅ Dashboard with stats
- ✅ Age-based rules
- ✅ Status-based rules

### Phase 2
- [ ] Cloud storage integration (S3/Google Cloud)
- [ ] One-click restore functionality
- [ ] Scheduled/automated archives
- [ ] Email notifications
- [ ] Lemon Squeezy billing integration

### Phase 3
- [ ] Team management features
- [ ] Audit logs & compliance
- [ ] Custom retention policies
- [ ] Advanced search in archives
- [ ] Bulk restore operations

## 🧪 Testing

To test the extension:

1. Create a test Airtable base with sample data
2. Add date and status fields to your table
3. Create archive rules based on those fields
4. Use "Archive Now" to test the archiving flow
5. Check that CSV exports correctly
6. Verify records are deleted from Airtable

## 🤝 Contributing

Contributions welcome! Areas for improvement:

- Additional archive rule types
- Cloud storage integrations
- Restore functionality
- UI/UX enhancements
- Performance optimizations

## 📄 License

MIT License - feel free to use and modify

## 🐛 Known Issues

- Custom filter formulas not yet implemented
- Backend API endpoints are stubs (future integration)
- Lemon Squeezy billing not yet configured
- Restore functionality not yet built

## 💡 Support

For issues or questions:
- Open a GitHub issue
- Email: [your-email]
- Documentation: [link to docs]

## 🙏 Acknowledgments

Built with:
- [@airtable/blocks](https://www.npmjs.com/package/@airtable/blocks)
- React & TypeScript
- Next.js (backend)

---

**Made with ♥ for Airtable users tired of manual archiving**
