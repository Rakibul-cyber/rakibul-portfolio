import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../theme/app_theme.dart';
import '../models/portfolio_data.dart';
import '../utils/responsive.dart';
import '../widgets/common_widgets.dart';

class HireMeSection extends StatelessWidget {
  const HireMeSection({super.key});

  @override
  Widget build(BuildContext context) {
    return ResponsivePadding(
      vertical: 100,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SectionHeader(
            eyebrow: 'Work With Me',
            title: 'Hire Me',
            subtitle:
                'Available for freelance, part-time contracts, and consulting. Fast communication, SCRUM-ready, invoice + contract provided.',
          ),
          const SizedBox(height: 64),

          // Pricing cards
          _pricingCards(context),

          const SizedBox(height: 64),

          // Why me section
          GlassCard(
            hoverable: false,
            child: Responsive(
              desktop: (_) => Row(
                children: [
                  for (final w in _whyItems) Expanded(child: w),
                ],
              ),
              mobile: (_) => Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  for (final w in _whyItems) ...[
                    w,
                    const SizedBox(height: 28),
                  ],
                ],
              ),
            ),
          ).animate().fadeIn(delay: 700.ms),
        ],
      ),
    );
  }

  Widget _pricingCards(BuildContext context) {
    final cards = PortfolioData.packages.asMap().entries.map((entry) {
      final i = entry.key;
      final pkg = entry.value;
      return _PriceCard(package: pkg)
          .animate()
          .fadeIn(delay: (200 + i * 150).ms)
          .slideY(begin: 0.15, end: 0);
    }).toList();

    return Responsive(
      desktop: (_) => Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          for (int i = 0; i < cards.length; i++)
            Expanded(
              child: Padding(
                padding: EdgeInsets.only(
                  left: i > 0 ? 16 : 0,
                  right: i < cards.length - 1 ? 16 : 0,
                ),
                child: cards[i],
              ),
            ),
        ],
      ),
      mobile: (_) => Column(
        children: [
          for (int i = 0; i < cards.length; i++) ...[
            if (i > 0) const SizedBox(height: 24),
            cards[i],
          ],
        ],
      ),
    );
  }

  List<Widget> get _whyItems => [
        _whyItem('⚡', 'Fast Delivery',
            'SCRUM & Agile workflow. Weekly sprints, daily standup-ready.'),
        _whyItem('📄', 'Contractor-Ready',
            'VAT reverse charge (§13b UStG), invoices, timesheets — all sorted.'),
        _whyItem('🌍', 'Frankfurt-Based',
            'CET timezone. Available for EU companies. Remote or hybrid.'),
        _whyItem('🔬', 'Research Background',
            'MSc Computer Science. Academic + production credibility.'),
      ];

  Widget _whyItem(String icon, String title, String desc) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(icon, style: const TextStyle(fontSize: 28)),
          const SizedBox(height: 12),
          Text(title,
              style: GoogleFonts.spaceGrotesk(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.textPrimary)),
          const SizedBox(height: 8),
          Text(desc,
              style: const TextStyle(
                  color: AppTheme.textSecondary, fontSize: 13, height: 1.6)),
        ],
      ),
    );
  }
}

class _PriceCard extends StatefulWidget {
  final HirePackage package;
  const _PriceCard({required this.package});

  @override
  State<_PriceCard> createState() => _PriceCardState();
}

class _PriceCardState extends State<_PriceCard> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final highlighted = widget.package.isHighlighted;

    return MouseRegion(
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 220),
        padding: const EdgeInsets.all(32),
        decoration: BoxDecoration(
          color: highlighted
              ? AppTheme.cyan.withValues(alpha: 0.06)
              : (_hovered ? AppTheme.bgCardHover : AppTheme.bgCard),
          border: Border.all(
            color: highlighted
                ? AppTheme.cyan.withValues(alpha: 0.6)
                : (_hovered
                    ? AppTheme.cyan.withValues(alpha: 0.3)
                    : AppTheme.divider),
            width: highlighted ? 1.5 : 1,
          ),
          borderRadius: BorderRadius.circular(12),
          boxShadow: highlighted || _hovered
              ? [
                  BoxShadow(
                      color: AppTheme.cyan.withValues(alpha: 0.08),
                      blurRadius: 30)
                ]
              : [],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (highlighted)
              Container(
                margin: const EdgeInsets.only(bottom: 16),
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: AppTheme.cyan,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  'MOST POPULAR',
                  style: GoogleFonts.spaceGrotesk(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.bgDeep,
                    letterSpacing: 1.5,
                  ),
                ),
              ),
            Text(widget.package.name,
                style: GoogleFonts.spaceGrotesk(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.textPrimary)),
            const SizedBox(height: 16),
            Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  widget.package.price,
                  style: GoogleFonts.spaceGrotesk(
                    fontSize: 40,
                    fontWeight: FontWeight.w700,
                    color: highlighted ? AppTheme.cyan : AppTheme.textPrimary,
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Text(widget.package.period,
                      style: const TextStyle(
                          color: AppTheme.textSecondary, fontSize: 16)),
                ),
              ],
            ),
            const SizedBox(height: 24),
            Container(height: 1, color: AppTheme.divider),
            const SizedBox(height: 24),
            ...widget.package.features.map((f) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Row(
                    children: [
                      const Text('✓ ',
                          style: TextStyle(
                              color: AppTheme.cyan,
                              fontWeight: FontWeight.w700)),
                      Expanded(
                          child: Text(f,
                              style: const TextStyle(
                                  color: AppTheme.textSecondary,
                                  fontSize: 13,
                                  height: 1.5))),
                    ],
                  ),
                )),
            const SizedBox(height: 28),
            SizedBox(
              width: double.infinity,
              child: MouseRegion(
                cursor: SystemMouseCursors.click,
                child: GestureDetector(
                  onTap: () {},
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    decoration: BoxDecoration(
                      color: highlighted ? AppTheme.cyan : Colors.transparent,
                      border: Border.all(
                        color: highlighted ? AppTheme.cyan : AppTheme.divider,
                        width: 1.5,
                      ),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Center(
                      child: Text(
                        widget.package.cta,
                        style: GoogleFonts.spaceGrotesk(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: highlighted
                              ? AppTheme.bgDeep
                              : AppTheme.textSecondary,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
