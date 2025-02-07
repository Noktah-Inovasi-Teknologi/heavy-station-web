import { sendRedirect } from 'h3';

// Initialize OAuth2 client
const { google } = require('googleapis');
// export default defineEventHandler(async (event) => {
//   // Generate the authorization URL
//   const authorizationUrl = oauth2Client.generateAuthUrl({
//     access_type: 'offline', // Request a refresh token
//     scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
//     prompt: 'consent', // Ensure the user is prompted to consent
//   });

//   console.log("Redirecting to Google Auth URL:", authorizationUrl);

//   // Redirect the user to Google's authorization page
//   return sendRedirect(event, authorizationUrl);
// });

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

export default defineEventHandler(async (event) => {
  const { code, error } = getQuery(event);

  // If there's no `code`, this is the initial redirect to Google Auth
  if (!code) {
    // Generate the Google OAuth authorization URL
    const authorizationUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline', // Request a refresh token
      scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
      prompt: 'consent', // Ensure the user is prompted to consent
    });

    console.log("Generated Google OAuth URL:", authorizationUrl);

    // Redirect the user to Google's authorization page
    return sendRedirect(event, authorizationUrl);
  }

  // If there's a `code`, this is the callback from Google
  console.log("OAuth callback received. Code:", code, "Error:", error);

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error);
    return sendError(event, createError({ statusCode: 400, statusMessage: error }));
  }

  try {
    // Exchange the authorization code for tokens
    console.log("Exchanging code for tokens...");
    const { tokens } = await oauth2Client.getToken(code as string);
    console.log("Tokens received:", tokens);

    // Set the credentials for the OAuth2 client
    oauth2Client.setCredentials(tokens);

    // Fetch user info from Google
    console.log("Fetching user info...");
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: user } = await oauth2.userinfo.get();
    console.log("User info received:", user);

    // Check if required fields are present
    if (!user.email || !user.id) {
      console.error("Missing required fields in user object:", user);
      return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid user data' }));
    }

    // Set admin flag based on environment variables
    user.admin = user.email === process.env.ADMIN_EMAIL && user.id === process.env.ADMIN_SUB;
    console.log("User admin status:", user.admin);

    // Set user session
    console.log("Setting user session...");
    await setUserSession(event, { user });

    // Redirect to home page
    console.log("Redirecting to home page...");
    return sendRedirect(event, "/");
  } catch (err) {
    console.error("OAuth callback error:", err);
    return sendError(event, createError({ statusCode: 500, statusMessage: 'OAuth Error' }));
  }
});


// import { useState } from "nuxt/app";

// export default defineOAuthGoogleEventHandler({
//   // async config(event) {
    
//   // },
//   async onError(event, error) {
//     return console.log("error happened", error, event);
//   },
//   async onSuccess(event, { user }) {
//     console.log("This actually succeed", event, user)
//     user.admin = user.email === process.env.ADMIN_EMAIL && user.sub === process.env.ADMIN_SUB;
//     await setUserSession(event, { user });
//     return sendRedirect(event, "/");
//   },
// })
// // export default defineEventHandler((event) => {
// //   console.log(event)
// //   return "Auth can be accessed";
// // })
