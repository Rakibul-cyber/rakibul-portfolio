import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../theme/app_theme.dart';
import '../models/portfolio_data.dart';
import '../utils/responsive.dart';
import '../widgets/common_widgets.dart';

class ProjectsSection extends StatelessWidget {
  const ProjectsSection({super.key});

  @override
  Widget build(BuildContext context) {
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
            const SizedBox(height: 64),

            // Featured project (first)
            _FeaturedProjectCard(project: PortfolioData.projects[0])
                .animate()
                .fadeIn(delay: 200.ms)
                .slideY(begin: 0.1, end: 0),

            const SizedBox(height: 28),

            // Grid of remaining projects
            const _ProjectCardGrid(),
          ],
        ),
      ),
    );
  }
}

class _ProjectCardGrid extends StatelessWidget {
  const _ProjectCardGrid();

  @override
  Widget build(BuildContext context) {
    const spacing = 24.0;
    final projects = PortfolioData.projects.skip(1).toList();

    return LayoutBuilder(
      builder: (context, constraints) {
        final columns = ResponsiveLayout.isDesktop(context) ? 2 : 1;
        final cardWidth =
            (constraints.maxWidth - (spacing * (columns - 1))) / columns;

        return Wrap(
          spacing: spacing,
          runSpacing: spacing,
          children: List.generate(projects.length, (index) {
            return SizedBox(
              width: cardWidth,
              child: _ProjectCard(
                project: projects[index],
              ).animate().fadeIn(delay: (300 + index * 100).ms),
            );
          }),
        );
      },
    );
  }
}

class _FeaturedProjectCard extends StatefulWidget {
  final Project project;
  const _FeaturedProjectCard({required this.project});

  @override
  State<_FeaturedProjectCard> createState() => _FeaturedProjectCardState();
}

class _FeaturedProjectCardState extends State<_FeaturedProjectCard> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final hoverEnabled = kIsWeb && ResponsiveLayout.isDesktop(context);

    return MouseRegion(
      onEnter: hoverEnabled ? (_) => setState(() => _hovered = true) : null,
      onExit: hoverEnabled ? (_) => setState(() => _hovered = false) : null,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        padding: const EdgeInsets.all(40),
        decoration: BoxDecoration(
          color: _hovered ? AppTheme.bgCardHover : AppTheme.bgCard,
          border: Border.all(
            color: _hovered
                ? AppTheme.cyan.withValues(alpha: 0.4)
                : AppTheme.divider,
          ),
          borderRadius: BorderRadius.circular(12),
          boxShadow: _hovered
              ? [
                  BoxShadow(
                      color: AppTheme.cyan.withValues(alpha: 0.06),
                      blurRadius: 40)
                ]
              : [],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Icon
            Container(
              width: 72,
              height: 72,
              decoration: BoxDecoration(
                color: AppTheme.cyan.withValues(alpha: 0.08),
                border: Border.all(color: AppTheme.cyan.withValues(alpha: 0.2)),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Center(
                child: Text(widget.project.icon,
                    style: const TextStyle(fontSize: 32)),
              ),
            ),
            const SizedBox(width: 32),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.amber.withValues(alpha: 0.1),
                          border: Border.all(
                              color: AppTheme.amber.withValues(alpha: 0.3)),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          'FEATURED',
                          style: GoogleFonts.spaceGrotesk(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.amber,
                            letterSpacing: 1.5,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      StatusBadge(status: widget.project.status),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Text(widget.project.title,
                      style: Theme.of(context).textTheme.headlineMedium),
                  const SizedBox(height: 6),
                  Text(widget.project.subtitle,
                      style:
                          const TextStyle(color: AppTheme.cyan, fontSize: 14)),
                  const SizedBox(height: 16),
                  Text(widget.project.description,
                      style: Theme.of(context).textTheme.bodyLarge),
                  const SizedBox(height: 20),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: widget.project.tags
                        .map((t) => TagChip(label: t))
                        .toList(),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
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
    final hasImages = widget.project.coverImagePath != null ||
        widget.project.galleryImagePaths.isNotEmpty;
    final hoverEnabled = kIsWeb && ResponsiveLayout.isDesktop(context);

    return MouseRegion(
      cursor: hoverEnabled ? SystemMouseCursors.click : MouseCursor.defer,
      onEnter: hoverEnabled ? (_) => setState(() => _hovered = true) : null,
      onExit: hoverEnabled ? (_) => setState(() => _hovered = false) : null,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: EdgeInsets.all(hasImages ? 22 : 28),
        decoration: BoxDecoration(
          color: _hovered ? AppTheme.bgCardHover : AppTheme.bgCard,
          border: Border.all(
            color: _hovered
                ? AppTheme.cyan.withValues(alpha: 0.35)
                : AppTheme.divider,
          ),
          borderRadius: BorderRadius.circular(12),
          boxShadow: _hovered
              ? [
                  BoxShadow(
                      color: AppTheme.cyan.withValues(alpha: 0.05),
                      blurRadius: 24)
                ]
              : [],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (widget.project.coverImagePath != null) ...[
              _ProjectCoverImage(imagePath: widget.project.coverImagePath!),
              const SizedBox(height: 20),
            ],
            Row(
              children: [
                Text(widget.project.icon, style: const TextStyle(fontSize: 24)),
                const Spacer(),
                StatusBadge(status: widget.project.status),
              ],
            ),
            const SizedBox(height: 16),
            Text(widget.project.title,
                style: Theme.of(context).textTheme.titleLarge,
                maxLines: 2,
                overflow: TextOverflow.ellipsis),
            const SizedBox(height: 4),
            Text(widget.project.subtitle,
                style: const TextStyle(color: AppTheme.cyan, fontSize: 12)),
            const SizedBox(height: 10),
            Text(
              widget.project.description,
              style: Theme.of(context).textTheme.bodyMedium,
              maxLines: hasImages ? 6 : 3,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: (hasImages
                      ? widget.project.tags
                      : widget.project.tags.take(4))
                  .map((t) => TagChip(label: t))
                  .toList(),
            ),
            if (widget.project.galleryImagePaths.isNotEmpty) ...[
              const SizedBox(height: 20),
              _ProjectImageGallery(
                imagePaths: widget.project.galleryImagePaths,
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _ProjectCoverImage extends StatelessWidget {
  final String imagePath;

  const _ProjectCoverImage({required this.imagePath});

  @override
  Widget build(BuildContext context) {
    return _ProjectImageFrame(
      borderRadius: 10,
      child: AspectRatio(
        aspectRatio: ResponsiveLayout.isMobile(context) ? 1.25 : 1.7,
        child: _ProjectImage(
          imagePath: imagePath,
          fit: BoxFit.cover,
          alignment: Alignment.topCenter,
        ),
      ),
    );
  }
}

class _ProjectImageGallery extends StatelessWidget {
  final List<String> imagePaths;

  const _ProjectImageGallery({required this.imagePaths});

  @override
  Widget build(BuildContext context) {
    final columns = ResponsiveLayout.value<int>(
      context,
      mobile: 2,
      tablet: 3,
      desktop: 3,
    );

    return LayoutBuilder(
      builder: (context, constraints) {
        const spacing = 10.0;
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
                    borderRadius: 8,
                    child: AspectRatio(
                      aspectRatio: 0.62,
                      child: _ProjectImage(
                        imagePath: path,
                        fit: BoxFit.cover,
                        alignment: Alignment.topCenter,
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
      decoration: BoxDecoration(
        color: AppTheme.bgDeep,
        border: Border.all(color: AppTheme.divider),
        borderRadius: BorderRadius.circular(borderRadius),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.24),
            blurRadius: 18,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(borderRadius - 1),
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
      errorBuilder: (context, error, stackTrace) {
        return const _ProjectImagePlaceholder();
      },
    );
  }
}

class _ProjectImagePlaceholder extends StatelessWidget {
  const _ProjectImagePlaceholder();

  @override
  Widget build(BuildContext context) {
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
