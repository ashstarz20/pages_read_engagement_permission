# Facebook Pages Analytics Pro - Advanced Access Demo

A comprehensive React application demonstrating real Facebook SDK integration for `pages_read_engagement` Advanced Access permissions.

## Features

- **Real Facebook SDK Integration**: Authentic Facebook Login with live API calls
- **Advanced Permissions**: Demonstrates `pages_read_engagement`, `pages_show_list`, and `read_insights`
- **Live Data Fetching**: Real-time page posts, insights, and engagement metrics
- **Professional UI**: Production-ready interface perfect for screencast demos
- **Privacy Focused**: Clear indicators of data handling and privacy protection

## Setup Instructions

### 1. Facebook App Configuration

1. Go to [Facebook Developers](https://developers.facebook.com/apps/)
2. Create a new app or use an existing one
3. Add **Facebook Login** product to your app
4. Configure the following settings:

#### Valid OAuth Redirect URIs
```
http://localhost:5173/
https://yourdomain.com/
```

#### App Domains
```
localhost
yourdomain.com
```

### 2. Environment Configuration

1. Copy `.env.example` to `.env`
2. Add your Facebook App ID:
```env
VITE_FACEBOOK_APP_ID=your_facebook_app_id_here
```

### 3. Required Permissions

The app requests these permissions:
- `pages_show_list` - List user's Facebook Pages
- `pages_read_engagement` - Read page engagement data (Advanced Access required)
- `pages_read_user_content` - Read user-generated content on pages
- `read_insights` - Access page insights and analytics

### 4. Installation & Running

```bash
npm install
npm run dev
```

## Advanced Access Requirements

To fully demonstrate `pages_read_engagement` capabilities, your Facebook App needs:

1. **Business Verification**: Link your app to a verified Business Manager
2. **Advanced Access**: Submit for `pages_read_engagement` Advanced Access
3. **App Review**: Complete Facebook's app review process

## Demo Flow

Perfect for screencast recording:

1. **Login Screen**: Shows required permissions and privacy information
2. **Page Selection**: Displays user's Facebook Pages with live data
3. **Analytics Dashboard**: Real-time posts, insights, and engagement metrics
4. **Privacy Indicators**: Clear data handling and security messaging

## API Integration Details

### Facebook SDK Methods Used

- `FB.login()` - Authenticate with required scopes
- `FB.api('/me/accounts')` - Fetch user's pages
- `FB.api('/{page-id}/posts')` - Get page posts with engagement data
- `FB.api('/{page-id}/insights')` - Fetch page analytics and insights

### Error Handling

- Graceful fallbacks for missing permissions
- Clear error messages for API failures
- Loading states for all async operations

## Privacy & Compliance

- Only aggregated, anonymized data is processed
- No personal user information stored
- GDPR-compliant data handling
- Clear privacy indicators throughout the app

## Production Deployment

1. Update Facebook App settings with production domain
2. Configure environment variables for production
3. Ensure HTTPS for OAuth redirects
4. Test all permissions in production environment

## Troubleshooting

### Common Issues

1. **"App Not Setup" Error**: Check Facebook App ID in `.env`
2. **Permission Denied**: Ensure user is admin of Facebook Pages
3. **CORS Errors**: Verify domain configuration in Facebook App settings
4. **No Pages Found**: User must be admin of at least one Facebook Page

### Debug Mode

Enable Facebook SDK debug mode by adding to the URL:
```
?debug=1
```

## Support

For Facebook API issues, refer to:
- [Facebook Developers Documentation](https://developers.facebook.com/docs/)
- [Facebook Login for Web](https://developers.facebook.com/docs/facebook-login/web/)
- [Pages API Documentation](https://developers.facebook.com/docs/pages-api/)