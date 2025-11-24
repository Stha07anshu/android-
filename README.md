# HydroTrack - Water Drinking Tracking App

A beautiful, user-friendly mobile app built with React Native and Expo for tracking daily water intake with local storage persistence.

## Features

### Core Functionality
- **Water Intake Tracking**: Log water consumption with quick-add buttons (250ml, 500ml, 750ml, 1000ml) or custom amounts
- **Circular Progress Indicator**: Visual representation of daily water intake progress
- **Daily Goal Management**: Set and adjust personalized daily water intake goals
- **History & Analytics**: View historical water consumption data with statistics
- **Local Storage**: All data persists locally using AsyncStorage

### User Experience
- **Authentication**: Secure login and registration system with local storage
- **Splash Screen**: Branded splash screen with smooth animations
- **Dark & Light Mode**: Full theme support with persistent user preference
- **Avatar Selection**: Choose from water-themed avatar presets
- **Profile Management**: Manage account settings, daily goals, and preferences

### Design
- **Modern UI**: Clean, water-themed interface following iOS liquid glass design principles
- **Responsive Layout**: Optimized for mobile devices with proper safe area handling
- **Interactive Elements**: All buttons and controls have proper press states and visual feedback
- **Progress Tracking**: See daily streak, best day, and average intake statistics

## Technology Stack

- **Framework**: React Native with Expo SDK 54
- **Navigation**: React Navigation 7
- **State Management**: React Context API
- **Storage**: AsyncStorage for local data persistence
- **UI Components**: Custom components with Material Community Icons
- **Animations**: React Native Reanimated for smooth transitions
- **TypeScript**: Full type safety throughout the application

## File Structure

```
HydroTrack/
├── assets/
│   └── images/
│       ├── icon.png                    # App icon
│       ├── splash-icon.png             # Splash screen icon
│       ├── favicon.png                 # Web favicon
│       └── avatars/                    # User avatar presets
│           ├── avatar-waves.png
│           ├── avatar-ripples.png
│           └── avatar-droplets.png
├── components/
│   ├── Button.tsx                      # Reusable button component
│   ├── Card.tsx                        # Card component with elevation
│   ├── CircularProgress.tsx            # Circular progress indicator
│   ├── ErrorBoundary.tsx               # Error boundary wrapper
│   ├── ErrorFallback.tsx               # Error fallback UI
│   ├── HeaderTitle.tsx                 # Custom header title component
│   ├── ScreenFlatList.tsx              # Screen-level FlatList with safe areas
│   ├── ScreenKeyboardAwareScrollView.tsx # Keyboard-aware scroll view
│   ├── ScreenScrollView.tsx            # Screen-level ScrollView with safe areas
│   ├── Spacer.tsx                      # Spacing component
│   ├── ThemedText.tsx                  # Themed text component
│   ├── ThemedView.tsx                  # Themed view component
│   └── WaterLogCard.tsx                # Water log entry card
├── constants/
│   └── theme.ts                        # Theme constants (colors, spacing, typography)
├── hooks/
│   ├── useAuth.tsx                     # Authentication context and hook
│   ├── useColorScheme.ts               # Color scheme management
│   ├── useScreenInsets.ts              # Safe area insets helper
│   ├── useTheme.ts                     # Theme hook
│   └── useWaterTracking.tsx            # Water tracking context and hook
├── navigation/
│   ├── HistoryStackNavigator.tsx       # History tab stack
│   ├── HomeStackNavigator.tsx          # Home tab stack
│   ├── MainTabNavigator.tsx            # Bottom tab navigator
│   ├── ProfileStackNavigator.tsx       # Profile tab stack
│   ├── RootNavigator.tsx               # Root navigation with auth flow
│   └── screenOptions.ts                # Shared screen options
├── screens/
│   ├── HistoryScreen.tsx               # Water consumption history
│   ├── HomeScreen.tsx                  # Main dashboard
│   ├── LoginScreen.tsx                 # Login screen
│   ├── ProfileScreen.tsx               # User profile and settings
│   ├── RegisterScreen.tsx              # Registration screen
│   └── SplashScreen.tsx                # Initial splash screen
├── utils/
│   └── storage.ts                      # AsyncStorage helper functions
├── App.tsx                             # App entry point
├── app.json                            # Expo configuration
├── package.json                        # Dependencies
└── tsconfig.json                       # TypeScript configuration
```

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- Expo CLI
- Expo Go app on your mobile device (for testing)

### Steps to Run

1. **Clone or download the project**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Test on your device:**
   - Scan the QR code with Expo Go app (Android)
   - Scan the QR code with Camera app (iOS)

## How to Use

### First Time Setup
1. Launch the app - you'll see the splash screen
2. Register a new account with your name, email, and password
3. Set your daily water intake goal (default: 2000ml)
4. Choose your avatar from the profile page

### Daily Usage
1. **Log Water Intake:**
   - Use quick-add buttons for common amounts (250ml, 500ml, 750ml, 1000ml)
   - Tap the floating + button for custom amounts
   - View your progress on the circular indicator

2. **Track Progress:**
   - Home tab shows today's intake and logs
   - History tab displays past consumption with statistics
   - See your streak, best day, and average intake

3. **Manage Settings:**
   - Profile tab for account settings
   - Switch between dark/light mode
   - Adjust daily water goal
   - Change avatar
   - Logout or delete account

## Data Storage

All data is stored locally on your device using AsyncStorage:
- **User Account**: Name, email, avatar preference, daily goal
- **Water Logs**: All water intake entries with timestamps
- **Theme Preference**: Dark/light mode selection

**Note:** Data is tied to your device. Logging out or deleting your account will clear all data.

## Android Studio Compatibility

This is an Expo project that can be tested in Android Studio emulator or physical devices:

1. **For Android Studio Emulator:**
   - Open Android Studio
   - Start an Android Virtual Device (AVD)
   - Run `npm run dev`
   - Press 'a' in the terminal to open in Android emulator

2. **For Physical Android Device:**
   - Install Expo Go from Google Play Store
   - Ensure device and computer are on same network
   - Scan QR code from terminal

## Customization

### Changing Colors
Edit `constants/theme.ts` to customize the color scheme:
- Primary colors
- Background colors
- Text colors
- Success/error colors

### Modifying Daily Goal Default
Update the default value in `hooks/useWaterTracking.tsx` and `hooks/useAuth.tsx`

### Adding More Avatar Options
1. Add new avatar images to `assets/images/avatars/`
2. Update the AVATARS array in `screens/ProfileScreen.tsx`

## Known Limitations

- Data is stored locally only (no cloud sync)
- No notification reminders (can be added with expo-notifications)
- Single user per device (no multi-user support)
- No export/import functionality (can be added)

## Future Enhancements

- Push notification reminders at scheduled intervals
- Weekly and monthly analytics charts
- Export data to CSV or PDF
- Achievement badges and milestones
- Customizable cup sizes
- Integration with health apps
- Cloud backup and sync

## Support

For issues or questions, please ensure you have:
- Latest version of Node.js and Expo CLI
- All dependencies properly installed
- Expo Go app updated to the latest version

## License

This project is created as a demonstration app for water intake tracking.

---

**Happy Hydrating! 💧**
