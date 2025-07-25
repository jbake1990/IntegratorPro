# Integrator Pro Style Guide

This document outlines the design system and style guide for the Integrator Pro application.

## Table of Contents

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Components](#components)
5. [Usage Guidelines](#usage-guidelines)
6. [CSS Custom Properties](#css-custom-properties)
7. [Material-UI Theme](#material-ui-theme)

## Color Palette

### Primary Colors

| Color Name | Hex Code | Usage | CSS Variable |
|------------|----------|-------|--------------|
| **Charcoal** | `#1F2937` | Primary text, navigation, headers | `--color-charcoal` |
| **AV Blue** | `#2563EB` | Primary brand color, buttons, links | `--color-av-blue` |
| **Integration Green** | `#22C55E` | Success states, positive actions | `--color-integration-green` |
| **Alert Orange** | `#F59E0B` | Warnings, attention-grabbing elements | `--color-alert-orange` |
| **Light UI Gray** | `#F1F5F9` | Backgrounds, subtle borders | `--color-light-ui-gray` |

### Color Variations

#### Charcoal Variations
- **Light**: `#374151` (`--color-charcoal-light`)
- **Dark**: `#111827` (`--color-charcoal-dark`)

#### AV Blue Variations
- **Light**: `#3B82F6` (`--color-av-blue-light`)
- **Dark**: `#1D4ED8` (`--color-av-blue-dark`)

#### Integration Green Variations
- **Light**: `#34D399` (`--color-integration-green-light`)
- **Dark**: `#16A34A` (`--color-integration-green-dark`)

#### Alert Orange Variations
- **Light**: `#FBBF24` (`--color-alert-orange-light`)
- **Dark**: `#D97706` (`--color-alert-orange-dark`)

#### Light UI Gray Variations
- **Darker**: `#E2E8F0` (`--color-light-ui-gray-darker`)
- **Darkest**: `#CBD5E1` (`--color-light-ui-gray-darkest`)

### Semantic Colors

| Purpose | Color | Hex Code | CSS Variable |
|---------|-------|----------|--------------|
| Success | Integration Green | `#22C55E` | `--color-success` |
| Warning | Alert Orange | `#F59E0B` | `--color-warning` |
| Error | Red | `#EF4444` | `--color-error` |
| Info | AV Blue | `#2563EB` | `--color-info` |

### Gray Scale

| Shade | Hex Code | Usage |
|-------|----------|-------|
| 50 | `#F8FAFC` | Lightest backgrounds |
| 100 | `#F1F5F9` | Light UI Gray (main) |
| 200 | `#E2E8F0` | Subtle borders |
| 300 | `#CBD5E1` | Disabled elements |
| 400 | `#94A3B8` | Placeholder text |
| 500 | `#64748B` | Secondary text |
| 600 | `#475569` | Primary text (alternative) |
| 700 | `#334155` | Dark text |
| 800 | `#1E293B` | Very dark text |
| 900 | `#0F172A` | Darkest text |

## Typography

### Font Family

**Primary Font**: Inter (Google Fonts)
- **CSS**: `font-family: 'Inter', -apple-system, BlinkMacSystemFont, ...`
- **Variable**: `--font-family-primary`

**Monospace Font**: SF Mono, Monaco, Inconsolata, Roboto Mono
- **CSS**: `font-family: 'SF Mono', Monaco, Inconsolata, ...`
- **Variable**: `--font-family-mono`

### Typography Scale

| Element | Font Size | Font Weight | Line Height | Usage |
|---------|-----------|-------------|-------------|-------|
| **H1** | 2.5rem (40px) | 700 | 1.2 | Page titles |
| **H2** | 2rem (32px) | 600 | 1.3 | Section headers |
| **H3** | 1.75rem (28px) | 600 | 1.3 | Subsection headers |
| **H4** | 1.5rem (24px) | 600 | 1.4 | Card titles |
| **H5** | 1.25rem (20px) | 600 | 1.4 | Small headers |
| **H6** | 1.125rem (18px) | 600 | 1.4 | Smallest headers |
| **Subtitle 1** | 1rem (16px) | 500 | 1.5 | Large subtitles |
| **Subtitle 2** | 0.875rem (14px) | 500 | 1.5 | Small subtitles |
| **Body 1** | 1rem (16px) | 400 | 1.6 | Primary body text |
| **Body 2** | 0.875rem (14px) | 400 | 1.6 | Secondary body text |
| **Button** | 0.875rem (14px) | 500 | 1.5 | Button labels |
| **Caption** | 0.75rem (12px) | 400 | 1.4 | Small text |
| **Overline** | 0.75rem (12px) | 500 | 1.4 | Uppercase labels |

### Font Weights

- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

## Spacing & Layout

### Spacing Scale

| Name | Value | CSS Variable | Usage |
|------|-------|--------------|-------|
| **XS** | 4px | `--spacing-xs` | Tight spacing |
| **SM** | 8px | `--spacing-sm` | Small spacing |
| **MD** | 16px | `--spacing-md` | Default spacing |
| **LG** | 24px | `--spacing-lg` | Large spacing |
| **XL** | 32px | `--spacing-xl` | Extra large spacing |
| **2XL** | 48px | `--spacing-2xl` | Maximum spacing |

### Border Radius

| Size | Value | CSS Variable | Usage |
|------|-------|--------------|-------|
| **SM** | 4px | `--border-radius-sm` | Small elements |
| **MD** | 8px | `--border-radius-md` | Buttons, inputs |
| **LG** | 12px | `--border-radius-lg` | Cards, papers |
| **XL** | 16px | `--border-radius-xl` | Large containers |

### Shadows

| Level | CSS Variable | Usage |
|-------|--------------|-------|
| **SM** | `--shadow-sm` | Subtle elevation |
| **MD** | `--shadow-md` | Default cards |
| **LG** | `--shadow-lg` | Elevated elements |
| **XL** | `--shadow-xl` | Floating elements |

## Components

### Buttons

#### Primary Button
- **Background**: AV Blue (`#2563EB`)
- **Text**: White
- **Border Radius**: 8px
- **Font Weight**: 500

```tsx
<Button variant="contained" color="primary">
  Primary Action
</Button>
```

#### Secondary Button
- **Background**: Integration Green (`#22C55E`)
- **Text**: White
- **Border Radius**: 8px

```tsx
<Button variant="contained" color="secondary">
  Secondary Action
</Button>
```

#### Outlined Button
- **Border**: AV Blue (`#2563EB`)
- **Text**: AV Blue
- **Background**: Transparent

```tsx
<Button variant="outlined" color="primary">
  Outlined Action
</Button>
```

### Cards

- **Background**: White
- **Border**: 1px solid Light UI Gray Darker (`#E2E8F0`)
- **Border Radius**: 12px
- **Shadow**: Medium shadow
- **Padding**: 16px-24px

```tsx
<Card>
  <CardContent>
    Card content here
  </CardContent>
</Card>
```

### Navigation

#### Sidebar
- **Background**: Charcoal (`#1F2937`)
- **Text**: White
- **Selected Item**: AV Blue (`#2563EB`)
- **Hover**: Charcoal Light (`#374151`)

#### Top Bar
- **Background**: Charcoal (`#1F2937`)
- **Text**: White
- **Shadow**: Small shadow

### Forms

#### Text Fields
- **Border**: Light UI Gray Darker (`#E2E8F0`)
- **Border Radius**: 8px
- **Focus Border**: AV Blue (`#2563EB`)
- **Focus Border Width**: 2px

```tsx
<TextField
  variant="outlined"
  label="Label"
  placeholder="Placeholder text"
/>
```

### Status Indicators

#### Success
- **Color**: Integration Green (`#22C55E`)
- **Background**: `#F0FDF4`

#### Warning
- **Color**: Alert Orange (`#F59E0B`)
- **Background**: `#FFFBEB`

#### Error
- **Color**: Error Red (`#EF4444`)
- **Background**: `#FEF2F2`

#### Info
- **Color**: AV Blue (`#2563EB`)
- **Background**: `#EFF6FF`

## Usage Guidelines

### Color Usage

1. **Primary Colors**: Use sparingly for key actions and brand elements
2. **Charcoal**: Primary text color, navigation backgrounds
3. **AV Blue**: Primary call-to-action buttons, links, selected states
4. **Integration Green**: Success states, positive actions, secondary buttons
5. **Alert Orange**: Warnings, urgent notifications, attention-grabbing elements
6. **Light UI Gray**: Page backgrounds, subtle borders, disabled states

### Typography Guidelines

1. **Hierarchy**: Use consistent heading levels to create clear information hierarchy
2. **Contrast**: Ensure sufficient contrast between text and background colors
3. **Line Length**: Keep line lengths between 45-75 characters for optimal readability
4. **Font Weights**: Use medium (500) or semibold (600) for emphasis, avoid overusing bold

### Spacing Guidelines

1. **Consistent Scale**: Use the defined spacing scale for all margins and padding
2. **Vertical Rhythm**: Maintain consistent vertical spacing between elements
3. **Component Spacing**: Use 16px (MD) as the default spacing between components
4. **Section Spacing**: Use 24px (LG) or 32px (XL) between major sections

## CSS Custom Properties

All colors, spacing, and design tokens are available as CSS custom properties:

```css
/* Colors */
color: var(--color-av-blue);
background-color: var(--color-light-ui-gray);

/* Spacing */
margin: var(--spacing-md);
padding: var(--spacing-lg);

/* Typography */
font-family: var(--font-family-primary);

/* Border Radius */
border-radius: var(--border-radius-md);

/* Shadows */
box-shadow: var(--shadow-md);
```

### Utility Classes

Common utility classes are available for quick styling:

```css
/* Colors */
.text-charcoal { color: var(--color-charcoal); }
.text-av-blue { color: var(--color-av-blue); }
.bg-light-ui-gray { background-color: var(--color-light-ui-gray); }

/* Spacing */
.mb-2 { margin-bottom: var(--spacing-md); }
.p-3 { padding: var(--spacing-lg); }

/* Text Alignment */
.text-center { text-align: center; }
```

## Material-UI Theme

The application uses a custom Material-UI theme that implements this design system. Key customizations include:

1. **Color Palette**: All colors mapped to the Integrator Pro palette
2. **Typography**: Inter font family with defined scales
3. **Component Overrides**: Consistent styling for buttons, cards, forms, etc.
4. **Shape**: 8px default border radius
5. **Shadows**: Custom shadow definitions

### Theme Usage

```tsx
import { useTheme } from '@mui/material/styles';

const theme = useTheme();
const primaryColor = theme.palette.primary.main; // #2563EB
```

## Implementation Notes

1. **Google Fonts**: Inter is loaded from Google Fonts in the HTML head
2. **CSS Variables**: All design tokens are available as CSS custom properties
3. **Material-UI**: Custom theme applies the design system to all MUI components
4. **Fallbacks**: Font stack includes system fonts as fallbacks
5. **Accessibility**: Colors meet WCAG contrast requirements
6. **Responsive**: Design system scales appropriately across device sizes

## Future Considerations

1. **Dark Mode**: Consider adding dark mode variants for all colors
2. **Color Blind Accessibility**: Ensure color combinations work for color blind users
3. **Brand Evolution**: Update colors if brand guidelines change
4. **Component Library**: Consider extracting reusable components
5. **Animation**: Add consistent animation timing and easing functions

---

*This style guide is a living document and should be updated as the design system evolves.* 