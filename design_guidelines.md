# HydroTrack Design Guidelines

## Architecture Decisions

### Authentication
**Auth Required** - The app includes explicit user accounts with login and registration functionality.

**Implementation:**
- Use local storage-based authentication (email/password)
- Include both login and registration screens
- Store user credentials and session state in AsyncStorage
- Mock authentication flow with local state management
- Registration should collect: name, email, password
- Login/signup screens should include:
  - Privacy policy & terms of service links (placeholder)
- Profile screen must have:
  - Log out button with confirmation alert
  - Delete account option (nested under Settings > Account > Delete with double confirmation)

### Navigation
**Tab Navigation** - The app has 3 distinct feature areas:

1. **Home Tab** (Center) - Daily water tracking dashboard
2. **History Tab** - Water consumption history and analytics
3. **Profile Tab** - User profile, settings, and theme toggle

**Navigation Structure:**
- Bottom tab bar with 3 tabs
- Each tab has its own stack navigator for nested screens
- No drawer navigation needed for this simple app

### Screen Specifications

#### 1. Splash Screen
- **Purpose:** App branding and initial loading
- **Layout:**
  - Full-screen centered content
  - HydroTrack logo/branding
  - Water-themed gradient background (light blue to deeper blue)
  - Animated water droplet or wave effect
- **Duration:** 2-3 seconds before transitioning to auth or home
- **No header or tab bar**

#### 2. Login Screen
- **Purpose:** User authentication
- **Layout:**
  - Transparent header (back button if accessed from register)
  - Scrollable form centered on screen
  - Submit button below form
- **Components:**
  - Email input field
  - Password input field (with show/hide toggle)
  - "Login" primary button
  - "Don't have an account? Register" link
  - Privacy policy and terms of service links at bottom
- **Safe Area:** Top: insets.top + Spacing.xl, Bottom: insets.bottom + Spacing.xl

#### 3. Registration Screen
- **Purpose:** Create new user account
- **Layout:**
  - Transparent header with back button
  - Scrollable form
  - Submit button below form
- **Components:**
  - Name input field
  - Email input field
  - Password input field (with show/hide toggle)
  - Confirm password field
  - "Register" primary button
  - "Already have an account? Login" link
- **Safe Area:** Top: insets.top + Spacing.xl, Bottom: insets.bottom + Spacing.xl

#### 4. Home Screen (Main Dashboard)
- **Purpose:** Track daily water intake and view progress
- **Layout:**
  - Transparent header (right button: settings icon for theme toggle)
  - Scrollable content
  - Floating action button for quick water logging
- **Components:**
  - Large circular progress indicator (fills as user drinks water)
  - Current intake display (ml/L consumed vs. daily goal)
  - Quick-add buttons (250ml, 500ml, 750ml, custom amount)
  - Today's log entries list (time-stamped water entries)
  - Floating "+" button for adding custom water intake
- **Safe Area:** Top: headerHeight + Spacing.xl, Bottom: tabBarHeight + Spacing.xl
- **Floating Button Shadow:** shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2

#### 5. History Screen
- **Purpose:** View past water consumption data
- **Layout:**
  - Default header with title "History"
  - Scrollable list
- **Components:**
  - Calendar week view showing daily completion status
  - List of historical entries grouped by date
  - Simple statistics (weekly average, best day, streak)
- **Safe Area:** Top: Spacing.xl, Bottom: tabBarHeight + Spacing.xl

#### 6. Profile Screen
- **Purpose:** User settings, theme toggle, account management
- **Layout:**
  - Default header with title "Profile"
  - Scrollable content
- **Components:**
  - User avatar (preset water-themed avatar selection)
  - Display name field
  - Daily water goal setter (slider or input)
  - Theme toggle (Dark/Light mode switch with icon)
  - Settings section: Notifications, Units (ml/oz), Reminders
  - Account section: Log out button, Delete account (nested)
- **Safe Area:** Top: Spacing.xl, Bottom: tabBarHeight + Spacing.xl

## Design System

### Color Palette
**Light Mode:**
- Primary: #4A90E2 (water blue)
- Secondary: #5FC9E8 (light cyan)
- Background: #F5F9FC (very light blue-gray)
- Surface: #FFFFFF
- Text Primary: #1A2B3C (dark blue-gray)
- Text Secondary: #6B7C8C
- Success: #4CAF50 (for goal completion)
- Border: #E0E8F0

**Dark Mode:**
- Primary: #5AA3F0
- Secondary: #6ED4EC
- Background: #0F1419 (very dark blue-black)
- Surface: #1A2530
- Text Primary: #E8F1F8
- Text Secondary: #9BADB8
- Success: #66BB6A
- Border: #2A3945

### Typography
- **Headings:** System font (Roboto on Android), Bold, sizes: 28px (H1), 22px (H2), 18px (H3)
- **Body:** System font, Regular, 16px
- **Caption:** System font, Regular, 14px
- **Button Text:** System font, Medium, 16px

### Visual Design
- **Icons:** Use MaterialCommunityIcons from @expo/vector-icons
  - Home: "water-outline"
  - History: "calendar-clock"
  - Profile: "account-circle-outline"
  - Add water: "plus-circle"
  - Settings: "cog-outline"
- **Progress Indicator:** Circular with wave animation filling up
- **Buttons:**
  - Primary: Filled with primary color, rounded corners (8px)
  - Secondary: Outlined with border, transparent background
  - All buttons have press feedback (opacity: 0.7)
- **Input Fields:**
  - Outlined style with 8px border radius
  - 48px height minimum (Android touch target)
  - Focus state: border color changes to primary
- **Cards:** Use elevated cards (elevation: 2) for water log entries
- **Spacing:** Base unit 4px, standard spacing: 8px, 16px, 24px

### Critical Assets
1. **Water Drop Icon** - For splash screen logo and empty states
2. **Preset Avatars** (3-5 options) - Water-themed abstract illustrations (waves, droplets, ocean-inspired)
3. **Progress Wave Animation** - Animated water wave for circular progress

### Accessibility
- Minimum touch target: 48x48px (Material Design standard)
- Color contrast ratio: 4.5:1 for normal text, 3:1 for large text
- All interactive elements have clear focus states
- Support for Android TalkBack screen reader
- Theme toggle easily discoverable in profile screen