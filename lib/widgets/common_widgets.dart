import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../theme/app_theme.dart';

const String _cvUrl =
    'https://rakibul-cyber.github.io/rakibul-portfolio/CV_MD_Rakibul_Hassan.pdf';

// ─── Navigation Bar ───────────────────────────────────────────────────────────

class PortfolioNav extends StatefulWidget {
  final ScrollController scrollController;
  final List<GlobalKey> sectionKeys;

  const PortfolioNav({
    super.key,
    required this.scrollController,
    required this.sectionKeys,
  });

  @override
  State<PortfolioNav> createState() => _PortfolioNavState();
}

class _PortfolioNavState extends State<PortfolioNav> {
  bool _scrolled = false;
  int _activeIndex = 0;

  final List<String> _labels = [
    'About',
    'Skills',
    'Work',
    'Hire Me',
    'Blog',
    'Contact'
  ];

  @override
  void initState() {
    super.initState();
    widget.scrollController.addListener(_onScroll);
  }

  void _onScroll() {
    final scrolled = widget.scrollController.offset > 60;
    if (scrolled != _scrolled) setState(() => _scrolled = scrolled);
  }

  void _scrollTo(int index) {
    final ctx = widget.sectionKeys[index].currentContext;
    if (ctx != null) {
      Scrollable.ensureVisible(ctx,
          duration: const Duration(milliseconds: 700), curve: Curves.easeInOut);
    }
    setState(() => _activeIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      decoration: BoxDecoration(
        color: _scrolled
            ? AppTheme.bgDeep.withValues(alpha: 0.95)
            : Colors.transparent,
        border: _scrolled
            ? const Border(
                bottom: BorderSide(color: AppTheme.divider, width: 1))
            : null,
        boxShadow: _scrolled
            ? [
                BoxShadow(
                    color: Colors.black.withValues(alpha: 0.3), blurRadius: 20)
              ]
            : [],
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 16),
        child: Row(
          children: [
            // Logo
            RichText(
              text: TextSpan(
                children: [
                  TextSpan(
                    text: 'RH',
                    style: GoogleFonts.spaceGrotesk(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.cyan,
                    ),
                  ),
                  TextSpan(
                    text: '.dev',
                    style: GoogleFonts.spaceGrotesk(
                      fontSize: 22,
                      fontWeight: FontWeight.w400,
                      color: AppTheme.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            const Spacer(),
            // Nav links
            ...List.generate(_labels.length, (i) {
              final active = i == _activeIndex;
              return Padding(
                padding: const EdgeInsets.only(left: 32),
                child: MouseRegion(
                  cursor: SystemMouseCursors.click,
                  child: GestureDetector(
                    onTap: () => _scrollTo(i),
                    child: AnimatedDefaultTextStyle(
                      duration: const Duration(milliseconds: 200),
                      style: GoogleFonts.spaceGrotesk(
                        fontSize: 14,
                        fontWeight: active ? FontWeight.w600 : FontWeight.w400,
                        color: active ? AppTheme.cyan : AppTheme.textSecondary,
                      ),
                      child: Text(_labels[i]),
                    ),
                  ),
                ),
              );
            }),
            const SizedBox(width: 32),
            _CyanButton(
              label: 'Download CV',
              onTap: () => launchUrl(Uri.parse(_cvUrl),
                  mode: LaunchMode.externalApplication),
              small: true,
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Section Header ───────────────────────────────────────────────────────────

class SectionHeader extends StatelessWidget {
  final String eyebrow;
  final String title;
  final String? subtitle;

  const SectionHeader({
    super.key,
    required this.eyebrow,
    required this.title,
    this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              width: 32,
              height: 2,
              color: AppTheme.cyan,
            ),
            const SizedBox(width: 12),
            Text(
              eyebrow.toUpperCase(),
              style: GoogleFonts.spaceGrotesk(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: AppTheme.cyan,
                letterSpacing: 2,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Text(title, style: Theme.of(context).textTheme.displaySmall),
        if (subtitle != null) ...[
          const SizedBox(height: 12),
          Text(subtitle!, style: Theme.of(context).textTheme.bodyLarge),
        ],
      ],
    );
  }
}

// ─── Cyan Primary Button ─────────────────────────────────────────────────────

class _CyanButton extends StatefulWidget {
  final String label;
  final VoidCallback onTap;
  final bool small;

  const _CyanButton({
    super.key,
    required this.label,
    required this.onTap,
    this.small = false,
  });

  @override
  State<_CyanButton> createState() => _CyanButtonState();
}

class _CyanButtonState extends State<_CyanButton> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: GestureDetector(
        onTap: widget.onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: widget.small
              ? const EdgeInsets.symmetric(horizontal: 20, vertical: 10)
              : const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
          decoration: BoxDecoration(
            color: _hovered ? AppTheme.cyan : Colors.transparent,
            border: Border.all(color: AppTheme.cyan, width: 1.5),
            borderRadius: BorderRadius.circular(6),
          ),
          child: Text(
            widget.label,
            style: GoogleFonts.spaceGrotesk(
              fontSize: widget.small ? 13 : 15,
              fontWeight: FontWeight.w600,
              color: _hovered ? AppTheme.bgDeep : AppTheme.cyan,
            ),
          ),
        ),
      ),
    );
  }
}

// Export
class CyanButton extends _CyanButton {
  const CyanButton(
      {super.key, required super.label, required super.onTap, super.small});
}

// ─── Amber Ghost Button ───────────────────────────────────────────────────────

class AmberButton extends StatefulWidget {
  final String label;
  final VoidCallback onTap;

  const AmberButton({super.key, required this.label, required this.onTap});

  @override
  State<AmberButton> createState() => _AmberButtonState();
}

class _AmberButtonState extends State<AmberButton> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: GestureDetector(
        onTap: widget.onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
          decoration: BoxDecoration(
            color: _hovered
                ? AppTheme.amber.withValues(alpha: 0.1)
                : Colors.transparent,
            border: Border.all(
                color: AppTheme.amber.withValues(alpha: 0.6), width: 1.5),
            borderRadius: BorderRadius.circular(6),
          ),
          child: Text(
            widget.label,
            style: GoogleFonts.spaceGrotesk(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: AppTheme.amber,
            ),
          ),
        ),
      ),
    );
  }
}

// ─── Glass Card ───────────────────────────────────────────────────────────────

class GlassCard extends StatefulWidget {
  final Widget child;
  final EdgeInsets? padding;
  final bool hoverable;
  final VoidCallback? onTap;

  const GlassCard({
    super.key,
    required this.child,
    this.padding,
    this.hoverable = true,
    this.onTap,
  });

  @override
  State<GlassCard> createState() => _GlassCardState();
}

class _GlassCardState extends State<GlassCard> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor:
          widget.onTap != null ? SystemMouseCursors.click : MouseCursor.defer,
      onEnter: (_) => widget.hoverable ? setState(() => _hovered = true) : null,
      onExit: (_) => widget.hoverable ? setState(() => _hovered = false) : null,
      child: GestureDetector(
        onTap: widget.onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          padding: widget.padding ?? const EdgeInsets.all(28),
          decoration: BoxDecoration(
            color: _hovered ? AppTheme.bgCardHover : AppTheme.bgCard,
            border: Border.all(
              color: _hovered
                  ? AppTheme.cyan.withValues(alpha: 0.4)
                  : AppTheme.divider,
              width: 1,
            ),
            borderRadius: BorderRadius.circular(12),
            boxShadow: _hovered
                ? [
                    BoxShadow(
                        color: AppTheme.cyan.withValues(alpha: 0.08),
                        blurRadius: 24,
                        spreadRadius: 2)
                  ]
                : [],
          ),
          child: widget.child,
        ),
      ),
    );
  }
}

// ─── Tag Chip ─────────────────────────────────────────────────────────────────

class TagChip extends StatelessWidget {
  final String label;
  final Color? color;

  const TagChip({super.key, required this.label, this.color});

  @override
  Widget build(BuildContext context) {
    final c = color ?? AppTheme.cyan;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: c.withValues(alpha: 0.1),
        border: Border.all(color: c.withValues(alpha: 0.3), width: 1),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        label,
        style: GoogleFonts.spaceGrotesk(
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: c,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

class StatusBadge extends StatelessWidget {
  final String status;

  const StatusBadge({super.key, required this.status});

  Color get _color {
    switch (status.toLowerCase()) {
      case 'live':
      case 'production':
        return AppTheme.success;
      case 'delivered':
        return AppTheme.cyan;
      case 'published':
        return AppTheme.amber;
      default:
        return AppTheme.textSecondary;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 6,
          height: 6,
          decoration: BoxDecoration(
            color: _color,
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(color: _color.withValues(alpha: 0.6), blurRadius: 6)
            ],
          ),
        ),
        const SizedBox(width: 6),
        Text(
          status,
          style: GoogleFonts.spaceGrotesk(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: _color,
          ),
        ),
      ],
    );
  }
}
