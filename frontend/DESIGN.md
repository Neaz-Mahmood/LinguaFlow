---
name: Soft-Tech EdTech
colors:
  surface: '#f7f9fc'
  surface-dim: '#d8dadd'
  surface-bright: '#f7f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f7'
  surface-container: '#eceef1'
  surface-container-high: '#e6e8eb'
  surface-container-highest: '#e0e3e6'
  on-surface: '#191c1e'
  on-surface-variant: '#43474a'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f4'
  outline: '#73787b'
  outline-variant: '#c3c7ca'
  surface-tint: '#51616a'
  primary: '#07161e'
  on-primary: '#ffffff'
  primary-container: '#1c2b33'
  on-primary-container: '#83929c'
  inverse-primary: '#b9c9d3'
  secondary: '#5c5e62'
  on-secondary: '#ffffff'
  secondary-container: '#e1e2e7'
  on-secondary-container: '#626468'
  tertiary: '#201105'
  on-tertiary: '#ffffff'
  tertiary-container: '#372516'
  on-tertiary-container: '#a68b77'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e5f0'
  primary-fixed-dim: '#b9c9d3'
  on-primary-fixed: '#0e1d25'
  on-primary-fixed-variant: '#3a4951'
  secondary-fixed: '#e1e2e7'
  secondary-fixed-dim: '#c5c6cb'
  on-secondary-fixed: '#191c1f'
  on-secondary-fixed-variant: '#45474b'
  tertiary-fixed: '#fddcc5'
  tertiary-fixed-dim: '#dfc1aa'
  on-tertiary-fixed: '#28180a'
  on-tertiary-fixed-variant: '#584232'
  background: '#f7f9fc'
  on-background: '#191c1e'
  surface-variant: '#e0e3e6'
  surface-white: '#FFFFFF'
  deep-navy: '#1C2B33'
  subtle-gray: '#65676B'
  background-faint: '#F0F2F5'
  pure-black: '#000000'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  space-xs: 4px
  space-sm: 8px
  space-md: 16px
  space-lg: 24px
  space-xl: 32px
  space-2xl: 48px
  space-3xl: 64px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

This design system is built for a modern language learning environment, balancing the precision of "tech" with the warmth of an "educational" interface. The brand personality is encouraging, clear, and highly focused, aimed at reducing the cognitive load often associated with acquiring a new language.

The design style follows a **Modern / Minimalist** approach with subtle **Soft-Tech** influences. This is achieved through generous whitespace, a high-contrast but limited color palette, and extremely clear typographic hierarchy. The aesthetic avoids unnecessary decoration, ensuring that the educational content—vocabulary, grammar, and syntax—remains the primary focus. Surfaces are clean and layered, using light backgrounds to maintain a feeling of openness and progress.

## Colors

The color palette centers on high-contrast readability. The **Primary Color** (Deep Navy) is used for critical text, primary navigation, and core branding elements to provide a grounded, authoritative feel. The **Secondary Color** (Subtle Gray) is reserved for auxiliary information and deactivated states, ensuring they don't distract from the main learning path.

The **Neutral Color** serves as the foundation for the UI, used for page backgrounds and subtle section separators. We utilize a "Light" default mode to mimic the clarity of printed educational materials, with pure white used for interactive cards and input surfaces to make them "pop" against the faint gray background.

## Typography

The typography system uses a tri-font approach to differentiate between branding, content, and utility.

1.  **Hanken Grotesk (Headlines):** Chosen for its sharp, contemporary geometry. It provides a "tech-forward" feel to headers and titles.
2.  **Be Vietnam Pro (Body):** A friendly and highly legible sans-serif used for all long-form learning content. Its open counters make it excellent for reading foreign scripts and complex sentences.
3.  **JetBrains Mono (Labels/Technical):** Used for metadata, pronunciation guides, and UI labels. The monospaced nature provides a "structured" feel that works well for grammatical rules and systematic data.

For mobile devices, headline sizes scale down to prevent text wrapping issues, while body text remains large to ensure comfortable reading during mobile study sessions.

## Layout & Spacing

This design system utilizes a **Fixed Grid** model for desktop to maintain focus, centering the content area at a maximum width of 1200px. On mobile and tablet, the layout shifts to a **Fluid Grid** to maximize the limited horizontal space.

The spacing rhythm is based on a **4px base unit**. Consistent use of the `space-lg` (24px) for internal card padding and `space-2xl` (48px) for vertical section spacing ensures a rhythmic, predictable flow. 

**Breakpoints:**
- **Mobile:** 0 - 599px (4 columns, 16px margins)
- **Tablet:** 600px - 1023px (8 columns, 24px margins, 20px gutters)
- **Desktop:** 1024px+ (12 columns, 40px margins, 24px gutters)

## Elevation & Depth

To maintain the "Soft-Tech" aesthetic, the design system avoids heavy drop shadows. Instead, it uses **Tonal Layers** and **Low-Contrast Outlines**.

- **Level 0 (Background):** `background-faint` (#F0F2F5). All base content sits here.
- **Level 1 (Cards/Surface):** `surface-white` (#FFFFFF). Interactive elements like lesson cards and input fields are elevated using a pure white background and a subtle 1px border in a slightly darker neutral tint.
- **Level 2 (Active/Hover):** When an element is focused or hovered, a very soft, diffused ambient shadow (8% opacity, 12px blur) is applied to give a "lifting" effect without feeling heavy.
- **Overlays:** Modals and tooltips use a semi-transparent backdrop blur (12px) to maintain context while focusing the user's attention.

## Shapes

The shape language is "Rounded," striking a balance between the precision of a professional tool and the approachability of a learning app. 

Standard components (buttons, text fields) use a 0.5rem (8px) radius. Larger containers, such as lesson modules or progress cards, utilize the `rounded-lg` (16px) or `rounded-xl` (24px) tokens to create a softer, more inviting container for complex information. Full pill shapes are reserved exclusively for "Status" indicators or "Chips" to distinguish them from actionable buttons.

## Components

- **Buttons:** Primary buttons use the `deep-navy` background with white text and `rounded` corners. Secondary buttons use a ghost style with a 1px `subtle-gray` border.
- **Input Fields:** Use a white background, `subtle-gray` thin border, and `label-md` for placeholder text. On focus, the border thickens to 2px in `deep-navy`.
- **Lesson Cards:** Large white containers with `rounded-lg` corners. They should include generous internal padding (`space-lg`) to prevent text from feeling cramped.
- **Progress Bars:** Use a thick 8px height with a `rounded-xl` cap. The track is `background-faint`, while the progress fill is `deep-navy`.
- **Chips (Language Selectors):** Use `rounded-pill` geometry with `label-sm` typography. These are used for selecting tags, languages, or difficulty levels.
- **Feedback States:** Success and Error states should be conveyed via icons and high-contrast text rather than heavy background colors, maintaining the clean, minimalist look.