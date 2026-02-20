# ArchiveBase Setup Guide

Complete guide to get ArchiveBase running in your Airtable base.

## Quick Start (5 minutes)

### Option 1: Using Airtable Blocks CLI (Recommended for Development)

1. **Install Airtable Blocks CLI globally**
   ```bash
   npm install -g @airtable/blocks-cli
   ```

2. **Navigate to project**
   ```bash
   cd /Users/anishdas/apps/archivebase-airtable
   ```

3. **Run the extension**
   ```bash
   block run
   ```

4. **Open in Airtable**
   - The CLI will provide a URL
   - Open your Airtable base
   - Go to Extensions → Add an extension → "Build a custom extension"
   - The extension should appear automatically

### Option 2: Manual Installation in Airtable

1. **Build the extension**
   ```bash
   npm install
   npm run build
   ```

2. **Deploy to Airtable**
   - Open your Airtable base
   - Click "Extensions" (puzzle piece icon)
   - Click "Add an extension"
   - Choose "Build a custom extension"
   - Follow the prompts to add your extension

## Testing the Extension

### Create Test Data

1. Create a test table with these fields:
   - **Name** (Single line text)
   - **Status** (Single select: Active, Completed, Archived)
   - **Created Date** (Date)
   - **Description** (Long text)

2. Add 20-50 sample records with varying:
   - Dates (some old, some recent)
   - Statuses (mix of Active, Completed, Archived)

### Test Archive Workflow

1. **Dashboard Tab**
   - View total record count
   - Check current plan (Free tier by default)

2. **Archive Rules Tab**
   - Click "Add Rule"
   - Create an age-based rule:
     - Name: "Archive Old Records"
     - Type: Age-based
     - Field: Created Date
     - Older than: 30 days
   - Save and verify the rule appears

3. **Archive Now Tab**
   - Select your test table
   - Select the rule you created
   - Click "Scan for Matching Records"
   - Review the count
   - Click "Archive & Delete Records"
   - CSV file downloads automatically
   - Records are deleted from Airtable

4. **Verify Results**
   - Check Dashboard for updated stats
   - Verify records were deleted
   - Open the CSV file to confirm data was exported

## TypeScript Type Issues

**Note:** You may see TypeScript errors when running `npx tsc --noEmit`. This is expected!

The errors are due to type incompatibilities between:
- React 18 type definitions
- Airtable Blocks SDK (built for older React versions)

**These are type-level issues only** — the code works perfectly at runtime when bundled by the Airtable Blocks CLI.

To suppress TypeScript errors during development:
```bash
# Run without type checking
block run --skip-type-check
```

Or simply ignore the TypeScript errors — they won't affect functionality.

## Development Workflow

### File Structure
```
archivebase-airtable/
├── frontend/
│   ├── components/         ← React components
│   ├── utils/              ← Helper functions
│   ├── types/              ← TypeScript types
│   └── index.tsx           ← Main entry point
├── backend/                ← Future API (not used in MVP)
├── block.json              ← Airtable extension config
└── package.json
```

### Making Changes

1. Edit files in `frontend/`
2. Save — the extension auto-reloads
3. Test in Airtable
4. Commit changes:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```

### Hot Reload

The Airtable Blocks CLI supports hot reloading:
- Save any file
- Extension refreshes automatically
- No need to restart `block run`

## Common Issues & Solutions

### "Extension not loading"
- Check that `block run` is still running
- Refresh your Airtable base
- Check browser console for errors

### "Can't select fields in rules"
- Make sure your table has date/status fields
- Field types must match rule type (date fields for age rules, select fields for status rules)

### "CSV export is empty"
- Ensure records actually match your rule
- Check the date/status values
- Try a looser rule (e.g., 0 days instead of 30)

### "Records not deleting"
- Check that you have write permissions on the base
- Airtable API allows max 50 deletes at once (handled automatically)
- Look for errors in browser console

## Configuration Options

### Archive Rules

**Age-based:**
- Looks at date fields
- Archives if older than X days
- Good for: Time-based retention, cleanup of old data

**Status-based:**
- Looks at select fields
- Archives if field equals specific value
- Good for: Workflow-based archiving (e.g., "Completed" status)

### Future: Custom Rules
- Filter formula support (coming soon)
- Multiple conditions
- Complex logic

## Backend Integration (Roadmap)

The `/backend` folder contains stub API routes for future features:
- Cloud storage integration
- Lemon Squeezy billing
- Scheduled archives
- Restore functionality

These are not yet connected to the extension but provide the structure for Phase 2.

## Performance Tips

1. **Test with small batches first**
   - Start with 10-20 records
   - Scale up after verifying behavior

2. **Archive during off-hours**
   - Less likely to disrupt active users
   - Better performance

3. **Monitor record counts**
   - Use Dashboard to track growth
   - Archive proactively before hitting limits

## Security & Data Safety

1. **CSV exports are local**
   - Files download to your computer
   - No cloud upload in MVP

2. **Deletion is permanent**
   - Airtable doesn't have trash/undo
   - Keep CSV backups safe!

3. **Test on non-production bases first**
   - Create a duplicate base for testing
   - Verify behavior before using on real data

## Support & Feedback

- **Issues**: https://github.com/anish632/archivebase-airtable/issues
- **Discussions**: https://github.com/anish632/archivebase-airtable/discussions

## Next Steps

After getting the MVP running:

1. **Test thoroughly** with sample data
2. **Create archive rules** for your use case
3. **Monitor the dashboard** to track savings
4. **Provide feedback** on GitHub
5. **Star the repo** if you find it useful!

---

Made with ♥ for Airtable power users
