# 🚀 How to make your Netlify App "Fully Functional"

Since we are using real-time Firebase services, you need to tell Netlify your API keys. I have configured the code to read these from your Netlify dashboard for security.

### 1. Go to Netlify
Log in to your [Netlify Dashboard](https://app.netlify.com/).

### 2. Add Environment Variables
Go to **Site configuration** > **Environment variables** > **Add a variable**. Add these exact keys:

| Key | Value (Find in your Firebase Console) |
| :--- | :--- |
| `VITE_FIREBASE_API_KEY` | Your API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | your-project.firebaseapp.com |
| `VITE_FIREBASE_PROJECT_ID` | your-project-id |
| `VITE_FIREBASE_STORAGE_BUCKET` | your-project.appspot.com |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your Sender ID |
| `VITE_FIREBASE_APP_ID` | Your App ID |

### 3. Deploy
- If you are using **Manual Deploy** (Drag and Drop): Simply drop the `build` folder onto Netlify.
- If you are linked to **GitHub**: Netlify will automatically detect the `netlify.toml` file I created and build it for you.

---

### Why did I do this?
- **Security**: This keeps your secret keys out of the public source code.
- **Flexibility**: You can change your Firebase project without ever touching the code again.
- **SPA Routing**: The `_redirects` file is already in the `build` folder, ensuring your links never break.
