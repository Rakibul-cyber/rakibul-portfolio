import 'package:flutter/material.dart';

/// Global responsive layout system.
///
/// One import gives you breakpoint-aware widgets and helpers so no screen ever
/// hardcodes breakpoint logic, paddings, or grid counts again.
///
/// Usage:
///   - Wrap a section body in [ResponsivePadding] for consistent horizontal gutters.
///   - Use [Responsive] for major layout switches (Row on desktop, Column on mobile).
///   - Use [ResponsiveLayout.value] / `.fontSize` / `.columns` for inline values.
///   - Use [ResponsiveText] for text that auto-scales across breakpoints.
///   - Use [ResponsiveGrid] for grids whose column count follows the breakpoints.
class ResponsiveBreakpoints {
  ResponsiveBreakpoints._();

  static const double mobile = 600;
  static const double tablet = 1024;
}

/// Builds a different widget per breakpoint based on [MediaQuery] width.
///
/// If [tablet] is not provided it falls back to [mobile].
class Responsive extends StatelessWidget {
  final WidgetBuilder mobile;
  final WidgetBuilder? tablet;
  final WidgetBuilder desktop;

  const Responsive({
    super.key,
    required this.mobile,
    this.tablet,
    required this.desktop,
  });

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    if (width >= ResponsiveBreakpoints.tablet) {
      return desktop(context);
    } else if (width >= ResponsiveBreakpoints.mobile) {
      return (tablet ?? mobile)(context);
    } else {
      return mobile(context);
    }
  }
}

/// Static helpers for breakpoint checks and per-breakpoint values.
class ResponsiveLayout {
  ResponsiveLayout._();

  static double _width(BuildContext context) =>
      MediaQuery.sizeOf(context).width;

  static bool isMobile(BuildContext context) =>
      _width(context) < ResponsiveBreakpoints.mobile;

  static bool isTablet(BuildContext context) {
    final w = _width(context);
    return w >= ResponsiveBreakpoints.mobile &&
        w < ResponsiveBreakpoints.tablet;
  }

  static bool isDesktop(BuildContext context) =>
      _width(context) >= ResponsiveBreakpoints.tablet;

  /// Section horizontal/vertical gutter: 24 mobile, 48 tablet, 80 desktop.
  static EdgeInsets padding(BuildContext context) {
    return EdgeInsets.symmetric(
      horizontal: value<double>(
        context,
        mobile: 24,
        tablet: 48,
        desktop: 80,
      ),
    );
  }

  static double fontSize(
    BuildContext context, {
    required double mobile,
    double? tablet,
    required double desktop,
  }) {
    return value<double>(
      context,
      mobile: mobile,
      tablet: tablet,
      desktop: desktop,
    );
  }

  static int columns(
    BuildContext context, {
    required int mobile,
    int? tablet,
    required int desktop,
  }) {
    return value<int>(
      context,
      mobile: mobile,
      tablet: tablet,
      desktop: desktop,
    );
  }

  /// Generic per-breakpoint value picker. [tablet] falls back to [mobile].
  static T value<T>(
    BuildContext context, {
    required T mobile,
    T? tablet,
    required T desktop,
  }) {
    if (isDesktop(context)) return desktop;
    if (isTablet(context)) return tablet ?? mobile;
    return mobile;
  }
}

/// A [Text] that auto-scales its font size across breakpoints.
class ResponsiveText extends StatelessWidget {
  final String data;
  final double mobileSize;
  final double? tabletSize;
  final double desktopSize;
  final TextStyle? style;
  final TextAlign? textAlign;
  final int? maxLines;
  final TextOverflow? overflow;

  const ResponsiveText(
    this.data, {
    super.key,
    required this.mobileSize,
    this.tabletSize,
    required this.desktopSize,
    this.style,
    this.textAlign,
    this.maxLines,
    this.overflow,
  });

  @override
  Widget build(BuildContext context) {
    final size = ResponsiveLayout.fontSize(
      context,
      mobile: mobileSize,
      tablet: tabletSize,
      desktop: desktopSize,
    );
    return Text(
      data,
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: overflow,
      style: (style ?? const TextStyle()).copyWith(fontSize: size),
    );
  }
}

/// A [GridView.builder] whose `crossAxisCount` follows the breakpoints.
class ResponsiveGrid extends StatelessWidget {
  final int itemCount;
  final IndexedWidgetBuilder itemBuilder;
  final int mobileColumns;
  final int? tabletColumns;
  final int desktopColumns;
  final double crossAxisSpacing;
  final double mainAxisSpacing;
  final double childAspectRatio;
  final bool shrinkWrap;
  final ScrollPhysics? physics;
  final EdgeInsetsGeometry? padding;

  const ResponsiveGrid({
    super.key,
    required this.itemCount,
    required this.itemBuilder,
    required this.mobileColumns,
    this.tabletColumns,
    required this.desktopColumns,
    this.crossAxisSpacing = 24,
    this.mainAxisSpacing = 24,
    this.childAspectRatio = 1.4,
    this.shrinkWrap = true,
    this.physics = const NeverScrollableScrollPhysics(),
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    final crossAxisCount = ResponsiveLayout.columns(
      context,
      mobile: mobileColumns,
      tablet: tabletColumns,
      desktop: desktopColumns,
    );
    return GridView.builder(
      shrinkWrap: shrinkWrap,
      physics: physics,
      padding: padding,
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: crossAxisCount,
        crossAxisSpacing: crossAxisSpacing,
        mainAxisSpacing: mainAxisSpacing,
        childAspectRatio: childAspectRatio,
      ),
      itemCount: itemCount,
      itemBuilder: itemBuilder,
    );
  }
}

/// Applies [ResponsiveLayout.padding] as horizontal padding to [child].
///
/// Pass [vertical] to add a (non-responsive) vertical gutter as well — this
/// keeps section vertical rhythm intact while the horizontal gutter adapts.
class ResponsivePadding extends StatelessWidget {
  final Widget child;
  final double vertical;

  const ResponsivePadding({
    super.key,
    required this.child,
    this.vertical = 0,
  });

  @override
  Widget build(BuildContext context) {
    final horizontal = ResponsiveLayout.padding(context);
    return Padding(
      padding: horizontal.add(
        EdgeInsets.symmetric(vertical: vertical),
      ),
      child: child,
    );
  }
}
