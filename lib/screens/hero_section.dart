import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../theme/app_theme.dart';
import '../utils/responsive.dart';
import '../widgets/common_widgets.dart';

class HeroSection extends StatefulWidget {
  final VoidCallback onHireMe;
  final VoidCallback onViewWork;

  const HeroSection(
      {super.key, required this.onHireMe, required this.onViewWork});

  @override
  State<HeroSection> createState() => _HeroSectionState();
}

class _HeroSectionState extends State<HeroSection>
    with TickerProviderStateMixin {
  final List<String> _lines = [
    '> flutter build web --release',
    '✓ Compiled in 4.2s',
    '> docker build -t rakibul/api .',
    '✓ Image built successfully',
    '> aws s3 sync ./build s3://portfolio',
    '✓ Deployed to production',
    '> echo "Available for hire 🚀"',
    '  Available for hire 🚀',
  ];

  final List<String> _roles = [
    'Flutter Developer',
    'DevOps Engineer',
    'Cloud Architect',
    'Full-Stack Developer',
  ];

  String _displayedText = '';
  int _lineIndex = 0;
  int _charIndex = 0;
  int _roleIndex = 0;
  bool _showCursor = true;
  Timer? _typingTimer;
  Timer? _cursorTimer;
  Timer? _roleTimer;

  @override
  void initState() {
    super.initState();
    _startTyping();
    _cursorTimer = Timer.periodic(const Duration(milliseconds: 530), (_) {
      if (mounted) setState(() => _showCursor = !_showCursor);
    });
    _roleTimer = Timer.periodic(const Duration(seconds: 3), (_) {
      if (mounted) {
        setState(() => _roleIndex = (_roleIndex + 1) % _roles.length);
      }
    });
  }

  void _startTyping() {
    _typingTimer = Timer.periodic(const Duration(milliseconds: 38), (_) {
      if (!mounted) return;
      final line = _lines[_lineIndex];
      if (_charIndex < line.length) {
        setState(() {
          _displayedText += line[_charIndex];
          _charIndex++;
        });
      } else {
        _typingTimer?.cancel();
        Future.delayed(const Duration(milliseconds: 600), () {
          if (!mounted) return;
          setState(() => _displayedText += '\n');
          _lineIndex++;
          _charIndex = 0;
          if (_lineIndex < _lines.length) {
            _startTyping();
          }
        });
      }
    });
  }

  @override
  void dispose() {
    _typingTimer?.cancel();
    _cursorTimer?.cancel();
    _roleTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(minHeight: 100),
      padding: const EdgeInsets.only(top: 120, bottom: 80),
      child: ResponsivePadding(
        child: Responsive(
          desktop: (_) => Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Expanded(flex: 5, child: _heroContent(context)),
              const SizedBox(width: 80),
              Expanded(
                flex: 4,
                child: _Terminal(
                    displayedText: _displayedText, showCursor: _showCursor),
              ).animate().fadeIn(delay: 600.ms).slideX(begin: 0.2, end: 0),
            ],
          ),
          mobile: (_) => Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _heroContent(context),
              const SizedBox(height: 48),
              _Terminal(displayedText: _displayedText, showCursor: _showCursor)
                  .animate()
                  .fadeIn(delay: 600.ms)
                  .slideX(begin: 0.2, end: 0),
            ],
          ),
        ),
      ),
    );
  }

  Widget _heroContent(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Availability badge
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
          decoration: BoxDecoration(
            color: AppTheme.success.withValues(alpha: 0.1),
            border: Border.all(color: AppTheme.success.withValues(alpha: 0.4)),
            borderRadius: BorderRadius.circular(100),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(
                  color: AppTheme.success,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                        color: AppTheme.success.withValues(alpha: 0.8),
                        blurRadius: 8)
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Text(
                'Available for freelance & part-time',
                style: GoogleFonts.spaceGrotesk(
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  color: AppTheme.success,
                ),
              ),
            ],
          ),
        ).animate().fadeIn(delay: 200.ms).slideY(begin: -0.3, end: 0),

        const SizedBox(height: 28),

        // Name
        Text(
          'Md. Rakibul Hassan',
          style: Theme.of(context).textTheme.displayLarge,
        ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.2, end: 0),

        const SizedBox(height: 16),

        // Animated role
        AnimatedSwitcher(
          duration: const Duration(milliseconds: 500),
          transitionBuilder: (child, anim) => FadeTransition(
            opacity: anim,
            child: SlideTransition(
              position:
                  Tween<Offset>(begin: const Offset(0, 0.3), end: Offset.zero)
                      .animate(anim),
              child: child,
            ),
          ),
          child: ResponsiveText(
            _roles[_roleIndex],
            key: ValueKey(_roleIndex),
            mobileSize: 22,
            tabletSize: 24,
            desktopSize: 28,
            style: GoogleFonts.spaceGrotesk(
              fontWeight: FontWeight.w500,
              color: AppTheme.cyan,
            ),
          ),
        ).animate().fadeIn(delay: 500.ms),

        const SizedBox(height: 24),

        // Description
        Text(
          'MSc student at Frankfurt University of Applied Sciences. Building production-grade Flutter apps and AWS cloud infrastructure. Based in Frankfurt am Main 🇩🇪.',
          style: Theme.of(context)
              .textTheme
              .bodyLarge
              ?.copyWith(fontSize: 18, height: 1.8),
        ).animate().fadeIn(delay: 600.ms),

        const SizedBox(height: 48),

        // CTAs
        Wrap(
          spacing: 16,
          runSpacing: 16,
          children: [
            CyanButton(label: 'Hire Me →', onTap: widget.onHireMe),
            AmberButton(label: 'View My Work', onTap: widget.onViewWork),
          ],
        ).animate().fadeIn(delay: 800.ms),

        const SizedBox(height: 48),

        // Stats row
        Wrap(
          children: [
            _stat('3+', 'Years Experience'),
            _divider(),
            _stat('10+', 'Projects Shipped'),
            _divider(),
            _stat('3', 'Countries Worked'),
            _divider(),
            _stat('2', 'Publications'),
          ],
        ).animate().fadeIn(delay: 1000.ms),
      ],
    );
  }

  Widget _stat(String value, String label) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          value,
          style: GoogleFonts.spaceGrotesk(
            fontSize: 28,
            fontWeight: FontWeight.w700,
            color: AppTheme.cyan,
          ),
        ),
        Text(label, style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }

  Widget _divider() {
    return Container(
      height: 40,
      width: 1,
      margin: const EdgeInsets.symmetric(horizontal: 24),
      color: AppTheme.divider,
    );
  }
}

class _Terminal extends StatelessWidget {
  final String displayedText;
  final bool showCursor;

  const _Terminal({required this.displayedText, required this.showCursor});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF0D1117),
        border: Border.all(color: AppTheme.divider),
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
              color: AppTheme.cyan.withValues(alpha: 0.08),
              blurRadius: 40,
              spreadRadius: 5),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: AppTheme.divider)),
              borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
              color: Color(0xFF161B22),
            ),
            child: Row(
              children: [
                _dot(const Color(0xFFFF5F57)),
                const SizedBox(width: 8),
                _dot(const Color(0xFFFFBD2E)),
                const SizedBox(width: 8),
                _dot(const Color(0xFF28C840)),
                const Spacer(),
                Text(
                  'rakibul@portfolio ~ terminal',
                  style: GoogleFonts.jetBrainsMono(
                    fontSize: 12,
                    color: AppTheme.textSecondary,
                  ),
                ),
                const Spacer(),
              ],
            ),
          ),

          // Terminal content
          Padding(
            padding: const EdgeInsets.all(24),
            child: RichText(
              text: TextSpan(
                style: GoogleFonts.jetBrainsMono(
                  fontSize: 13,
                  height: 1.9,
                  color: AppTheme.textSecondary,
                ),
                children: _buildSpans(),
              ),
            ),
          ),
        ],
      ),
    );
  }

  List<TextSpan> _buildSpans() {
    final lines = displayedText.split('\n');
    final spans = <TextSpan>[];

    for (int i = 0; i < lines.length; i++) {
      final line = lines[i];
      final isLast = i == lines.length - 1;

      if (line.startsWith('>')) {
        spans.add(TextSpan(
          text: line,
          style: const TextStyle(color: AppTheme.cyan),
        ));
      } else if (line.startsWith('✓')) {
        spans.add(TextSpan(
          text: line,
          style: const TextStyle(color: AppTheme.success),
        ));
      } else {
        spans.add(TextSpan(text: line));
      }

      if (!isLast) {
        spans.add(const TextSpan(text: '\n'));
      } else if (isLast && line.isNotEmpty) {
        spans.add(TextSpan(
          text: '█',
          style: TextStyle(
            color: AppTheme.cyan.withValues(alpha: 0.9),
          ),
        ));
      }
    }

    return spans;
  }

  Widget _dot(Color color) => Container(
        width: 12,
        height: 12,
        decoration: BoxDecoration(color: color, shape: BoxShape.circle),
      );
}
