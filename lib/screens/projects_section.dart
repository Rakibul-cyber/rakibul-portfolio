import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:url_launcher/url_launcher.dart';
import '../theme/app_theme.dart';
import '../models/portfolio_data.dart';
import '../utils/responsive.dart';
import '../widgets/common_widgets.dart';

class ProjectsSection extends StatelessWidget {
  const ProjectsSection({super.key});

  @override
  Widget build(BuildContext context) {
    final projects = _arrangedProjects();

    return Container(
      color: const Color(0xFF080D1A),
      child: ResponsivePadding(
        vertical: 100,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SectionHeader(
              eyebrow: 'Portfolio',
              title: 'Featured Work',
              subtitle:
                  'Production apps, research projects, and open-source experiments.',
            ),
            const SizedBox(height: 48),
            _ProjectShowcaseGrid(projects: projects),
          ],
        ),
      ),
    );
  }

  List<Project> _arrangedProjects() {
    const preferredTitles = [
      'Louco Mobile App',
      'Forest Tracking & Environmental Safety System',
      'Analyzing Historical Stock & Revenue Data and Building a Dashboard',
    ];
    const projects = PortfolioData.projects;
    final arranged = <Project>[];

    for (final title in preferredTitles) {
      for (final project in projects) {
        if (project.title == title) {
          arranged.add(project);
          break;
        }
      }
    }

    arranged.addAll(projects.where((project) => !arranged.contains(project)));
    return arranged;
  }
}

class _ProjectShowcaseGrid extends StatelessWidget {
  final List<Project> projects;

  const _ProjectShowcaseGrid({required this.projects});

  @override
  Widget build(BuildContext context) {
    final columns = ResponsiveLayout.value<int>(
      context,
      mobile: 1,
      tablet: 2,
      desktop: 3,
    );

    return LayoutBuilder(
      builder: (context, constraints) {
        final cardWidth = (constraints.maxWidth -
                (_ProjectCardStyle.gridGap * (columns - 1))) /
            columns;

        return Wrap(
          alignment: WrapAlignment.center,
          spacing: _ProjectCardStyle.gridGap,
          runSpacing: _ProjectCardStyle.gridGap,
          children: List.generate(projects.length, (index) {
            return SizedBox(
              width: cardWidth,
              child: _ProjectCard(
                project: projects[index],
              ).animate().fadeIn(delay: (200 + index * 90).ms),
            );
          }),
        );
      },
    );
  }
}

class _ProjectCardStyle {
  const _ProjectCardStyle._();

  static const double cardRadius = 12;
  static const double imageRadius = 10;
  static const double galleryRadius = 8;
  static const double borderWidth = 1;
  static const double gridGap = 24;
  static const EdgeInsets cardPadding = EdgeInsets.all(22);
  static const int descriptionMaxLines = 3;

  static Border cardBorder(bool hovered) {
    return Border.all(
      color: hovered ? AppTheme.cyan.withValues(alpha: 0.35) : AppTheme.divider,
      width: borderWidth,
    );
  }

  static BoxDecoration cardDecoration(bool hovered) {
    return BoxDecoration(
      color: hovered ? AppTheme.bgCardHover : AppTheme.bgCard,
      border: cardBorder(hovered),
      borderRadius: BorderRadius.circular(cardRadius),
      boxShadow: hovered
          ? [
              BoxShadow(
                color: AppTheme.cyan.withValues(alpha: 0.05),
                blurRadius: 24,
              ),
            ]
          : [],
    );
  }

  static BoxDecoration imageFrameDecoration(double borderRadius) {
    return BoxDecoration(
      color: AppTheme.bgDeep,
      border: Border.all(color: AppTheme.divider, width: borderWidth),
      borderRadius: BorderRadius.circular(borderRadius),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withValues(alpha: 0.24),
          blurRadius: 18,
          offset: const Offset(0, 10),
        ),
      ],
    );
  }
}

class _ProjectCard extends StatefulWidget {
  final Project project;
  const _ProjectCard({required this.project});

  @override
  State<_ProjectCard> createState() => _ProjectCardState();
}

class _ProjectCardState extends State<_ProjectCard> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final hoverEnabled = kIsWeb && ResponsiveLayout.isDesktop(context);

    return MouseRegion(
      onEnter: hoverEnabled ? (_) => setState(() => _hovered = true) : null,
      onExit: hoverEnabled ? (_) => setState(() => _hovered = false) : null,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: _ProjectCardStyle.cardPadding,
        decoration: _ProjectCardStyle.cardDecoration(_hovered),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _ProjectHero(project: widget.project),
            const SizedBox(height: 20),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Text(
                    widget.project.title,
                    style: Theme.of(context).textTheme.titleLarge,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                const SizedBox(width: 12),
                Padding(
                  padding: const EdgeInsets.only(top: 2),
                  child: StatusBadge(status: widget.project.status),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(widget.project.subtitle,
                style: const TextStyle(color: AppTheme.cyan, fontSize: 12)),
            const SizedBox(height: 12),
            Text(
              widget.project.description,
              style: Theme.of(context).textTheme.bodyMedium,
              maxLines: _ProjectCardStyle.descriptionMaxLines,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children:
                  widget.project.tags.map((t) => TagChip(label: t)).toList(),
            ),
            if (widget.project.galleryImagePaths.isNotEmpty) ...[
              const SizedBox(height: 20),
              _ProjectImageGallery(
                imagePaths: widget.project.galleryImagePaths,
              ),
            ],
            if (widget.project.githubUrl != null ||
                widget.project.liveUrl != null) ...[
              const SizedBox(height: 20),
              _ProjectLinks(project: widget.project),
            ],
          ],
        ),
      ),
    );
  }
}

class _ProjectHero extends StatelessWidget {
  final Project project;

  const _ProjectHero({required this.project});

  @override
  Widget build(BuildContext context) {
    final height = ResponsiveLayout.value<double>(
      context,
      mobile: 200,
      tablet: 220,
      desktop: 210,
    );

    return _ProjectImageFrame(
      borderRadius: _ProjectCardStyle.imageRadius,
      child: SizedBox(
        width: double.infinity,
        height: height,
        child: project.coverImagePath == null
            ? _ProjectHeroFallback(project: project)
            : _ProjectImage(
                imagePath: project.coverImagePath!,
                fit: BoxFit.contain,
                alignment: Alignment.center,
              ),
      ),
    );
  }
}

class _ProjectHeroFallback extends StatelessWidget {
  final Project project;

  const _ProjectHeroFallback({required this.project});

  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment.center,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppTheme.cyan.withValues(alpha: 0.04),
        border: Border.all(color: AppTheme.cyan.withValues(alpha: 0.08)),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(project.icon, style: const TextStyle(fontSize: 40)),
          const SizedBox(height: 14),
          Text(
            project.subtitle,
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: AppTheme.textPrimary,
                  fontWeight: FontWeight.w600,
                ),
          ),
        ],
      ),
    );
  }
}

class _ProjectImageGallery extends StatelessWidget {
  final List<String> imagePaths;

  const _ProjectImageGallery({required this.imagePaths});

  @override
  Widget build(BuildContext context) {
    if (imagePaths.isEmpty) {
      return const SizedBox.shrink();
    }

    return LayoutBuilder(
      builder: (context, constraints) {
        const spacing = 10.0;
        final preferredColumns = ResponsiveLayout.value<int>(
          context,
          mobile: constraints.maxWidth < 360 ? 1 : 2,
          tablet: 2,
          desktop: 3,
        );
        final columns = imagePaths.length < preferredColumns
            ? imagePaths.length
            : preferredColumns;
        final itemHeight = ResponsiveLayout.value<double>(
          context,
          mobile: columns == 1 ? 180 : 150,
          tablet: 150,
          desktop: 125,
        );
        final itemWidth =
            (constraints.maxWidth - (spacing * (columns - 1))) / columns;

        return Wrap(
          spacing: spacing,
          runSpacing: spacing,
          children: imagePaths
              .map(
                (path) => SizedBox(
                  width: itemWidth,
                  child: _ProjectImageFrame(
                    borderRadius: _ProjectCardStyle.galleryRadius,
                    child: SizedBox(
                      height: itemHeight,
                      child: _ProjectImage(
                        imagePath: path,
                        fit: BoxFit.contain,
                        alignment: Alignment.center,
                      ),
                    ),
                  ),
                ),
              )
              .toList(),
        );
      },
    );
  }
}

class _ProjectLinks extends StatelessWidget {
  final Project project;

  const _ProjectLinks({required this.project});

  @override
  Widget build(BuildContext context) {
    final links = <Widget>[
      if (project.githubUrl != null)
        _ProjectLinkButton(
          label: 'Code',
          icon: Icons.code_rounded,
          url: project.githubUrl!,
        ),
      if (project.liveUrl != null)
        _ProjectLinkButton(
          label: 'Live',
          icon: Icons.open_in_new_rounded,
          url: project.liveUrl!,
        ),
    ];

    return Wrap(
      spacing: 10,
      runSpacing: 10,
      children: links,
    );
  }
}

class _ProjectLinkButton extends StatefulWidget {
  final String label;
  final IconData icon;
  final String url;

  const _ProjectLinkButton({
    required this.label,
    required this.icon,
    required this.url,
  });

  @override
  State<_ProjectLinkButton> createState() => _ProjectLinkButtonState();
}

class _ProjectLinkButtonState extends State<_ProjectLinkButton> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: GestureDetector(
        onTap: () => launchUrl(
          Uri.parse(widget.url),
          mode: LaunchMode.externalApplication,
        ),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: _hovered
                ? AppTheme.cyan.withValues(alpha: 0.12)
                : Colors.transparent,
            border: Border.all(
              color: _hovered
                  ? AppTheme.cyan.withValues(alpha: 0.55)
                  : AppTheme.divider,
            ),
            borderRadius: BorderRadius.circular(6),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(widget.icon, size: 15, color: AppTheme.cyan),
              const SizedBox(width: 7),
              Text(
                widget.label,
                style: Theme.of(context).textTheme.labelLarge?.copyWith(
                      color: AppTheme.cyan,
                      fontSize: 12,
                      letterSpacing: 0.4,
                    ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ProjectImageFrame extends StatelessWidget {
  final Widget child;
  final double borderRadius;

  const _ProjectImageFrame({
    required this.child,
    required this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: _ProjectCardStyle.imageFrameDecoration(borderRadius),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(borderRadius - 1),
        clipBehavior: Clip.antiAlias,
        child: child,
      ),
    );
  }
}

class _ProjectImage extends StatelessWidget {
  final String imagePath;
  final BoxFit fit;
  final Alignment alignment;

  const _ProjectImage({
    required this.imagePath,
    required this.fit,
    required this.alignment,
  });

  @override
  Widget build(BuildContext context) {
    return Image.asset(
      imagePath,
      fit: fit,
      alignment: alignment,
      filterQuality: FilterQuality.high,
      errorBuilder: (context, error, stackTrace) {
        return _ProjectImagePlaceholder(imagePath: imagePath);
      },
    );
  }
}

class _ProjectImagePlaceholder extends StatelessWidget {
  final String imagePath;

  const _ProjectImagePlaceholder({required this.imagePath});

  @override
  Widget build(BuildContext context) {
    if (imagePath.contains('stock-dashboard')) {
      return _StockDashboardPlaceholder(imagePath: imagePath);
    }

    return Container(
      color: AppTheme.bgDeep,
      alignment: Alignment.center,
      child: Icon(
        Icons.image_not_supported_outlined,
        color: AppTheme.textSecondary.withValues(alpha: 0.6),
        size: 28,
      ),
    );
  }
}

class _StockDashboardPlaceholder extends StatelessWidget {
  final String imagePath;

  const _StockDashboardPlaceholder({required this.imagePath});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppTheme.bgDeep,
      padding: const EdgeInsets.all(18),
      child: CustomPaint(
        painter: _StockDashboardPlaceholderPainter(
          label: _placeholderLabel,
        ),
        child: const SizedBox.expand(),
      ),
    );
  }

  String get _placeholderLabel {
    if (imagePath.contains('data')) return 'Financial Data';
    if (imagePath.contains('visualization')) return 'Price Chart';
    if (imagePath.contains('revenue')) return 'Revenue Trend';
    if (imagePath.contains('analysis')) return 'Notebook Analysis';
    if (imagePath.contains('dashboard')) return 'Interactive Dashboard';
    return 'Stock Revenue Dashboard';
  }
}

class _StockDashboardPlaceholderPainter extends CustomPainter {
  final String label;

  const _StockDashboardPlaceholderPainter({required this.label});

  @override
  void paint(Canvas canvas, Size size) {
    final panelPaint = Paint()
      ..color = AppTheme.bgCard.withValues(alpha: 0.92)
      ..style = PaintingStyle.fill;
    final borderPaint = Paint()
      ..color = AppTheme.divider
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;
    final gridPaint = Paint()
      ..color = AppTheme.divider.withValues(alpha: 0.55)
      ..strokeWidth = 1;
    final linePaint = Paint()
      ..color = AppTheme.cyan
      ..strokeWidth = 2.4
      ..style = PaintingStyle.stroke;
    final revenuePaint = Paint()
      ..color = AppTheme.amber.withValues(alpha: 0.72)
      ..style = PaintingStyle.fill;
    final accentPaint = Paint()
      ..color = AppTheme.success.withValues(alpha: 0.75)
      ..style = PaintingStyle.fill;

    final rect = RRect.fromRectAndRadius(
      Offset.zero & size,
      const Radius.circular(8),
    );
    canvas.drawRRect(rect, panelPaint);
    canvas.drawRRect(rect, borderPaint);

    final chart = Rect.fromLTWH(
      size.width * 0.1,
      size.height * 0.24,
      size.width * 0.8,
      size.height * 0.46,
    );

    for (var i = 0; i <= 4; i++) {
      final y = chart.top + chart.height * (i / 4);
      canvas.drawLine(Offset(chart.left, y), Offset(chart.right, y), gridPaint);
    }
    for (var i = 0; i <= 5; i++) {
      final x = chart.left + chart.width * (i / 5);
      canvas.drawLine(Offset(x, chart.top), Offset(x, chart.bottom), gridPaint);
    }

    final bars = [0.36, 0.52, 0.42, 0.68, 0.58];
    final barWidth = chart.width / 18;
    for (var i = 0; i < bars.length; i++) {
      final x = chart.left + chart.width * (0.12 + i * 0.16);
      final h = chart.height * bars[i];
      canvas.drawRRect(
        RRect.fromRectAndRadius(
          Rect.fromLTWH(x, chart.bottom - h, barWidth, h),
          const Radius.circular(3),
        ),
        revenuePaint,
      );
    }

    final path = Path()
      ..moveTo(chart.left, chart.bottom - chart.height * 0.24)
      ..cubicTo(
        chart.left + chart.width * 0.16,
        chart.bottom - chart.height * 0.48,
        chart.left + chart.width * 0.28,
        chart.bottom - chart.height * 0.18,
        chart.left + chart.width * 0.42,
        chart.bottom - chart.height * 0.56,
      )
      ..cubicTo(
        chart.left + chart.width * 0.56,
        chart.top + chart.height * 0.2,
        chart.left + chart.width * 0.72,
        chart.bottom - chart.height * 0.72,
        chart.right,
        chart.top + chart.height * 0.18,
      );
    canvas.drawPath(path, linePaint);

    for (final point in [
      Offset(
          chart.left + chart.width * 0.42, chart.bottom - chart.height * 0.56),
      Offset(
          chart.left + chart.width * 0.72, chart.bottom - chart.height * 0.72),
      Offset(chart.right, chart.top + chart.height * 0.18),
    ]) {
      canvas.drawCircle(point, 4.5, accentPaint);
      canvas.drawCircle(point, 7, linePaint..strokeWidth = 1.4);
    }

    _drawText(
      canvas,
      label,
      Offset(size.width * 0.1, size.height * 0.1),
      AppTheme.textPrimary,
      13,
      FontWeight.w700,
      maxWidth: size.width * 0.8,
    );
    _drawText(
      canvas,
      'Python • Pandas • Plotly',
      Offset(size.width * 0.1, size.height * 0.78),
      AppTheme.textSecondary,
      11,
      FontWeight.w500,
      maxWidth: size.width * 0.8,
    );
  }

  void _drawText(
    Canvas canvas,
    String text,
    Offset offset,
    Color color,
    double fontSize,
    FontWeight fontWeight, {
    required double maxWidth,
  }) {
    final painter = TextPainter(
      text: TextSpan(
        text: text,
        style: TextStyle(
          color: color,
          fontSize: fontSize,
          fontWeight: fontWeight,
        ),
      ),
      maxLines: 1,
      textDirection: TextDirection.ltr,
    )..layout(maxWidth: maxWidth);
    painter.paint(canvas, offset);
  }

  @override
  bool shouldRepaint(covariant _StockDashboardPlaceholderPainter oldDelegate) {
    return oldDelegate.label != label;
  }
}
