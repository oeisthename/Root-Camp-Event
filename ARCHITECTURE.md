# Application Architecture

## Overview

The application has been refactored into a modular, maintainable architecture using ES6 modules and separation of concerns.

## Directory Structure

```
/
├── index.html              # Main HTML file
├── styles.css              # Global styles
├── js/
│   ├── app.js             # Main application entry point
│   ├── config.js          # Configuration constants
│   ├── controllers/       # UI controllers
│   │   ├── form.controller.js
│   │   ├── modal.controller.js
│   │   └── nav.controller.js
│   ├── services/          # Business logic services
│   │   ├── storage.service.js
│   │   ├── validation.service.js
│   │   ├── csv.service.js
│   │   └── drive.service.js
│   └── utils/             # Utility functions
│       ├── phone.formatter.js
│       └── error.handler.js
└── GOOGLE_DRIVE_SETUP.md  # Google Drive setup guide
```

## Module Descriptions

### Configuration (`js/config.js`)
- Centralized configuration for the entire application
- Google Drive settings
- API endpoints
- Storage keys
- Major/Year mappings
- CSV configuration

### Services

#### Storage Service (`js/services/storage.service.js`)
- Handles all LocalStorage operations
- Methods: `getRegistrations()`, `saveRegistration()`, `clearAll()`, `getCount()`

#### Validation Service (`js/services/validation.service.js`)
- Form validation logic
- Field-specific validators
- Complete form validation

#### CSV Service (`js/services/csv.service.js`)
- CSV generation from data
- CSV formatting and escaping
- BOM addition for Excel compatibility
- CSV download functionality

#### Drive Service (`js/services/drive.service.js`)
- Google Drive upload operations
- Apps Script integration
- Upload error handling

### Controllers

#### Form Controller (`js/controllers/form.controller.js`)
- Form submission handling
- Major/Year field dependency
- Real-time error clearing
- Loading states

#### Modal Controller (`js/controllers/modal.controller.js`)
- Modal open/close management
- Keyboard shortcuts (Escape)
- Outside click handling

#### Nav Controller (`js/controllers/nav.controller.js`)
- Mobile menu toggle
- Smooth scrolling
- Navbar scroll effects
- Active navigation highlighting

### Utils

#### Phone Formatter (`js/utils/phone.formatter.js`)
- Phone number formatting to +212 xxx xxx xxx
- Input event handling
- Paste handling
- Focus/blur handling

#### Error Handler (`js/utils/error.handler.js`)
- Error display management
- Error clearing
- Field error state management

### Main App (`js/app.js`)
- Application initialization
- Controller coordination
- Global setup
- Debug logging

## Data Flow

### Registration Submission Flow

1. **User fills form** → Form Controller monitors input
2. **User clicks submit** → Form Controller intercepts
3. **Validation** → Validation Service validates all fields
4. **If valid:**
   - Save to Storage → Storage Service saves to LocalStorage
   - Generate CSV → CSV Service generates CSV from all registrations
   - Upload to Drive → Drive Service uploads CSV to Google Drive
   - Show success → User sees success message
   - Close modal → Modal Controller closes modal
5. **If invalid:**
   - Show errors → Error Handler displays field errors
   - Scroll to first error → User sees what needs fixing

## Key Features

- **Modular**: Each concern is separated into its own module
- **Maintainable**: Easy to find and update code
- **Testable**: Services can be tested independently
- **Scalable**: Easy to add new features
- **Type-safe**: Clear function signatures and documentation

## Configuration

All configuration is centralized in `js/config.js`. Update the following:

- `CONFIG.GOOGLE_DRIVE.appsScriptUrl` - Your Google Apps Script URL
- `CONFIG.API.endpoint` - Your backend API endpoint (if using)
- Other settings as needed

## Adding New Features

1. **New Service**: Add to `js/services/`
2. **New Controller**: Add to `js/controllers/`
3. **New Utility**: Add to `js/utils/`
4. **Update Config**: Add to `js/config.js` if needed
5. **Wire Up**: Import and use in `js/app.js`

