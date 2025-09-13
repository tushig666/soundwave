# SoundWave 🎵

## Project Overview
SoundWave is a music streaming platform built with modern web technologies. Users can upload, share, and play music, as well as create playlists and share their favorite tracks.

## Key Features
- 🎵 Music upload and playback
- 👤 User authentication (Login/Signup)
- ❤️ Save favorite songs
- 📝 Create and manage playlists
- 🔍 Music search
- 🔥 Trending songs display
- 📱 Responsive design

## Tech Stack
- **Frontend**: Next.js 13, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **UI Libraries**: Radix UI, Lucide Icons
- **State Management**: Zustand
- **Styling**: Tailwind CSS, shadcn/ui

## Development Setup

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- Firebase project

### Installation Steps
1. Clone the repository:
```bash
git clone https://github.com/tushig666/soundwave.git
cd soundwave
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file and set the following variables:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
```

Access the application at `http://localhost:9002` once the server is running.

## Feature Details

### Authentication
- User authentication using Firebase
- Login/Signup/Logout functionality
- Profile management

### Music Management
- Music file upload (MP3 format)
- Music playback, pause, and skip
- Playlist creation and editing
- Favorite songs management

### Search & Discovery
- Song search by title
- Trending songs display
- Browse by genre

### UI/UX
- Modern and intuitive interface
- Responsive design
- Dark mode support

## Deployment

### Netlify Deployment Steps
1. Create a Netlify account
2. Connect with GitHub repository
3. Set up environment variables
4. Configure deployment settings
5. Execute build and deploy

## Contributing
1. Fork this repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## License
MIT License
