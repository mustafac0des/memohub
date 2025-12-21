# Quick Start Guide - MemoHub 🚀

## What's New?

Your memo app has been completely modernized with:
- ✨ Beautiful modern UI with dark mode
- 🎨 Color-coded memos
- 📁 Category organization
- 🔍 Smart search & filtering
- ✏️ Full edit/delete functionality
- 📌 Pin important memos
- 🎯 Responsive design for all devices

## First Time Setup

### 1. Update Backend Dependencies
```bash
cd backend
npm install
```

### 2. Update Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Run Backend
```bash
cd backend
npm start
# or
node server.js
```

The backend will run on http://localhost:5000

### 4. Run Frontend
```bash
cd frontend
npm run dev
```

The frontend will run on http://localhost:5173

## Key Features

### 🎨 Color Categories
When creating a memo, choose from:
- Blue (default) - General notes
- Red - Important/Urgent
- Green - Completed/Success
- Amber - Warnings
- Purple - Ideas/Brainstorm
- Pink - Personal

### 📱 Works on Any Device
- **Desktop**: Full sidebar navigation
- **Tablet**: Optimized layout
- **Mobile**: Touch-friendly interface

### 🌙 Dark Mode
Toggle the theme with the sun/moon button in the header

### 🔍 Finding Memos
1. **By Category**: Click category in sidebar
2. **By Search**: Use search bar at the top
3. **By Sort**: Choose sorting order (newest, oldest, alphabetical)
4. **By Pin**: Pinned memos stay at top

### ✏️ Managing Memos
- **Edit**: Click edit button, modify, click save
- **Pin**: Click pin icon to pin/unpin
- **Delete**: Click delete button (will confirm)
- **Change Color**: Edit to change memo color
- **Change Category**: Edit to change category

## Database Changes

The memo table now includes:
- `id` - UUID (unique identifier)
- `content` - Your memo text
- `category` - Memo category
- `pinned` - Boolean (pinned status)
- `color` - Memo color code
- `createdAt` - Creation timestamp
- `updatedAt` - Last updated timestamp
- `UserId` - Owner reference

**Important**: The database will auto-migrate on first run.

## Tips & Tricks

✅ **Pro Tips**:
- Use categories to organize by topic
- Pin frequently accessed memos
- Use different colors for quick visual scanning
- Search to find memos by content
- Dark mode is easy on the eyes at night

⚡ **Keyboard Shortcuts**:
- Press Enter while typing to submit
- Clear search with the ✕ button
- Tab through form fields

## Need Help?

### Memos Not Loading?
1. Check browser console (F12)
2. Ensure backend is running on port 5000
3. Verify you're logged in (token in localStorage)

### Backend Won't Start?
1. Check MySQL is running
2. Verify database credentials in `.env`
3. Check backend logs for errors

### Styling Issues?
1. Clear browser cache (Ctrl+Shift+Delete)
2. Refresh page (Ctrl+R or Cmd+R)
3. Try different browser

## Next Steps

The app is ready to use! Go explore all the new features:
1. Login or create an account
2. Create your first memo with a category
3. Try editing and deleting
4. Pin important memos
5. Toggle dark mode
6. Filter by category
7. Search for memos

---

**Version**: 2.0 - Modernized  
**Last Updated**: December 2024  
**Status**: Production Ready ✅
