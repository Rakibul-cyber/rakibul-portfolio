# Rakibul Hassan — Portfolio Website
**Flutter Web Portfolio** · `rakibulhassan.dev`

A production-ready Flutter web portfolio designed for freelance & contract developer positioning.

---

## 🚀 Quick Start

### Prerequisites
- Flutter SDK 3.x+ (`flutter --version`)
- Chrome browser (for web dev)

### Run Locally
```bash
# 1. Install dependencies
flutter pub get

# 2. Run in Chrome
flutter run -d chrome

# 3. Build for production
flutter build web --release --web-renderer canvaskit
```

### Deploy
The `build/web/` folder is your deployable output. Works with:
- **GitHub Pages** — push `build/web/` to `gh-pages` branch
- **Firebase Hosting** — `firebase deploy`
- **Netlify / Vercel** — drag & drop `build/web/`
- **Custom domain** — point DNS to your hosting

---

## 📁 Project Structure

```
lib/
├── main.dart                    # App entry point
├── theme/
│   └── app_theme.dart           # Colors, typography, theme
├── models/
│   └── portfolio_data.dart      # All content (projects, skills, pricing)
├── screens/
│   ├── portfolio_page.dart      # Main page + nav assembly
│   ├── hero_section.dart        # Hero + terminal animation
│   ├── skills_section.dart      # Skills & certifications
│   ├── projects_section.dart    # Projects grid
│   ├── hire_section.dart        # Pricing & hire me
│   └── blog_contact_section.dart # Blog, contact form, footer
└── widgets/
    └── common_widgets.dart      # Shared: buttons, cards, tags, nav
web/
└── index.html                   # SEO meta + loading screen
```

---

## ✏️ Customization

### Update Your Content
All portfolio content lives in one file: **`lib/models/portfolio_data.dart`**

- Add/edit **projects** in `PortfolioData.projects`
- Update **skills** in `PortfolioData.skills`
- Change **pricing** in `PortfolioData.packages`
- Add **blog posts** in `PortfolioData.blogPosts`

### Update Rates
Find `HirePackage` entries in `portfolio_data.dart` and edit the `price` field.

### Add CV Download
In `common_widgets.dart`, find `'Download CV'` button and wire `url_launcher`:
```dart
import 'package:url_launcher/url_launcher.dart';
// ...
onTap: () => launchUrl(Uri.parse('https://your-cv-link.pdf')),
```

### Colors
All colors are in `lib/theme/app_theme.dart`. Change `cyan`, `amber`, etc.

---

## 🎨 Design System

| Token | Hex | Usage |
|-------|-----|-------|
| bgDeep | `#0A0F1E` | Page background |
| bgCard | `#111827` | Card backgrounds |
| cyan | `#00D4FF` | Primary accent, CTAs |
| amber | `#FFB347` | Secondary accent |
| textPrimary | `#E8EDF5` | Headings |
| textSecondary | `#8B9DC3` | Body text |

**Fonts:** Space Grotesk (display) + Inter (body) + JetBrains Mono (terminal)

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `google_fonts` | Space Grotesk + Inter + JetBrains Mono |
| `flutter_animate` | Scroll/entry animations |
| `animated_text_kit` | Text animations |
| `url_launcher` | Links, CV download |
| `font_awesome_flutter` | Social icons |
| `visibility_detector` | Scroll-triggered animations |

---

## 📋 TODO / Next Steps

- [ ] Connect contact form to EmailJS or backend
- [ ] Add real CV PDF download link
- [ ] Add your profile photo to hero section
- [ ] Write and publish first blog post
- [ ] Set up custom domain (`rakibulhassan.dev`)
- [ ] Add Google Analytics
- [ ] Deploy to Firebase Hosting

---

Built with Flutter 💙 · Frankfurt am Main, Germany
