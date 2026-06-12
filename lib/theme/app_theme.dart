import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Palette
  static const Color bgDeep = Color(0xFF0A0F1E);
  static const Color bgCard = Color(0xFF111827);
  static const Color bgCardHover = Color(0xFF1A2235);
  static const Color cyan = Color(0xFF00D4FF);
  static const Color amber = Color(0xFFFFB347);
  static const Color textPrimary = Color(0xFFE8EDF5);
  static const Color textSecondary = Color(0xFF8B9DC3);
  static const Color divider = Color(0xFF1E2D45);
  static const Color success = Color(0xFF10B981);

  static ThemeData get theme => ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: bgDeep,
        colorScheme: const ColorScheme.dark(
          primary: cyan,
          secondary: amber,
          surface: bgCard,
        ),
        textTheme:
            GoogleFonts.interTextTheme(ThemeData.dark().textTheme).copyWith(
          displayLarge: GoogleFonts.spaceGrotesk(
            fontSize: 72,
            fontWeight: FontWeight.w700,
            color: textPrimary,
            height: 1.1,
            letterSpacing: -2,
          ),
          displayMedium: GoogleFonts.spaceGrotesk(
            fontSize: 48,
            fontWeight: FontWeight.w700,
            color: textPrimary,
            height: 1.2,
            letterSpacing: -1,
          ),
          displaySmall: GoogleFonts.spaceGrotesk(
            fontSize: 36,
            fontWeight: FontWeight.w600,
            color: textPrimary,
          ),
          headlineMedium: GoogleFonts.spaceGrotesk(
            fontSize: 28,
            fontWeight: FontWeight.w600,
            color: textPrimary,
          ),
          titleLarge: GoogleFonts.spaceGrotesk(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: textPrimary,
          ),
          bodyLarge: GoogleFonts.inter(
            fontSize: 16,
            color: textSecondary,
            height: 1.7,
          ),
          bodyMedium: GoogleFonts.inter(
            fontSize: 14,
            color: textSecondary,
            height: 1.6,
          ),
          labelLarge: GoogleFonts.spaceGrotesk(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            letterSpacing: 1.2,
          ),
        ),
      );
}
