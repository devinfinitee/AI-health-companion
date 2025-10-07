# AI Health Companion - Design Guidelines

## Design Approach

**Selected Approach:** Hybrid - Healthcare Design System with Modern App Aesthetics

This health companion requires the trustworthiness of medical applications combined with the approachability of consumer health apps. Drawing inspiration from healthcare leaders like Zocdoc, Headspace Health, and Ada Health, while incorporating modern app design patterns.

**Core Principles:**
- Trust & Clarity: Medical information must be immediately understandable
- Accessibility First: Health apps serve diverse users with varying abilities
- Voice-Centric: Design supports voice-first interactions with visual reinforcement
- Mobile PWA: Optimized for mobile usage patterns and offline capability

## Color Palette

### Light Mode
**Primary Colors:**
- Medical Purple: 270 70% 55% (primary actions, branding)
- Deep Blue: 220 85% 45% (secondary actions, trust elements)
- Soft Purple: 270 60% 95% (backgrounds, cards)

**Semantic Colors:**
- Success/Health: 150 65% 45% (confirmations, positive indicators)
- Warning: 40 95% 55% (caution states)
- Emergency Red: 0 85% 50% (emergency actions only)

**Neutrals:**
- Background: 0 0% 98%
- Card Background: 0 0% 100%
- Text Primary: 220 20% 15%
- Text Secondary: 220 15% 45%

### Dark Mode
**Primary Colors:**
- Medical Purple: 270 60% 65% (adjusted for dark backgrounds)
- Deep Blue: 220 70% 55%
- Dark Purple BG: 270 30% 12%

**Neutrals:**
- Background: 270 20% 8%
- Card Background: 270 15% 12%
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 70%

## Typography

**Font Families:**
- Primary: 'Inter' (Google Fonts) - Clean, highly legible for health information
- Accent: 'Plus Jakarta Sans' (Google Fonts) - Friendly for headings and CTAs

**Scale & Usage:**
- Headings: Plus Jakarta Sans, Bold (600-700)
  - H1: text-4xl md:text-5xl (Dashboard greetings, page titles)
  - H2: text-3xl md:text-4xl (Section headers)
  - H3: text-xl md:text-2xl (Card titles)
  
- Body: Inter, Regular (400) to Medium (500)
  - Large: text-lg (AI responses, primary content)
  - Base: text-base (General content, chat messages)
  - Small: text-sm (Meta info, timestamps)

## Layout System

**Spacing Primitives:** Tailwind units of 4, 6, 8, 12, 16, 20
- Component padding: p-4 to p-8
- Section spacing: py-12 to py-20
- Card gaps: gap-6 to gap-8
- Micro-spacing: space-y-4

**Mobile PWA Layout:**
- Safe area insets respected (env(safe-area-inset-*))
- Bottom navigation bar: h-16 with backdrop-blur
- Maximum width: max-w-7xl for desktop, full-width mobile
- Fixed elements: Top header (h-16) + Bottom nav (h-16)
- Content area: min-h-[calc(100vh-8rem)] accounting for nav

**Grid Patterns:**
- Dashboard cards: grid-cols-1 md:grid-cols-2 gap-6
- Health resources: grid-cols-1 md:grid-cols-3 gap-6
- Single column chat: Always full-width for readability

## Component Library

### Core UI Elements

**Voice Assistant Button (Hero Element):**
- Large circular button: w-24 h-24 md:w-32 md:h-32
- Pulsing animation when active (subtle, not distracting)
- Microphone icon from Heroicons
- Purple gradient background
- Positioned centrally on dashboard and chat page
- States: Idle, Listening (pulsing), Processing (spinner)

**Cards:**
- Rounded: rounded-2xl
- Shadow: shadow-md with subtle purple tint
- Padding: p-6 md:p-8
- Background: Soft purple (light) / Dark purple (dark)
- Border: 1px border with subtle opacity

**Buttons:**
- Primary (CTA): bg-purple-600 text-white, rounded-xl, px-6 py-3
- Secondary: variant="outline" with purple border
- Emergency: bg-red-600 text-white (only for critical actions)
- Icon buttons: Square w-10 h-10 for voice controls

### Navigation

**Top Header (Desktop & Mobile):**
- Sticky positioning
- Logo left, profile/settings right
- Backdrop blur: backdrop-blur-lg
- Height: h-16

**Bottom Navigation (Mobile PWA):**
- Fixed bottom bar with 4-5 main actions
- Icons: Dashboard, Chat, Symptom Checker, Appointments, Profile
- Active state: Purple fill with label
- Inactive: Gray with icon only

### Forms & Input

**Chat/Text Input:**
- Full-width with microphone icon embedded right
- Rounded: rounded-full (chat input), rounded-xl (forms)
- Padding: px-6 py-4
- Focus: Purple ring-2 ring-purple-400

**Date/Time Picker:**
- Calendar grid with purple highlights
- Selected date: Filled purple circle
- Available slots: Grid of time buttons

### Data Display

**Conversation Transcript:**
- User messages: Aligned right, purple background
- AI messages: Aligned left, white/dark background
- Avatar icons: User (initials), AI (logo)
- Spacing: space-y-4 between messages
- Timestamps: Small, gray text

**Health Summary Cards:**
- Icon (Heroicons medical icons)
- Title + metric/stat
- Brief description
- Subtle border-l-4 with purple accent

**Appointment Cards:**
- Date/time prominent (large text)
- Doctor info with avatar
- Location/type (in-person/telehealth)
- Action buttons: Reschedule, Cancel, Join (for telehealth)

### Overlays & Modals

**Confirmation Dialogs:**
- Centered modal: max-w-md
- Backdrop: bg-black/50 backdrop-blur-sm
- Action buttons: Primary (confirm) + Secondary (cancel)

**Toast Notifications:**
- Bottom positioning (above nav): bottom-20
- Auto-dismiss: 5s
- Types: Success (green), Error (red), Info (blue)

## Images

**Hero/Dashboard Image:**
- Large hero area NOT required - focus on functional interface
- Medical imagery only as accent illustrations

**Image Usage:**
- Health Resources: Article thumbnails (rounded-lg, aspect-video)
- Doctor Profiles: Circular avatars (w-12 h-12 to w-20 h-20)
- Empty States: Simple illustrations (not photos)
- Avoid stock medical photos - use modern illustrations instead

**Icon Library:** Heroicons (via CDN)
- Medical: heart, shield-check, clipboard-document-check
- Actions: microphone, phone, calendar, chat-bubble
- Navigation: home, user-circle, document-text

## Animations

**Minimal & Purposeful:**
- Voice button pulse: When actively listening (scale + opacity)
- Page transitions: Subtle slide (translate-x)
- Loading states: Skeleton screens with gradient shimmer
- Hover states: scale-105 for cards, brightness for buttons
- NO auto-playing animations, respect reduced-motion preferences

## Accessibility Features

**Voice Interface:**
- Visual feedback for all voice states (idle, listening, processing)
- Text alternatives displayed simultaneously with voice responses
- "Skip to text" option always visible

**Text & Contrast:**
- WCAG AAA compliance for all text (7:1 ratio minimum)
- Emergency red only for actual emergencies (high contrast)
- Text resize up to 200% without layout breaking

**Interaction:**
- All features accessible via keyboard
- Touch targets: minimum 44x44px
- Focus indicators: 2px purple ring, always visible
- Form errors: Color + icon + text description

**Language & Readability:**
- Medical terms with plain-language tooltips
- Reading level: 8th grade or below for general content
- Language switcher: Prominent in header and settings

## Mobile PWA Specific

**Installation:**
- Custom splash screen: Purple gradient with logo
- App icon: Rounded square with medical cross/heart symbol
- Theme color: Purple primary for system UI

**Offline Support:**
- Cached health resources available offline
- Appointment list cached
- Clear offline indicators
- Sync badge when connection restored

**Mobile Interactions:**
- Pull-to-refresh on dashboard
- Swipe gestures for navigation (optional)
- Bottom sheet modals for actions (not centered overlays)
- Haptic feedback for voice activation (if available)

## Page-Specific Guidelines

**Dashboard:** Feature voice button prominently (center top), health summary grid below, quick actions in cards

**Chat/Interaction:** Fixed input at bottom, scrollable transcript, voice button always accessible (top-right corner when in chat)

**Symptom Checker:** Progressive disclosure - show common symptoms first, then text input for custom

**Appointment Booking:** Step indicator at top, one step per screen on mobile, breadcrumb navigation

**Health Resources:** Masonry grid (desktop) / stacked cards (mobile), search prominent, category filters as horizontal scroll chips

**Profile/Settings:** Grouped sections with clear labels, toggle switches for preferences, logout clearly separated at bottom