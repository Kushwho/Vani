# Google OAuth Integration

This directory contains components for implementing Google OAuth authentication in the application.

## Components

### GoogleWrapper.tsx

The main wrapper component that provides the Google OAuth context. It accepts children components to wrap with the OAuth provider.

```tsx
<GoogleWrapper>
  <YourComponent />
</GoogleWrapper>
```

### GoogleLogin.tsx

A button component that triggers the Google OAuth flow. When clicked, it:

1. Opens the Google login popup
2. Makes an API call to the backend with the access token
3. Handles the response and redirects to the dashboard

```tsx
<GoogleLogin
  onSuccess={(userData) => {
    // Optional callback when login is successful
    console.log(userData);
  }}
/>
```

### GoogleCallback.tsx

Handles the OAuth callback after successful authentication. It:

1. Extracts the authorization code from the URL
2. Makes an API call to the backend with the code
3. Stores the user data in localStorage
4. Redirects to the dashboard

```tsx
<GoogleCallback />
```

## API Endpoints

The components use the following API endpoints:

- Google Authentication: `POST /api/auth/google`

  - Request body: `{ token: string }`
  - Response: `{ user: object }`

- OAuth Callback: `POST /api/auth/google/callback`
  - Request body: `{ code: string }`
  - Response: `{ user: object }`

## Setup Instructions

1. Make sure you have the required dependencies installed:

   ```
   npm install @react-oauth/google react-icons
   ```

2. Configure your Google OAuth credentials in the Google Cloud Console:

   - Create a project
   - Enable the Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs (e.g., `http://localhost:3000/auth/google/callback`)

3. Update the `clientId` in `GoogleWrapper.tsx` with your Google OAuth client ID.

4. Set up API routes in your Next.js application to handle the authentication requests:

   - Create API routes at `app/api/auth/google/route.ts`
   - These routes should communicate with your backend server

5. Ensure your backend is properly configured to handle the OAuth flow with Passport.js.

## Usage

### In Login Page

```tsx
import GoogleWrapper from "../components/Google/GoogleWrapper";
import GoogleLogin from "../components/Google/GoogleLogin";

// In your component
<GoogleWrapper>
  <GoogleLogin />
</GoogleWrapper>;
```

### In Signup Page

```tsx
import GoogleWrapper from "../components/Google/GoogleWrapper";
import GoogleLogin from "../components/Google/GoogleLogin";

// In your component
<GoogleWrapper>
  <GoogleLogin />
</GoogleWrapper>;
```

## Security Considerations

- The implementation uses API calls instead of direct URL redirection to avoid exposing backend URLs
- All API calls include `credentials: "include"` to ensure cookies are sent with the requests
- User data is stored in localStorage for persistence
- Error handling is implemented throughout the flow
