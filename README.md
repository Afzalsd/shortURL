# URL Shortener Microservice

A simple and fast URL shortening service built with Node.js. Convert long URLs into short, shareable links with analytics tracking.

## Features

- 🔗 Shorten any URL instantly
- 📊 Track clicks and visitor analytics
- ⏰ Set custom expiry times (1 min to 1 year)
- 🎯 Create custom shortcodes or auto-generate them
- 🌍 Geolocation tracking for visitors
- 🔒 Input validation and security

## Quick Start

1. **Install dependencies:**
   ```bash
   cd Backend_Test_Submission
   npm install
   ```

2. **Start the server:**
   ```bash
   node server.js
   ```

3. **Server runs on:** `http://localhost:3000`

## API Usage

### Create Short URL
```bash
POST /shorturls
{
  "url": "https://www.google.com",
  "validity": 60,              # minutes (optional, default: 30)
  "shortcode": "google123"     # optional custom code
}
```

Response:
```json
{
  "shortLink": "http://localhost:3000/google123",
  "expiry": "2025-08-23T12:30:00.000Z"
}
```

### Get Statistics
```bash
GET /shorturls/google123
```

### Use Short URL
```bash
GET /google123    # Redirects to original URL
```

## Testing

Run the included test suite:
```bash
node testapi.js
```

## Key Files

- `server.js` - Main server
- `src/app.js` - Express setup
- `src/routes/urlRoutes.js` - Create URLs & stats
- `src/routes/redirectRoutes.js` - Handle redirects
- `src/models/UrlModel.js` - Data storage
- `testapi.js` - Test all endpoints

## Rules

- **Shortcodes**: 3-20 alphanumeric characters
- **URL Validity**: 1 minute to 1 year
- **Storage**: In-memory (resets on restart)
- **Auto-cleanup**: Expired URLs removed hourly


