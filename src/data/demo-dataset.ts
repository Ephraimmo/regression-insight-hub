import type {
  Dataset,
  Environment,
  ExecutionStep,
  Feature,
  RegressionRun,
  RunStatus,
  ScenarioExecution,
} from "@/models/types";

/** Deterministic PRNG so the demo dataset is stable between renders/SSR. */
function makeRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

const environments: Environment[] = [
  { id: "RI2403FIN", name: "RI2403FIN", version: "24.03", release: "FIN 24.03" },
  { id: "RI2211FIN", name: "RI2211FIN", version: "22.11", release: "FIN 22.11" },
  { id: "RI2205FIN", name: "RI2205FIN", version: "22.05", release: "FIN 22.05" },
];

const featureSeed: Array<{ name: string; breakdown: string; scenarios: string[] }> = [
  {
    name: "Financials - Debtors - AR Periodic Processing",
    breakdown: "AR Account Allocation",
    scenarios: [
      "Allocate From Larger Amount Success",
      "Allocate From Equal Amount Success",
      "Allocate From Smaller Amount Success",
      "Allocate With Discount Success",
    ],
  },
  {
    name: "Financials - Creditors - AP Payment Processing",
    breakdown: "AP Payment Run",
    scenarios: [
      "Create Payment Batch Success",
      "Authorise Payment Batch Success",
      "Reverse Payment Batch Success",
    ],
  },
  {
    name: "Financials - General Ledger - Journal Capture",
    breakdown: "GL Journal Entry",
    scenarios: [
      "Capture Balanced Journal Success",
      "Capture Unbalanced Journal Validation",
      "Post Journal Success",
    ],
  },
  {
    name: "Financials - Debtors - Customer Maintenance",
    breakdown: "Account Name",
    scenarios: ["Create Customer Success", "Amend Account Name Success", "Deactivate Customer Success"],
  },
  {
    name: "Financials - Cashbook - Bank Reconciliation",
    breakdown: "Bank Statement Import",
    scenarios: ["Import Statement Success", "Auto Match Transactions Success", "Manual Match Success"],
  },
  {
    name: "Financials - Assets - Depreciation Run",
    breakdown: "Asset Depreciation",
    scenarios: ["Run Monthly Depreciation Success", "Reverse Depreciation Success"],
  },
  {
    name: "Financials - Reporting - Trial Balance",
    breakdown: "Trial Balance Extract",
    scenarios: ["Generate Trial Balance Success", "Export Trial Balance Success"],
  },
  {
    name: "Financials - Tax - VAT Reconciliation",
    breakdown: "VAT Return",
    scenarios: ["Generate VAT Return Success", "Submit VAT Return Success"],
  },
];

const features: Feature[] = featureSeed.map((f, i) => ({
  id: `FEAT-${String(i + 1).padStart(3, "0")}`,
  name: f.name,
  breakdownName: f.breakdown,
  scenarios: f.scenarios,
}));

/** Environment behaviour profiles — RI2211FIN is the degraded environment. */
const profiles: Record<
  string,
  {
    failureRate: number;
    blockedRate: number;
    unknownRate: number;
    duration: number;
    login: number | null;
    ajax: number | null;
    page: number | null;
    drift: number;
  }
> = {
  RI2403FIN: { failureRate: 0.04, blockedRate: 0.01, unknownRate: 0.005, duration: 4.2, login: 2.4, ajax: 1.18, page: 2.1, drift: 0.02 },
  RI2211FIN: { failureRate: 0.13, blockedRate: 0.03, unknownRate: 0.015, duration: 5.4, login: 3.1, ajax: 1.24, page: 2.9, drift: 0.42 },
  // RI2205FIN's export does not carry AJAX timing — used to demonstrate empty states.
  RI2205FIN: { failureRate: 0.025, blockedRate: 0.005, unknownRate: 0.004, duration: 3.9, login: 2.2, ajax: null, page: 1.9, drift: 0.01 },
};

const failureMessages = [
  {
    message: "Automation/browser interaction error while interacting with a table cell",
    browserError:
      "org.openqa.selenium.ElementClickInterceptedException: element click intercepted: Other element would receive the click: <div class=\"ajax-overlay\">…</div>\n  (Session info: chrome=126.0.6478.127)",
    failedStep: "When I select the allocation row in the outstanding transactions table",
    lastSuccessfulStep: "And the outstanding transactions table has loaded",
  },
  {
    message: "Timed out waiting for AJAX request to complete",
    browserError:
      "org.openqa.selenium.TimeoutException: Expected condition failed: waiting for jQuery.active == 0 (tried for 30 second(s) with 500 milliseconds interval)",
    failedStep: "When I save the transaction",
    lastSuccessfulStep: "And I capture the transaction amount",
  },
  {
    message: "Assertion failed: displayed balance did not match the expected value",
    browserError: undefined,
    failedStep: "Then the account balance should be updated",
    lastSuccessfulStep: "When I confirm the allocation",
  },
  {
    message: "Stale element reference after page reload",
    browserError:
      "org.openqa.selenium.StaleElementReferenceException: stale element reference: element is not attached to the page document",
    failedStep: "When I continue to the next screen",
    lastSuccessfulStep: "And the confirmation dialog is displayed",
  },
];

function buildSteps(scenario: string, status: RunStatus, failedStep?: string, rnd = Math.random): ExecutionStep[] {
  const base = [
    { keyword: "Given", name: "I am logged into the application" },
    { keyword: "And", name: "I navigate to the required program" },
    { keyword: "When", name: `I execute "${scenario}"` },
    { keyword: "And", name: "the outstanding transactions table has loaded" },
    { keyword: "When", name: failedStep ?? "I complete the transaction" },
    { keyword: "Then", name: "the result should be persisted" },
  ];
  const failIndex = status === "failed" ? 4 : -1;
  return base.map((s, i) => ({
    keyword: s.keyword,
    name: s.name,
    duration: Math.round((0.3 + rnd() * 1.6) * 100) / 100,
    status: failIndex === -1 ? (status === "blocked" ? "blocked" : "passed") : i < failIndex ? "passed" : i === failIndex ? "failed" : "unknown",
  }));
}

function build(): Dataset {
  const rnd = makeRandom(20240903);
  const runs: RegressionRun[] = [];
  const executions: ScenarioExecution[] = [];

  const today = new Date();
  today.setUTCHours(19, 0, 0, 0);
  const DAYS = 45;

  for (let d = DAYS - 1; d >= 0; d--) {
    const day = new Date(today.getTime() - d * 86400000);
    if (day.getUTCDay() === 0 || day.getUTCDay() === 6) continue; // weekdays only
    const progress = (DAYS - d) / DAYS;

    for (const env of environments) {
      const p = profiles[env.id];
      const runId = `RUN-${env.id}-${day.toISOString().slice(0, 10)}`;
      const drift = 1 + p.drift * Math.max(0, progress - 0.55);
      const jitter = () => 0.92 + rnd() * 0.16;

      runs.push({
        id: runId,
        environmentId: env.id,
        version: env.version,
        startedAt: day.toISOString(),
        loginTime: p.login === null ? null : round(p.login * drift * jitter()),
        ajaxLoad: p.ajax === null ? null : round(p.ajax * drift * jitter()),
        pageLoad: p.page === null ? null : round(p.page * drift * jitter()),
      });

      let clock = day.getTime();
      for (const feature of features) {
        for (const scenario of feature.scenarios) {
          const roll = rnd();
          // The degraded environment concentrates failures in AR Account Allocation.
          const bias = env.id === "RI2211FIN" && feature.id === "FEAT-001" ? 2.4 : 1;
          let status: RunStatus = "passed";
          if (roll < p.failureRate * bias) status = "failed";
          else if (roll < p.failureRate * bias + p.blockedRate) status = "blocked";
          else if (roll < p.failureRate * bias + p.blockedRate + p.unknownRate) status = "unknown";

          const duration = round(p.duration * drift * (0.6 + rnd() * 0.9));
          clock += Math.round(duration * 1000) + Math.round(rnd() * 4000);
          const fm = failureMessages[Math.floor(rnd() * failureMessages.length)];
          const isFail = status === "failed";

          executions.push({
            id: `${runId}-${feature.id}-${slug(scenario)}`,
            runId,
            environmentId: env.id,
            featureId: feature.id,
            featureName: feature.name,
            breakdownName: feature.breakdownName,
            scenarioName: scenario,
            scenarioId: `${feature.id}:${slug(scenario)}`,
            status,
            duration,
            timestamp: new Date(clock).toISOString(),
            workerId: `worker-${1 + Math.floor(rnd() * 4)}`,
            actuallyExecuted: status !== "blocked",
            steps: buildSteps(scenario, status, isFail ? fm.failedStep : undefined, rnd),
            failure: isFail
              ? {
                  message: fm.message,
                  browserError: fm.browserError,
                  failedStep: fm.failedStep,
                  lastSuccessfulStep: fm.lastSuccessfulStep,
                }
              : undefined,
          });
        }
      }
    }
  }

  return {
    environments,
    features,
    runs,
    executions,
    // No task or XML Helper source is connected yet — the UI must show empty states
    // rather than fabricated records.
    tasks: [],
    xmlDocuments: [],
    sources: [
      {
        id: "src-demo",
        name: "Demo regression export (RI2403FIN, RI2211FIN, RI2205FIN)",
        type: "Demo",
        status: "connected",
        records: executions.length,
        uploadedAt: new Date().toISOString(),
        detail: `${runs.length} runs · ${features.length} features · ${executions.length} scenario executions`,
      },
      {
        id: "src-xml",
        name: "XML Helper documentation",
        type: "XML",
        status: "not_connected",
        records: null,
        uploadedAt: null,
        detail: "Upload XML Helper documents to enable XML search and feature linking.",
      },
      {
        id: "src-excel",
        name: "Excel workbook ingestion",
        type: "Excel",
        status: "available",
        records: null,
        uploadedAt: null,
        detail: "Upload a workbook to inspect sheets, columns and detected metrics.",
      },
      {
        id: "src-tasks",
        name: "Task / issue tracker",
        type: "JSON",
        status: "not_connected",
        records: null,
        uploadedAt: null,
        detail: "Task integration not yet connected.",
      },
    ],
    queryTemplates: [
      {
        id: "multi_version_batch_day",
        name: "Multi-version comparison for a batch on a day",
        category: "Results",
        requiredFilters: ["environments", "date"],
        optionalFilters: ["feature"],
        metrics: ["passRate", "failureCount"],
        outputs: ["table", "chart", "narrative"],
      },
      {
        id: "single_version_feature",
        name: "Single-version results for a feature file",
        category: "Results",
        requiredFilters: ["environments", "feature"],
        optionalFilters: ["scenario", "dateRange"],
        metrics: ["passRate", "failureCount"],
        outputs: ["table", "scenarioList", "narrative"],
      },
      {
        id: "single_version_feature_period",
        name: "Single-version feature comparison over a period",
        category: "Results",
        requiredFilters: ["environments", "feature", "dateRange"],
        optionalFilters: ["scenario"],
        metrics: ["passRate", "failureCount"],
        outputs: ["chart", "table", "narrative"],
      },
      {
        id: "multi_version_batch_times",
        name: "Multi-version batch comparison — execution times",
        category: "Performance",
        requiredFilters: ["environments", "date"],
        optionalFilters: ["feature"],
        metrics: ["executionTime"],
        outputs: ["singleNumber", "table", "chart"],
      },
      {
        id: "single_version_feature_times",
        name: "Single-version feature results — execution times",
        category: "Performance",
        requiredFilters: ["environments", "feature"],
        optionalFilters: ["scenario"],
        metrics: ["executionTime"],
        outputs: ["singleNumber", "table", "chart"],
      },
      {
        id: "single_version_feature_times_period",
        name: "Single-version feature timing over a period",
        category: "Performance",
        requiredFilters: ["environments", "feature", "dateRange"],
        optionalFilters: ["scenario"],
        metrics: ["executionTime"],
        outputs: ["chart", "table", "narrative"],
      },
      {
        id: "single_version_login",
        name: "Single-version login time over a period",
        category: "Performance",
        requiredFilters: ["environments", "dateRange"],
        optionalFilters: [],
        metrics: ["loginTime"],
        outputs: ["singleNumber", "chart", "narrative"],
      },
      {
        id: "multi_version_login",
        name: "Multi-version login time over a period",
        category: "Performance",
        requiredFilters: ["environments", "dateRange"],
        optionalFilters: [],
        metrics: ["loginTime"],
        outputs: ["table", "chart", "narrative"],
      },
      {
        id: "single_version_ajax",
        name: "Single-version average AJAX load over a period",
        category: "Performance",
        requiredFilters: ["environments", "dateRange"],
        optionalFilters: [],
        metrics: ["ajaxLoad"],
        outputs: ["singleNumber", "chart", "narrative"],
      },
      {
        id: "multi_version_ajax",
        name: "Multi-version average AJAX load over a period",
        category: "Performance",
        requiredFilters: ["environments", "dateRange"],
        optionalFilters: [],
        metrics: ["ajaxLoad"],
        outputs: ["table", "chart", "narrative"],
      },
      {
        id: "multi_version_page",
        name: "Multi-version average page load over a period",
        category: "Performance",
        requiredFilters: ["environments", "dateRange"],
        optionalFilters: [],
        metrics: ["pageLoad"],
        outputs: ["table", "chart", "narrative"],
      },
      {
        id: "single_version_page",
        name: "Single-version average page load over a period",
        category: "Performance",
        requiredFilters: ["environments", "dateRange"],
        optionalFilters: [],
        metrics: ["pageLoad"],
        outputs: ["singleNumber", "chart", "narrative"],
      },
    ],
  };
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}
function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const demoDataset: Dataset = build();
