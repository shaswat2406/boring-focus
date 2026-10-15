# Boring Focus v6.0 (Android APK & Fullscreen Portrait Reels Edition) 📱🧘‍♂️
### Full-Screen Portrait Void Reels, Interactive Action Rail (Like, Comment, Share), Fluid Canvas Video Splash Screen, and Local Resource Hub

**Boring Focus** is a privacy-first, 100% offline focus workspace and installable Android app engineered to extinguish doom-scrolling habits through behavioral friction and tactile substitution.

---

## 🌟 What's New in v6.0

### 1. 📱 Full-Screen Portrait Reels with Interactive Action Rail
- **True Mobile Portrait Layout**: Occupies `100dvh` full-bleed portrait viewport with vertical snap friction.
- **❤️ Double-Tap to Like**: Double-tapping anywhere on a reel triggers a floating pop-up heart animation and increments the like counter.
- **💬 Mindful Reflections Drawer**: Tapping the comment icon opens an Instagram-style glassmorphism bottom drawer where you can read mindful notes and log thoughts/urges.
- **↗️ Share Option**: Integrates with Android's native Web Share API (`navigator.share`) with fallback clipboard copy.
- **🎵 Spinning Audio Disc**: Displays rotating album disc for "Pure Void / Silence Detox Audio".
- **Tactile Fidget Void**: Black cards with reel number and elapsed time. Zero guilt lectures or preachy countdowns.

### 2. 🌈 Vibrant Fluid Canvas "Video" Splash Screen
- **Organic Chromatic Fluid Simulation**: Canvas-based 60 FPS metaball fluid blending neon pink, electric cyan, violet, amber, and emerald like a liquid color-merging video.
- **Zero Heavy Video Downloads**: 100% offline, lightweight, and responsive across all screen aspect ratios.
- **Branding**: Glassmorphism badge with animated progress bar and tap-to-skip. Replay anytime with the `✨` button in the header.

### 3. 🤖 Android APK Conversion & Project Files
- **Pre-Configured Android Studio Project**: Full native source code in [`android/`](file:///C:/Users/asus/.gemini/antigravity/scratch/boring-focus/android):
  - `AndroidManifest.xml`: Configured for portrait orientation, immersive fullscreen, and hardware acceleration.
  - `MainActivity.java`: Custom Android WebView with HTML5 file upload support, dark status bars, and offline caching.
  - Bundled assets: `android/app/src/main/assets/www/` with self-contained `index.html`.
- **Instant Phone Installation (WebAPK)**: Open `http://localhost:5173` on Android Chrome/Edge -> Tap `⋮` -> "Install app" to generate a native WebAPK with home screen icon.
- **Build Script**: Run [`build-apk.ps1`](file:///C:/Users/asus/.gemini/antigravity/scratch/boring-focus/build-apk.ps1) to sync assets and trigger Gradle compilation.
- **GitHub Actions Cloud Build**: [`.github/workflows/build-apk.yml`](file:///C:/Users/asus/.gemini/antigravity/scratch/boring-focus/.github/workflows/build-apk.yml) compiles APKs automatically in under 2 minutes on GitHub without needing local SDKs.
- **Packaged Project Archive**: [`release/BoringFocus-Android-Project.zip`](file:///C:/Users/asus/.gemini/antigravity/scratch/boring-focus/release/BoringFocus-Android-Project.zip) ready for Android Studio.

### 4. 📁 Local File Hub (PDF & PPT In-App & Device Viewer)
- Organize scattered local files (Python scripts, PDFs, PowerPoint slides) across different folders into virtual topic sections without copying or moving files.
- In-app interactive PDF embed viewer.
- PowerPoint presentation cards.
- **"Open in Device App"** button: Launches files directly into native Android / Windows default apps.

### 5. 🎨 5 Customizable Dark Background Themes & Custom Pomodoro
- Themes: Midnight Navy, Deep Obsidian, Cyber Charcoal, Emerald Nocturne, Cosmic Indigo.
- Pomodoro: Preset durations (15m to 90m) + tactile sound chimes.

---

## 🚀 Live Access & Running App

- **Live Local Server**: [http://localhost:5173](http://localhost:5173)
- **Standalone Distribution**: Double-click [index.html](file:///C:/Users/asus/.gemini/antigravity/scratch/boring-focus/index.html) in any browser.
