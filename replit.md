# HydroTrack - Water Tracking Mobile Application

## Overview

HydroTrack is a React Native mobile application built with Expo that helps users track their daily water intake. The app features a clean, modern UI with water-themed design elements, daily goal management, historical analytics, and achievement tracking. All data is persisted locally using AsyncStorage, eliminating the need for backend infrastructure.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Runtime**
- Built with React Native 0.81.5 and Expo SDK 54
- TypeScript for type safety throughout the application
- React 19.1.0 with React Compiler enabled for performance optimization
- New React Native Architecture enabled for better performance

**Navigation Structure**
The app uses a hierarchical navigation pattern with React Navigation 7:
- **Root Stack Navigator**: Manages authentication flow (Splash → Login/Register → Main Tabs)
- **Bottom Tab Navigator**: Three main sections accessible via tabs
  - Home Tab (center): Daily water tracking dashboard
  - History Tab: Consumption analytics and historical data
  - Profile Tab: User settings, achievements, and preferences
- **Nested Stack Navigators**: Each tab has its own stack for sub-screens (e.g., Profile → Achievements)

**State Management**
Uses React Context API for global state with three primary contexts:
- **AuthContext**: User authentication and profile management
- **WaterTrackingContext**: Water logs, daily goals, and statistics
- **Theme Context**: Dark/light mode preferences

**UI/UX Design**
- Water-themed color palette (blues and aquas)
- iOS-style liquid glass design with blur effects
- Platform-specific adaptations (iOS blur effects, Android solid backgrounds)
- Circular progress indicators for visual goal tracking
- Smooth animations using React Native Reanimated 4
- Haptic feedback for user interactions
- Safe area handling for notched devices

### Data Persistence Layer

**Local Storage Implementation**
All data is stored locally using AsyncStorage:
- **User Data**: Profile information, preferences, avatar selection
- **Water Logs**: Individual water intake entries with timestamps
- **Statistics**: Calculated metrics (streaks, totals, averages)
- **Achievements**: Unlocked achievements and progress tracking
- **Settings**: Theme preferences and notification configurations

**Data Models**
- `User`: Profile with email, name, avatar, daily goal, weight, activity level
- `WaterLog`: Amount, timestamp, date for each water intake entry
- `UserStats`: Current/best streak, total consumption, days met goal
- `NotificationSettings`: Reminder preferences and schedules
- `UnlockedAchievement`: Achievement ID and unlock timestamp

### Feature Modules

**Authentication System**
- Mock authentication flow using local storage
- Login/Register screens with validation
- Password visibility toggles
- Session persistence across app launches
- Logout and account deletion with confirmations

**Water Tracking**
- Quick-add buttons for common amounts (250ml, 500ml, 750ml, 1000ml)
- Custom amount entry via modal
- Real-time progress visualization with circular progress bar
- Today's log history with delete functionality
- Automatic daily reset at midnight

**Analytics & History**
- Historical data visualization with bar charts (SVG-based)
- Multiple view modes: daily, weekly, monthly
- Statistics calculation: average intake, best day, current streak
- Goal achievement percentage tracking
- Date-based filtering and aggregation

**Achievements System**
- Three categories: streak, consumption, consistency
- Progressive unlocking based on user behavior
- Visual progress indicators for locked achievements
- Achievement notifications when unlocked
- Persistence of unlocked achievements

**Profile & Settings**
- Avatar selection from preset water-themed options
- Daily goal customization (manual or calculated from weight/activity)
- Theme toggle (dark/light mode with system preference option)
- Notification settings with time-based scheduling
- Data export to CSV for backup
- Account management (logout, delete account)

### Component Architecture

**Reusable Components**
- `ThemedText/ThemedView`: Theme-aware base components
- `Button/Card`: Interactive elements with press animations
- `CircularProgress`: Animated progress indicator with SVG
- `ScreenScrollView/ScreenKeyboardAwareScrollView`: Layout wrappers with proper insets
- `ErrorBoundary/ErrorFallback`: Error handling with recovery options
- `HeaderTitle`: Branded navigation header with app icon

**Screen Components**
Each screen follows consistent patterns:
- Proper safe area handling
- Keyboard avoidance for input screens
- Loading states and error handling
- Theme-aware styling
- Optimized scroll performance

### Cross-Platform Considerations

**Platform-Specific Adaptations**
- iOS: Blur effects for tab bar and navigation headers
- Android: Solid backgrounds with edge-to-edge support
- Web: Fallback for native-only features (keyboard aware scrolling)
- Conditional rendering based on platform capabilities

**Gesture Handling**
- React Native Gesture Handler for smooth interactions
- Platform-specific navigation gestures
- Swipe-to-delete on water log entries
- Pull-to-refresh patterns where applicable

## External Dependencies

### Core Framework Dependencies
- **Expo SDK 54**: Core platform and build system
- **React Navigation 7**: Navigation infrastructure (native stack, bottom tabs)
- **React Native Gesture Handler**: Touch gesture system
- **React Native Reanimated 4**: Performance-optimized animations
- **React Native Safe Area Context**: Safe area insets for notched devices

### UI & Styling
- **Expo Vector Icons**: Icon library (Material Community Icons, Feather)
- **Expo Blur**: iOS blur effects for glass morphism design
- **Expo Glass Effect**: Liquid glass UI effects
- **React Native SVG**: Custom graphics and charts

### Storage & Data
- **AsyncStorage**: Local data persistence (key-value store)
- No external database required - all data stored locally
- No backend API - fully offline-capable application

### Device Features
- **Expo Haptics**: Tactile feedback for user interactions
- **Expo Notifications**: Local notification scheduling for water reminders
- **Expo Sharing**: Export functionality for data sharing
- **Expo System UI**: System UI styling control

### Development Tools
- **TypeScript**: Static type checking
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Babel Module Resolver**: Path aliasing (`@/` imports)

### Notable Architectural Decisions

**Why Local Storage Only**: The app is designed as a personal tracking tool without social features or cloud sync, making local storage sufficient. This eliminates backend complexity, reduces latency, and ensures complete user privacy.

**Context API over Redux**: Given the relatively simple state management needs and React 19's performance improvements, Context API provides sufficient functionality without additional bundle size.

**SVG for Charts**: Using React Native SVG for charts instead of third-party charting libraries provides full customization control and reduces dependencies.

**Expo over Pure React Native**: Expo simplifies native module integration, provides consistent cross-platform APIs, and enables easier deployment without ejecting.