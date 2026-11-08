/**
 * Single source of truth for all site content.
 *
 * Rules (see docs/CONTENT_MIGRATION_MAP.md):
 * - Nothing here is invented. Sources: the legacy Flutter site (tag
 *   `legacy-flutter-source`), CV_MD_Rakibul_Hassan.pdf, and public repositories
 *   that were opened and read. Unknown fields are omitted, never guessed.
 * - Fields marked "legacy, verbatim" are copied unchanged from
 *   tests/legacy-inventory.json; the preservation test enforces it.
 *   Straight quotes in them are turned into typographic quotes at render time.
 * - Every statistic carries a `source`.
 */
import type { IconName } from '../lib/icons';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Link {
  label: string;
  href: string;
}

export interface Stat {
  value: string;
  label: string;
  /** Where the number comes from. Required: unverifiable figures are not allowed. */
  source: string;
}

export interface Profile {
  name: string;
  firstName: string;
  role: string;
  roles: readonly [string, string];
  headline: { lead: string; highlight: string };
  intro: string;
  status: string;
  location: string;
  email: string;
  phone: string;
  /** E.164 form for tel: links. */
  phoneHref: string;
  github: string;
  linkedin: string;
  /** Path under public/ (served from the site base). */
  cv: string;
  monogram: string;
  /**
   * Optional portrait. None exists yet; when added, import it with astro:assets
   * here (see README "Add a profile photo"). Absent → monogram fallback.
   */
  photo?: { src: ImageMetadata; alt: string };
}

export type ProjectCategory = 'ai-ml' | 'data' | 'mobile' | 'backend-cloud';

export interface CategoryFilter {
  id: ProjectCategory | 'all';
  label: string;
}

export interface ArchitectureStep {
  label: string;
  detail?: string;
}

export interface MetricRow {
  metric: string;
  loso: string;
  heldOut: string;
}

export interface CaseStudy {
  kicker: string;
  problem: string;
  role: string;
  architecture: ArchitectureStep[];
  stack: string[];
  challenges: { title: string; body: string }[];
  approach: string[];
  model: string[];
  evaluation: {
    caption: string;
    rows: MetricRow[];
    notes: string[];
    source: string;
  };
  testing: string[];
  outcome: string[];
  limitations: string[];
  links: Link[];
}

export interface Highlight {
  /** Domain pill on the card. */
  domain: string;
  summary: string;
  /** "How it was built" disclosure: only fields with real information. */
  details: { label: string; body: string | string[] }[];
}

export interface Project {
  /** Anchor id (`#project-<id>`), also used by "Shown in" links. */
  id: string;
  /** Legacy, verbatim (except the new Driver Stress project). */
  title: string;
  /** Short name for "Shown in" links and compact lists. */
  shortTitle: string;
  subtitle: string;
  description: string;
  tags: string[];
  status: string;
  githubUrl?: string;
  liveUrl?: string;
  /** Legacy emoji icon, kept for completeness; not rendered. */
  legacyIcon?: string;
  /** Image paths under public/ (kept deployed, deliberately not rendered). */
  coverImagePath?: string;
  galleryImagePaths: string[];
  categories: ProjectCategory[];
  /**
   * Hide from the rendered site without deleting the entry (index, filters, counts,
   * "Shown in" links all skip it). Re-enable by removing the flag.
   */
  hidden?: boolean;
  /** true for projects that existed on the legacy site. */
  legacy: boolean;
  caseStudy?: CaseStudy;
  highlight?: Highlight;
}

export interface LinkChange {
  projectId: string;
  field: 'githubUrl';
  from: string;
  to: string;
  reason: string;
  status: 'awaiting-approval' | 'approved';
}

export interface Expertise {
  icon: IconName;
  kicker: string;
  title: string;
  summary: string;
  points: string[];
  /** Project ids that prove this card. */
  shownIn: string[];
}

export interface Skill {
  /** Legacy, verbatim. */
  name: string;
  category: string;
  /** Self-assessed 1–5 level from the legacy site; kept in data, not rendered. */
  level: number;
}

export interface WorkflowStage {
  id: string;
  icon: IconName;
  title: string;
  summary: string;
  /** What this stage looked like in the Driver Stress project (verifiable in its repo). */
  example: string;
}

export interface TerminalLine {
  kind: 'cmd' | 'out' | 'ok' | 'dim' | 'note';
  text: string;
}

export interface ExperienceEntry {
  period: string;
  role: string;
  org: string;
  location: string;
  points: string[];
  /** Where the bullet points come from. */
  source: string;
}

export interface Education {
  period: string;
  degree: string;
  school: string;
  note?: string;
}

export interface Publication {
  title: string;
  year?: string;
  /** Publication status as confirmed by the owner, e.g. 'under review'. */
  status?: string;
  /** Link to the published article. */
  url?: string;
  note?: string;
}

export interface Article {
  /** Legacy, verbatim. */
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  /** Only `published` articles with a full body are rendered (brief §6.8). */
  status: 'draft' | 'published';
  url?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export const profile: Profile = {
  name: 'Md Rakibul Hassan',
  firstName: 'Rakibul',
  role: 'AI/ML Engineer | AI-Powered Software Developer',
  roles: ['AI/ML Engineer', 'AI-Powered Software Developer'],
  headline: {
    lead: 'Building intelligent software,',
    highlight: 'from machine learning models to real-world applications.',
  },
  intro:
    'I’m Md Rakibul Hassan, a software engineer focused on machine learning, intelligent applications and scalable software systems. I combine AI/ML, backend engineering and mobile application architecture to build practical, reliable software.',
  status: 'Open to AI/ML and software engineering roles',
  location: 'Frankfurt am Main, Germany',
  email: 'hassanrakibul029@gmail.com',
  phone: '+49 1521 4837797',
  phoneHref: '+4915214837797',
  github: 'https://github.com/Rakibul-cyber',
  // Legacy value. The CV lists /in/rakibul-hassan-33a2771b2/; owner decision pending.
  linkedin: 'https://www.linkedin.com/in/rakibulhassan-dev/',
  cv: 'CV_MD_Rakibul_Hassan.pdf',
  monogram: 'RH',
};

export const nav: NavItem[] = [
  { label: 'Expertise', href: '#expertise' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Experience', href: '#experience' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

/** Floating chips around the hero monogram: each names a verified skill. */
export const heroChips: { icon: IconName; label: string }[] = [
  { icon: 'chip', label: 'Python · scikit-learn' },
  { icon: 'plug', label: 'FastAPI inference' },
  { icon: 'shield', label: 'Leakage-aware evaluation' },
  { icon: 'docker', label: 'Docker + CI/CD' },
  { icon: 'device', label: 'Flutter in production' },
  { icon: 'server', label: 'AWS' },
];

// ---------------------------------------------------------------------------
// Projects (display order: brief §7)
// ---------------------------------------------------------------------------

const DRIVER_REPO = 'https://github.com/Rakibul-cyber/driver-stress-monitoring';

export const projects: Project[] = [
  {
    id: 'driver-stress',
    shortTitle: 'Driver Stress',
    title: 'Real-Time Driver Stress & Cognitive Load Monitoring',
    subtitle: 'Machine learning · Inference API · MLOps',
    description:
      'An end-to-end machine learning MVP that classifies physiological stress vs. no stress from heart-rate-variability features (WESAD), evaluated on people the model never saw, served through a FastAPI service and a Streamlit dashboard that replays held-out recordings, with Docker and CI.',
    tags: [
      'Python',
      'scikit-learn',
      'pandas',
      'FastAPI',
      'Streamlit',
      'pytest',
      'Docker',
      'GitHub Actions',
    ],
    status: 'MVP',
    githubUrl: DRIVER_REPO,
    galleryImagePaths: [],
    categories: ['ai-ml', 'backend-cloud'],
    legacy: false,
    caseStudy: {
      kicker: 'Flagship case study',
      problem:
        'Can a model tell physiological stress from no stress using heart-rate-variability (HRV) features, for people it was never trained on? Driver monitoring is the target application. The labelled data available, WESAD, was recorded in a lab, so the project has to be honest about what it does and doesn’t show.',
      role: 'Personal project, built end to end: data pipeline, feature selection, evaluation design, model, inference API, dashboard, tests, Docker setup and CI.',
      architecture: [
        { label: 'WESAD HRV CSV', detail: 'downloaded by script, never committed' },
        { label: 'preprocessing.py', detail: 'schema check · dedup · labels' },
        { label: 'train.py', detail: 'LOSO CV · held-out test' },
        { label: 'joblib + metadata', detail: 'one pipeline artefact' },
        { label: 'FastAPI', detail: '/health · /model-info · /predict' },
        { label: 'Streamlit', detail: 'replays held-out subjects' },
      ],
      stack: [
        'Python',
        'pandas',
        'NumPy',
        'scikit-learn',
        'joblib',
        'FastAPI',
        'Pydantic',
        'Uvicorn',
        'Streamlit',
        'pytest',
        'Docker',
        'Docker Compose',
        'GitHub Actions',
      ],
      challenges: [
        {
          title: 'Label leakage hiding in the columns',
          body: '`Time` encodes the order of the lab protocol, and `SSSQ` is a self-reported stress score. Either would leak the answer, so both are excluded, along with monotonic transforms and two duplicate columns: 30 base HRV features remain.',
        },
        {
          title: 'Duplicated data',
          body: 'One subject’s recording appears twice in the source CSV. Removing exact duplicates takes the data from 196,978 to 184,276 rows across 15 subjects.',
        },
        {
          title: 'Heavily overlapping windows',
          body: 'HRV windows are emitted every 0.25 s. Training rows are subsampled to 1 Hz to reduce redundancy; the test set is scored on all 35,707 held-out windows.',
        },
        {
          title: 'People differ more than conditions do',
          body: 'A random row split would put the same person in training and test and inflate every metric. Evaluation is therefore subject-independent throughout.',
        },
      ],
      approach: [
        'Subjects 15, 16 and 17 are held out entirely: they are the final test set and the dashboard’s replay data.',
        'Leave-one-subject-out (LOSO) cross-validation runs on the remaining 12 subjects.',
        'The final model is trained on all 12 training subjects and scored once on the held-out 3.',
      ],
      model: [
        'scikit-learn Pipeline: median SimpleImputer → RandomForestClassifier (200 trees, max_depth 20, min_samples_leaf 5, class_weight “balanced”, fixed seed).',
        'Saved as one joblib artefact, so training and inference always share preprocessing.',
        'Binary target: stress = 1; baseline, amusement and meditation = 0 (22% stress). Decision threshold 0.5.',
        'Most important features: MEAN_RR, HR and MEDIAN_RR.',
      ],
      evaluation: {
        caption:
          'Subject-independent results. LOSO: mean ± standard deviation across 12 training subjects. Held-out: subjects 15–17, 35,707 windows.',
        rows: [
          { metric: 'ROC-AUC', loso: '0.897 ± 0.114', heldOut: '0.940' },
          { metric: 'Accuracy', loso: '0.830 ± 0.153', heldOut: '0.881' },
          { metric: 'Macro F1', loso: '0.745 ± 0.177', heldOut: '0.839' },
          { metric: 'F1 (stress)', loso: '0.622 ± 0.248', heldOut: '0.757' },
          { metric: 'Precision (stress)', loso: '0.690 ± 0.310', heldOut: '0.745' },
          { metric: 'Recall (stress)', loso: '0.655 ± 0.297', heldOut: '0.769' },
        ],
        notes: [
          'Read the LOSO column as the realistic estimate: the held-out score comes from just three people.',
          'Performance varies widely between people. Per-subject F1 ranges from 0.94 (subject 7) to 0.00 (subject 5, where no stress window was detected).',
        ],
        source:
          'models/model_metadata.json and reports/train_log.txt in the repository (macOS run; CI on Linux reproduces within about 0.005).',
      },
      testing: [
        'pytest suite covering the raw-data schema, subject-independent hold-out, input validation, model output, the replay generator and every API endpoint.',
        'The API returns HTTP 422 naming the problem fields for missing, unknown, non-numeric or NaN/inf input, and 503 if the model file is missing.',
        'Docker image for the API; Docker Compose runs the API and the dashboard from the same image.',
        'GitHub Actions on every push and pull request: install → download data (cached) → train → pytest → Docker build → smoke test of the running API container.',
      ],
      outcome: [
        'A reproducible MVP: one command trains and evaluates, the API and dashboard run in Docker, and CI passes on main.',
        'Single-window inference takes roughly 5–10 ms in-process on an Apple-silicon Mac (measured by the replay CLI).',
      ],
      limitations: [
        'Lab data, not driving data: WESAD stress was induced by public speaking and mental arithmetic while seated.',
        '“Cognitive load” is not modelled. The only labels are stress, baseline, amusement and meditation.',
        'The dashboard replays recorded data; it is not connected to live vehicle sensors.',
        'Small cohort: 15 subjects (12 for training, 3 for testing), and some people’s stress is not detected at all.',
        'No per-driver calibration yet. Normalising features against each person’s baseline is the most promising next step.',
        'The model consumes pre-computed HRV features; a live system would also need a signal-to-feature stage.',
        'Research prototype, not a medical or safety-certified system.',
      ],
      links: [
        { label: 'Repository', href: DRIVER_REPO },
        { label: 'CI workflow', href: `${DRIVER_REPO}/actions/workflows/ci.yml` },
      ],
    },
  },
  {
    id: 'forest-ai',
    shortTitle: 'Forest AI',
    title: 'Forest Tracking & Environmental Safety System',
    subtitle: 'Production · Full-Stack + Cloud',
    description:
      'A scalable real-time environmental monitoring mobile application deployed on AWS. Integrates GPS, satellite data streams, and AI/ML pipelines to map live forest conditions and detect environmental anomalies.',
    tags: ['Flutter', 'AWS EC2', 'PostgreSQL', 'Python', 'AI/ML', 'GPS/Satellite'],
    status: 'Live',
    legacyIcon: '🌲',
    coverImagePath: 'projects/forest_ai/forest-map.png',
    galleryImagePaths: [
      'projects/forest_ai/environment-cover.png',
      'projects/forest_ai/risk-analysis.png',
      'projects/forest_ai/weather.png',
      'projects/forest_ai/observation.png',
      'projects/forest_ai/team-chat.png',
      'projects/forest_ai/profile.png',
    ],
    categories: ['ai-ml', 'mobile', 'backend-cloud'],
    legacy: true,
    highlight: {
      domain: 'Environmental monitoring · JGU Mainz',
      summary:
        'A real-time environmental monitoring app that brings GPS, satellite data and AI services together on AWS, built during my HiWi role at Johannes Gutenberg University Mainz.',
      details: [
        {
          label: 'Problem',
          body: 'Monitoring live forest conditions and detecting environmental anomalies, using climate and environmental data.',
        },
        {
          label: 'My role',
          body: 'Mobile Application Developer (HiWi) at Johannes Gutenberg University Mainz: the Flutter front end and AWS services for scalable data management.',
        },
        {
          label: 'Approach',
          body: [
            'Integrated APIs, AI, GPS and satellite data for real-time forest condition analysis.',
            'Used AWS for hosting, storage and processing of environmental data.',
          ],
        },
        { label: 'Outcome', body: 'Deployed on AWS and in use as a live application.' },
      ],
    },
  },
  {
    id: 'stock-dashboard',
    shortTitle: 'Stock Dashboard',
    title: 'Analyzing Historical Stock & Revenue Data and Building a Dashboard',
    subtitle: 'Stock Revenue Dashboard',
    description:
      'A data analysis and dashboard project focused on retrieving, cleaning, processing, and visualizing historical stock price and revenue data. The project presents market trends and revenue insights through an interactive dashboard for investors, analysts, and data enthusiasts.',
    tags: [
      'Python',
      'Pandas',
      'NumPy',
      'Matplotlib',
      'Plotly',
      'Dash',
      'Streamlit',
      'Jupyter Notebook',
      'Data Analysis',
      'Data Visualization',
    ],
    status: 'Project',
    githubUrl:
      'https://github.com/Rakibul-cyber/Analyzing-Historical-Stock-Revenue-Data-and-Building-a-Dashboard',
    legacyIcon: '📈',
    // These six images were referenced by the legacy site but never existed in the repository.
    coverImagePath: 'projects/stock-dashboard/stock-dashboard-cover.png',
    galleryImagePaths: [
      'projects/stock-dashboard/stock-dashboard-data.png',
      'projects/stock-dashboard/stock-dashboard-visualization.png',
      'projects/stock-dashboard/stock-dashboard-revenue.png',
      'projects/stock-dashboard/stock-dashboard-analysis.png',
      'projects/stock-dashboard/stock-dashboard-dashboard.png',
    ],
    categories: ['data'],
    legacy: true,
    highlight: {
      domain: 'Data analysis · Python',
      summary:
        'Retrieving, cleaning and visualising historical stock price and revenue data, presented through an interactive dashboard.',
      details: [
        {
          label: 'What it does',
          body: [
            'Retrieves, cleans and processes historical stock price and revenue data.',
            'Presents market trends and revenue insights through an interactive dashboard for investors, analysts and data enthusiasts.',
          ],
        },
        {
          label: 'Tech stack',
          body: 'Python, Pandas, NumPy, Matplotlib, Plotly, Dash, Streamlit and Jupyter Notebook.',
        },
      ],
    },
  },
  {
    id: 'lead-intelligence',
    shortTitle: 'Lead Intelligence',
    title: 'Smart Infrastructure Lead Intelligence',
    subtitle: 'Python pipeline · Rule-based lead scoring',
    // Facts from the repository's README, src/lead_intelligence/scorer.py, tests/ and .github/workflows/ci.yml.
    description:
      'A Python pipeline that crawls public organisation websites (Requests and Beautiful Soup, with an optional Playwright fallback for JavaScript-rendered pages), detects keyword-based signals such as street lighting, procurement and smart-city activity, and scores each lead from 0 to 100 with explicit weights and Low/Medium/High priority. Results go to Excel reports with evidence excerpts. The scoring is rule-based, not machine learning.',
    tags: [
      'Python',
      'Requests',
      'Beautiful Soup',
      'Playwright',
      'openpyxl',
      'pytest',
      'Docker',
      'GitHub Actions',
    ],
    status: 'Project',
    githubUrl: 'https://github.com/Rakibul-cyber/smart-infrastructure-lead-intelligence',
    galleryImagePaths: [],
    categories: ['backend-cloud'],
    legacy: false,
    // Hidden 2026-11-08 until the owner confirms with Enviotech GmbH that this public
    // repository may be shown: the resume's Enviotech role describes a similar system.
    hidden: true,
  },
  {
    id: 'louco',
    shortTitle: 'Louco',
    title: 'Louco Mobile App',
    subtitle: 'Production · Flutter Mobile',
    description:
      'Production-level event discovery mobile application for Germany, built with Flutter. I implemented features across authentication, onboarding, discovery, favorites, notifications, and profile flows; integrated REST APIs with GetX; improved guest mode, city-based discovery, event details, responsive mobile/tablet layouts, and Android/iOS release readiness.',
    tags: [
      'Flutter',
      'Dart',
      'GetX',
      'Firebase',
      'REST API',
      'Push Notifications',
      'Google Auth',
      'Apple Auth',
      'Android',
      'iOS',
      'TestFlight',
      'Play Console',
    ],
    status: 'Production',
    legacyIcon: '🎪',
    coverImagePath: 'projects/louco/louco-cover.png',
    galleryImagePaths: [
      'projects/louco/louco-auth.png',
      'projects/louco/louco-event-details.png',
      'projects/louco/louco-favorites.png',
      'projects/louco/louco-notifications.png',
      'projects/louco/louco-responsive.png',
      'projects/louco/louco-cityvibe.png',
    ],
    categories: ['mobile'],
    legacy: true,
    highlight: {
      domain: 'Event discovery · Louco Event Media GmbH',
      summary:
        'A production event discovery app for Germany. As a software developer at Louco Event Media GmbH (March–June 2026) I worked across the app and its Android and iOS releases.',
      details: [
        {
          label: 'Problem',
          body: 'Helping people in Germany discover events by city, with sign-in, favourites and notifications.',
        },
        {
          label: 'My role',
          body: 'Software Developer at Louco Event Media GmbH, Offenbach (March–June 2026).',
        },
        {
          label: 'Architecture',
          body: 'Flutter UI → GetX controllers → REST API layer → Firebase for authentication (Google, Apple) and push notifications.',
        },
        {
          label: 'Features',
          body: [
            'Authentication, onboarding, discovery, favourites, notifications and profile flows.',
            'Guest mode, city-based discovery and event details.',
            'Responsive mobile and tablet layouts.',
          ],
        },
        {
          label: 'Release',
          body: 'Android and iOS release readiness via TestFlight and Play Console.',
        },
      ],
    },
  },
  {
    id: 'steko',
    shortTitle: 'STEKO',
    title: 'STEKO Health Checker',
    subtitle: 'Final Year Project · mHealth',
    description:
      // Corrected from the legacy text, which said "Published research" (see contentCorrections).
      'Mobile health monitoring app tracking vital signs, health trends, and alerts. Research paper (under review): "STEKO-SD: A Mobile Health Solution to Assist Self-Checking of Metabolic Syndrome".',
    tags: ['Flutter', 'Node.js', 'Firebase', 'Health Tech', 'Research'],
    // Corrected from the legacy status "Published" (see contentCorrections).
    status: 'Under review',
    // Changed from the profile URL; approved by the owner on 2026-11-08 (see linkChanges).
    githubUrl: 'https://github.com/Rakibul-cyber/FYP-2-Steko-Health-Checker-Application',
    legacyIcon: '❤️',
    galleryImagePaths: [],
    categories: ['mobile'],
    legacy: true,
  },
  {
    id: 'xr-hub',
    shortTitle: 'XR-Hub',
    title: 'XR-Hub Condominium Management System',
    subtitle: 'Flutter Web & Mobile',
    description:
      'Responsive cross-platform property management dashboard. Includes role-based access control, real-time occupancy analytics, task scheduling for maintenance, and automated billing & payment notifications.',
    tags: ['Flutter Web', 'Flutter Mobile', 'Node.js', 'PostgreSQL', 'Dashboard'],
    status: 'Delivered',
    legacyIcon: '🏢',
    galleryImagePaths: [],
    categories: ['mobile', 'backend-cloud'],
    legacy: true,
  },
  {
    id: 'automotive-hmi',
    shortTitle: 'Automotive HMI',
    title: 'Automotive HMI Dashboard',
    subtitle: 'Android Automotive · Jetpack Compose',
    description:
      'EV Dashboard for Android Automotive OS with real-time WebSocket data (10 Hz integer streams), built with Jetpack Compose. Showcases HMI/cluster UI development skills for automotive grade systems.',
    tags: ['Android Automotive', 'Jetpack Compose', 'WebSocket', 'Kotlin', 'HMI'],
    status: 'Demo',
    githubUrl: 'https://github.com/Rakibul-cyber/automotive-hmi-dashboard',
    legacyIcon: '🚗',
    galleryImagePaths: [],
    categories: ['mobile'],
    legacy: true,
  },
];

export interface ContentCorrection {
  projectId: string;
  field: 'description' | 'status';
  from: string;
  to: string;
  reason: string;
  approvedOn: string;
}

/** Owner-approved factual corrections to verbatim legacy text (enforced by the preservation test). */
export const contentCorrections: ContentCorrection[] = [
  {
    projectId: 'steko',
    field: 'description',
    from: 'Mobile health monitoring app tracking vital signs, health trends, and alerts. Published research: "STEKO-SD: A Mobile Health Solution to Assist Self-Checking of Metabolic Syndrome".',
    to: 'Mobile health monitoring app tracking vital signs, health trends, and alerts. Research paper (under review): "STEKO-SD: A Mobile Health Solution to Assist Self-Checking of Metabolic Syndrome".',
    reason:
      'The STEKO-SD paper is under review, not published (owner confirmation; the CV said "ongoing").',
    approvedOn: '2026-11-08',
  },
  {
    projectId: 'steko',
    field: 'status',
    from: 'Published',
    to: 'Under review',
    reason:
      'Status badge aligned with the publication status confirmed by the owner (under review).',
    approvedOn: '2026-11-08',
  },
];

/** Repository-link changes versus the legacy site. Each is a one-line revert above. */
export const linkChanges: LinkChange[] = [
  {
    projectId: 'steko',
    field: 'githubUrl',
    from: 'https://github.com/Rakibul-cyber',
    to: 'https://github.com/Rakibul-cyber/FYP-2-Steko-Health-Checker-Application',
    reason:
      'The legacy link pointed to the GitHub profile; the project repository exists and matches (Dart final-year project).',
    status: 'approved',
  },
];

export const categoryFilters: CategoryFilter[] = [
  { id: 'all', label: 'All' },
  { id: 'ai-ml', label: 'AI & ML' },
  { id: 'data', label: 'Data' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'backend-cloud', label: 'Backend & cloud' },
];

export const categoryLabels: Record<ProjectCategory, string> = {
  'ai-ml': 'AI & ML',
  data: 'Data',
  mobile: 'Mobile',
  'backend-cloud': 'Backend & cloud',
};

const projectById = (id: string): Project => {
  const p = projects.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown project id: ${id}`);
  return p;
};

/** Projects that are rendered on the site (hidden ones are kept in data only). */
export const visibleProjects = projects.filter((p) => !p.hidden);

export const flagship = projectById('driver-stress');
export const highlightProjects = ['forest-ai', 'louco', 'stock-dashboard'].map(projectById);

// ---------------------------------------------------------------------------
// Stats (verified only, brief §3.3)
// ---------------------------------------------------------------------------

const productionApps = visibleProjects.filter((p) => ['Production', 'Live'].includes(p.status));

export const stats: Stat[] = [
  {
    value: '0.90',
    label: 'Mean ROC-AUC, leave-one-subject-out CV',
    source:
      'driver-stress-monitoring/models/model_metadata.json → cv_loso.summary.roc_auc.mean = 0.897',
  },
  {
    value: String(productionApps.length),
    label: 'Apps in production use',
    source: 'Louco (“Production”) and Forest Tracking (“Live”) status on the legacy site',
  },
  {
    value: String(visibleProjects.length),
    label: 'Projects documented here',
    source: 'Count of projects rendered on this page',
  },
];

/** "Built with" marquee: technologies used in the projects above (no client logos). */
export const stack: string[] = [
  'Python',
  'scikit-learn',
  'pandas',
  'NumPy',
  'FastAPI',
  'Streamlit',
  'pytest',
  'Docker',
  'GitHub Actions',
  'AWS',
  'PostgreSQL',
  'Flutter',
  'Dart',
  'Firebase',
  'Node.js',
  'Django',
  'Kotlin',
  'Jetpack Compose',
  'Jupyter',
  'Plotly',
];

// ---------------------------------------------------------------------------
// Expertise (only items evidenced by a project, legacy skills or the CV)
// ---------------------------------------------------------------------------

export const expertise: Expertise[] = [
  {
    icon: 'chip',
    kicker: 'I build models that hold up on unseen data.',
    title: 'AI & ML engineering',
    summary:
      'Supervised learning on tabular and physiological data, with evaluation designed around how the model will be used, not around the best-looking number.',
    points: [
      'Leakage-aware feature selection',
      'Subject-independent evaluation (leave-one-subject-out)',
      'scikit-learn pipelines exported as one artefact',
    ],
    shownIn: ['driver-stress'],
  },
  {
    icon: 'spark',
    kicker: 'I put models behind real interfaces.',
    title: 'AI-powered software development',
    summary:
      'Turning a trained model or an AI service into something other software and people can use: typed APIs, input validation and a UI that shows what the model is doing.',
    points: [
      'Python inference APIs with FastAPI and Pydantic',
      'Monitoring dashboards that replay real data',
      'Integrating AI, GPS and satellite data into apps',
    ],
    shownIn: ['driver-stress', 'forest-ai'],
  },
  {
    icon: 'device',
    kicker: 'I ship apps people use.',
    title: 'Mobile application architecture',
    summary:
      'Cross-platform Flutter apps in production, with clear layers between UI, state and API, plus native Android work with Jetpack Compose.',
    points: [
      'Flutter with GetX state management and REST API layers',
      'Firebase authentication and push notifications',
      'Android and iOS releases via TestFlight and Play Console',
    ],
    shownIn: ['louco', 'forest-ai', 'xr-hub', 'steko', 'automotive-hmi'],
  },
  {
    icon: 'pipeline',
    kicker: 'I make it reproducible and deployable.',
    title: 'MLOps, backend & DevOps',
    summary:
      'Pipelines that train, test, build and smoke-test on every push, containerised services, and cloud backends on AWS.',
    points: [
      'CI that trains, tests and builds containers (GitHub Actions)',
      'Docker and Docker Compose',
      'AWS EC2, S3 and IAM; PostgreSQL; Node.js and Django backends',
    ],
    shownIn: ['driver-stress', 'forest-ai', 'xr-hub', 'lead-intelligence'],
  },
];

/** All 16 legacy skills (legacy, verbatim). Levels are kept but not rendered. */
export const legacySkills: Skill[] = [
  { name: 'Flutter', category: 'Mobile & Web', level: 5 },
  { name: 'Dart', category: 'Mobile & Web', level: 5 },
  { name: 'Flutter Web', category: 'Mobile & Web', level: 4 },
  { name: 'Android (Compose)', category: 'Mobile & Web', level: 3 },
  { name: 'Python', category: 'Backend', level: 4 },
  { name: 'Django', category: 'Backend', level: 3 },
  { name: 'Node.js', category: 'Backend', level: 3 },
  { name: 'REST APIs', category: 'Backend', level: 5 },
  { name: 'AWS EC2/S3/IAM', category: 'Cloud & DevOps', level: 4 },
  { name: 'Docker', category: 'Cloud & DevOps', level: 3 },
  { name: 'CI/CD Pipelines', category: 'Cloud & DevOps', level: 3 },
  { name: 'Linux / CLI', category: 'Cloud & DevOps', level: 4 },
  { name: 'Git / GitHub', category: 'Cloud & DevOps', level: 5 },
  { name: 'PostgreSQL', category: 'Data', level: 4 },
  { name: 'Firebase', category: 'Data', level: 3 },
  { name: 'MySQL', category: 'Data', level: 3 },
];

/**
 * Further skills listed in the resume (2026-11-06) that are not in the legacy list.
 * Shown in the full toolkit only, never on the expertise cards, because no
 * project on this site evidences them (owner instruction 2026-11-08).
 */
export const resumeSkills: { category: string; names: string[] }[] = [
  { category: 'Languages', names: ['JavaScript', 'SQL', 'C++'] },
  {
    category: 'Machine learning & AI',
    names: ['scikit-learn', 'NLP', 'XGBoost', 'Model evaluation'],
  },
  {
    category: 'Data engineering & automation',
    names: ['pandas', 'NumPy', 'BeautifulSoup', 'Playwright', 'Web scraping', 'Data visualization'],
  },
  { category: 'APIs & cloud', names: ['FastAPI', 'Azure'] },
  { category: 'Tools', names: ['GitLab', 'Postman', 'SSH', 'Jira', 'Trello'] },
];

// ---------------------------------------------------------------------------
// Process: six-stage AI/ML workflow, illustrated with the Driver Stress project
// ---------------------------------------------------------------------------

export const workflow = {
  gate: {
    title: 'Evaluation gate',
    body: 'Back to development until it holds up on unseen data.',
  },
  stages: [
    {
      id: 'define',
      icon: 'target',
      title: 'Define',
      summary:
        'Frame the prediction task, the users of the output and what “good” means before touching a model.',
      example:
        'Binary stress vs. no-stress from HRV features. Precision, recall and F1 are reported for the stress class, and the scope note says plainly that WESAD is lab data, not driving data.',
    },
    {
      id: 'prepare',
      icon: 'database',
      title: 'Prepare',
      summary: 'Validate the schema, clean the data and remove anything that leaks the answer.',
      example:
        'Schema validated on load; 196,978 rows → 184,276 after removing exact duplicates. `Time` (protocol order) and `SSSQ` (self-reported stress) dropped as leakage; 30 base HRV features kept.',
    },
    {
      id: 'develop',
      icon: 'code',
      title: 'Develop',
      summary: 'Build the simplest model that can work, as one reproducible pipeline.',
      example:
        'A scikit-learn Pipeline (median imputer → Random Forest, 200 trees, balanced classes) with a fixed seed, saved as one joblib artefact so training and inference share preprocessing.',
    },
    {
      id: 'evaluate',
      icon: 'gauge',
      title: 'Evaluate',
      summary:
        'Test on people or data the model has never seen, and report the spread, not just the best number.',
      example:
        'Leave-one-subject-out CV on 12 subjects (ROC-AUC 0.897 ± 0.114), then one score on 3 held-out subjects (0.940). Per-subject F1 ranges from 0.94 to 0.00, and that range is published.',
    },
    {
      id: 'integrate',
      icon: 'plug',
      title: 'Integrate',
      summary: 'Put the model behind a contract that other software can rely on.',
      example:
        'FastAPI with /health, /model-info and /predict. Invalid input returns 422 naming the bad fields; a missing model returns 503. A Streamlit dashboard replays held-out recordings through it.',
    },
    {
      id: 'ship',
      icon: 'rocket',
      title: 'Ship',
      summary: 'Automate the path from a commit to a running, tested container.',
      example:
        'GitHub Actions: install → download data (cached) → train → pytest → Docker build → smoke test of the running API container, on every push and pull request.',
    },
  ] satisfies WorkflowStage[],
};

/**
 * Terminal replay. Commands are the steps of driver-stress-monitoring/.github/workflows/ci.yml;
 * output lines are copied from reports/train_log.txt (the absolute local path in the
 * last log line is shortened to the repository-relative one).
 */
export const ciTranscript: {
  title: string;
  status: string;
  lines: TerminalLine[];
  caption: string;
} = {
  title: 'driver-stress-monitoring · ci.yml',
  status: 'passing',
  caption:
    'Commands from the repository’s CI workflow; output from reports/train_log.txt. Latest run on main: success (6 Nov 2026).',
  lines: [
    { kind: 'cmd', text: 'pip install -r requirements.txt' },
    { kind: 'cmd', text: 'python -m src.download_data' },
    { kind: 'cmd', text: 'python -m src.train' },
    { kind: 'out', text: 'Clean dataset: 184276 rows, 15 subjects' },
    {
      kind: 'out',
      text: 'Train: 37147 rows (stride 4), 12 subjects | Test: 35707 rows, subjects [15, 16, 17]',
    },
    { kind: 'dim', text: '  LOSO subject  5: acc=0.794 f1=0.000' },
    { kind: 'dim', text: '  LOSO subject  7: acc=0.977 f1=0.942' },
    { kind: 'dim', text: '  LOSO subject 10: acc=0.364 f1=0.421' },
    { kind: 'out', text: 'LOSO CV (12 training subjects), mean ± std:' },
    { kind: 'ok', text: '  roc_auc    0.897 ± 0.114' },
    { kind: 'out', text: 'Held-out test (subjects [15, 16, 17], 35707 windows):' },
    { kind: 'ok', text: '  roc_auc          0.9396' },
    { kind: 'out', text: 'Saved models/stress_rf.joblib and models/model_metadata.json in 31s' },
    { kind: 'cmd', text: 'pytest -q' },
    { kind: 'cmd', text: 'docker build -t driver-stress-monitoring:ci .' },
    { kind: 'cmd', text: 'curl -sf localhost:8000/health' },
    { kind: 'note', text: 'CI run on main: success' },
  ],
};

export const qualityGates: string[] = [
  'Schema validation on load',
  'Leakage columns excluded',
  'Subject-independent evaluation',
  'pytest: data, model and API',
  'Input validation (HTTP 422)',
  'Docker build in CI',
  'API smoke test on every push',
];

export const quote =
  'Evaluation decides whether a model moves forward. The pipeline decides whether it ships.';

// ---------------------------------------------------------------------------
// Experience and education (real titles; CV bullets)
// ---------------------------------------------------------------------------

export const transitionNote = {
  title: 'From shipping apps to shipping models.',
  body: [
    'My job titles so far are in mobile and software development. I’m not claiming an AI/ML title I haven’t held.',
    'What carries over is the engineering: API contracts, state management, testing and release pipelines. That’s what makes a machine learning system dependable once it leaves the notebook, and it’s how I build ML projects now.',
  ],
};

// Source: Rakibul_Hassan_Resume.pdf (created 2026-11-06), authoritative for experience
// since 2026-11-08. Titles, dates and bullets are taken from it unchanged in substance.
export const experience: ExperienceEntry[] = [
  {
    period: 'July 2026 – present',
    role: 'Software Developer (Working Student)',
    org: 'Enviotech GmbH',
    location: 'Frankfurt am Main, Germany',
    points: [
      'Developing Python-based data extraction and automation pipelines using BeautifulSoup and Playwright to collect and process data from municipal websites and documents.',
      'Transforming unstructured data into structured information through data cleaning, filtering, classification and scoring for an automated lead intelligence and reporting system.',
      'Generating structured Excel reports and data extracts, including priority classifications, supporting evidence and run summaries.',
      'Troubleshooting scraping, data-quality and reporting issues across heterogeneous websites and document formats; translating business requirements into software solutions with the project lead.',
    ],
    source: 'Resume',
  },
  {
    period: 'March 2026 – June 2026',
    role: 'Software Developer',
    org: 'Louco Event Media GmbH',
    location: 'Offenbach, Germany',
    points: [
      'Developed and maintained production software for Android and iOS, integrating REST APIs and backend services for authentication, notifications and personalized user experiences.',
      'Investigated and resolved production issues involving APIs, authentication, notifications and application performance.',
      'Collaborated with backend developers in Agile Scrum to design, test and deliver software, including sprint planning, testing and production releases.',
      'Managed Android and iOS deployments using Google Play Console and TestFlight.',
    ],
    source: 'Resume',
  },
  {
    period: 'September 2025 – February 2026',
    role: 'HiWi – Mobile Application Developer',
    org: 'Johannes Gutenberg University Mainz',
    location: 'Mainz, Germany',
    points: [
      'Developed a cloud-connected research platform supporting environmental monitoring and data collection.',
      'Integrated AWS cloud services, GPS data and external APIs.',
      'Built scalable software for collecting, processing and visualizing environmental information for academic research projects.',
    ],
    source: 'Resume',
  },
  {
    period: 'February 2022 – August 2022',
    role: 'Software Developer',
    org: 'Teczo Sdn. Bhd.',
    location: 'Kuala Lumpur, Malaysia',
    points: [
      'Developed production software applications serving multiple customers, integrating REST APIs and backend services.',
      'Improved software quality and maintainability through modular architecture and optimized application performance.',
      'Collaborated with cross-functional teams using Git and Agile Scrum.',
    ],
    source: 'Resume',
  },
];

export const education: Education[] = [
  {
    period: 'In progress',
    degree: 'MSc High Integrity Systems',
    school: 'Frankfurt University of Applied Sciences',
  },
  {
    period: '2023',
    degree: 'BSc Computer Science (Software Engineering)',
    school: 'International Islamic University Malaysia (IIUM)',
  },
];

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------

export const about = {
  eyebrow: 'About me',
  paragraphs: [
    'I’m a software engineer in Frankfurt am Main, completing an MSc in High Integrity Systems at Frankfurt University of Applied Sciences after a BSc in Computer Science (Software Engineering) at the International Islamic University Malaysia.',
    'My professional work so far has been software engineering: Python data-extraction and automation pipelines as a working student at Enviotech GmbH (since July 2026), production Android and iOS software at Louco Event Media GmbH (March–June 2026), a cloud-connected environmental monitoring platform at Johannes Gutenberg University Mainz (September 2025 – February 2026), and customer software at Teczo Sdn. Bhd. in Kuala Lumpur (2022).',
    'I now focus on machine learning, and I build it the way I build software: data validated before training, evaluation on data the model has never seen, the model served behind a tested API, and CI that trains, tests and ships it. Outside code, I’m a Bengali literature enthusiast.',
  ],
};

export const certifications: string[] = [
  'Google Data Analytics',
  'Google AI Essentials',
  'Business Analytics with Excel',
];

export const learning: string[] = [
  'AWS Certified Cloud Practitioner (in preparation)',
  'MSc High Integrity Systems, Frankfurt UAS',
  'Advanced DevOps practices',
];

export const languages: { name: string; level: string }[] = [
  { name: 'Bengali', level: 'Native' },
  // Levels from the resume (2026-11-08); legacy site said Professional / Learning.
  { name: 'English', level: 'Fluent' },
  { name: 'German', level: 'Basic' },
];

export const publications: Publication[] = [
  // Status confirmed by the owner on 2026-11-08 (legacy site said published, CV said ongoing).
  {
    title: 'STEKO-SD: A Mobile Health Solution to Assist Self-Checking of Metabolic Syndrome',
    status: 'under review',
  },
  {
    title: 'BEST4U.COM: A Creative Platform for Secondhand Items Transaction',
    year: '2022',
    url: 'https://journals.iium.edu.my/kict/index.php/jisdt/article/view/255',
  },
];

// ---------------------------------------------------------------------------
// Writing (brief §6.8): no article has a body anywhere, so all are drafts.
// ---------------------------------------------------------------------------

export const articles: Article[] = [
  {
    title: 'Sending OAuth Server Auth Codes from Flutter to Your Backend',
    excerpt:
      'How to correctly configure serverClientId for Google Sign-In and pass the one-time server auth code securely — lessons from production.',
    date: 'Jun 2025',
    readTime: '6 min read',
    tag: 'Flutter',
    status: 'draft',
  },
  {
    title: 'Flutter + AWS: Deploying a Production Mobile Backend',
    excerpt:
      'A practical guide to architecting a scalable Flutter app backend on AWS EC2, RDS, and S3 — from zero to production.',
    date: 'May 2025',
    readTime: '8 min read',
    tag: 'Cloud',
    status: 'draft',
  },
  {
    title: 'Android Automotive OS: Building Your First HMI Dashboard',
    excerpt:
      'Getting started with Android Automotive OS using Jetpack Compose — creating cluster UI that works on real in-vehicle hardware.',
    date: 'Apr 2025',
    readTime: '5 min read',
    tag: 'Android',
    status: 'draft',
  },
  {
    title: 'mHealth App Evaluation: What the Research Says',
    excerpt:
      'Insights from academic literature on mobile health app usability and EMG biofeedback — bridging research and real-world development.',
    date: 'Mar 2025',
    readTime: '7 min read',
    tag: 'Research',
    status: 'draft',
  },
];

export const publishedArticles = articles.filter((a) => a.status === 'published' && a.url);

// ---------------------------------------------------------------------------
// Contact, footer, SEO
// ---------------------------------------------------------------------------

export const contact = {
  eyebrow: 'Get in touch',
  title: 'Let’s talk about your team’s next AI/ML or software role.',
  lead: 'I’m open to AI/ML and software engineering roles. Write to me directly, or use the form: it opens your own email app with the message filled in.',
  formNote: 'Nothing is sent or stored by this site. The button only opens your email app.',
};

export const footer = {
  tagline: 'AI/ML engineering and AI-powered software, built to be relied on.',
};

export const seo = {
  title: 'Md Rakibul Hassan — AI/ML Engineer & AI-Powered Software Developer',
  description:
    'AI/ML engineer in Frankfurt building machine learning models, Python inference APIs and MLOps pipelines, backed by production mobile application architecture.',
  keywords: [
    'AI/ML Engineer',
    'Machine Learning Engineer',
    'AI-Powered Software Developer',
    'Python Developer',
    'AI Application Developer',
    'Mobile Application Architecture',
    'MLOps',
    'Software Engineer',
  ],
};

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: profile.role,
  url: 'https://rakibul-cyber.github.io/rakibul-portfolio/',
  email: `mailto:${profile.email}`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Frankfurt am Main',
    addressCountry: 'DE',
  },
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'International Islamic University Malaysia' },
    { '@type': 'CollegeOrUniversity', name: 'Frankfurt University of Applied Sciences' },
  ],
  knowsAbout: [
    'Machine learning',
    'Python',
    'scikit-learn',
    'FastAPI',
    'MLOps',
    'Docker',
    'GitHub Actions',
    'Flutter',
    'Mobile application architecture',
    'AWS',
  ],
  sameAs: [profile.github, profile.linkedin],
};
