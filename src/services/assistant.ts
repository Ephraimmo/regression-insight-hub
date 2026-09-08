import type { Dataset, MetricId } from "@/models/types";
import {
  environmentHealth,
  filterExecutions,
  filterRuns,
  featureStats,
  formatPercent,
  formatSeconds,
  metricAvailable,
  metricLabels,
  metricValue,
  previousPeriod,
  percentChange,
  summarise,
  type GlobalFilters,
} from "@/services/analytics";

export interface AssistantAnswer {
  question: string;
  headline: string;
  narrative: string[];
  table?: { columns: string[]; rows: string[][] };
  followUps: string[];
  scope: string;
}

const metricKeywords: Array<{ metric: MetricId; words: string[] }> = [
  { metric: "loginTime", words: ["login"] },
  { metric: "ajaxLoad", words: ["ajax"] },
  { metric: "pageLoad", words: ["page load", "pageload"] },
  { metric: "executionTime", words: ["execution time", "duration", "slow", "how long"] },
  { metric: "failureCount", words: ["failure", "failed", "fail"] },
  { metric: "passRate", words: ["pass rate", "pass", "success"] },
];

function detectMetric(q: string): MetricId {
  const lower = q.toLowerCase();
  for (const { metric, words } of metricKeywords) {
    if (words.some((w) => lower.includes(w))) return metric;
  }
  return "passRate";
}

export const suggestedQuestions = [
  "What is the pass rate this period?",
  "Which features fail most often?",
  "Compare login time across versions",
  "How does RI2211FIN compare to RI2403FIN?",
  "What is the average AJAX load time?",
  "Which scenarios are slowest?",
];

export function answerQuestion(dataset: Dataset, filters: GlobalFilters, question: string): AssistantAnswer {
  const metric = detectMetric(question);
  const lower = question.toLowerCase();
  const execs = filterExecutions(dataset, { ...filters, status: "all" });
  const runs = filterRuns(dataset, filters);
  const scope = [
    filters.environment === "all" ? "all environments" : filters.environment,
    filters.feature === "all" ? "all features" : filters.feature,
    `${filters.from} → ${filters.to}`,
  ].join(" · ");

  const followUps = [
    "Break this down by environment",
    "Show the same figure for the previous period",
    "List the failing scenarios",
  ];

  if (!execs.length && !runs.length) {
    return {
      question,
      headline: "No data for the current filters",
      narrative: [
        "The selected combination of environment, feature, scenario and date range returns no records.",
        "Widen the date range or reset the filters, then ask again.",
      ],
      followUps,
      scope,
    };
  }

  if (!metricAvailable(dataset, metric)) {
    return {
      question,
      headline: `${metricLabels[metric]} is not available in the connected data`,
      narrative: [
        `The current dataset does not carry a ${metricLabels[metric].toLowerCase()} value, so no figure can be reported.`,
        "Connect a source that includes this metric on the Data Sources page.",
      ],
      followUps,
      scope,
    };
  }

  const health = environmentHealth(dataset, filters).filter(
    (h) => filters.environment === "all" || h.environmentId === filters.environment,
  );

  // Comparison intent
  if (lower.includes("compare") || lower.includes("versus") || lower.includes(" vs ") || filters.environment === "all") {
    const rows = health.map((h) => {
      const envFilters: GlobalFilters = { ...filters, environment: h.environmentId, status: "all" };
      const v = metricValue(metric, filterExecutions(dataset, envFilters), filterRuns(dataset, envFilters));
      return [
        h.environmentId,
        h.version,
        String(h.runs),
        String(h.total),
        formatValue(metric, v),
      ];
    });
    const best = [...health].sort((a, b) => (b.passRate ?? 0) - (a.passRate ?? 0))[0];
    const worst = [...health].sort((a, b) => (a.passRate ?? 100) - (b.passRate ?? 100))[0];
    return {
      question,
      headline: `${metricLabels[metric]} by environment`,
      narrative: [
        best && worst
          ? `${best.environmentId} is the healthiest environment at ${formatPercent(best.passRate)} pass rate, while ${worst.environmentId} is the weakest at ${formatPercent(worst.passRate)}.`
          : "Comparison computed across the selected environments.",
        `The figures cover ${runs.length} regression runs and ${execs.length} scenario executions in the selected window.`,
      ],
      table: { columns: ["Environment", "Version", "Runs", "Scenarios", metricLabels[metric]], rows },
      followUps,
      scope,
    };
  }

  // Failure / feature intent
  if (metric === "failureCount" || lower.includes("feature")) {
    const stats = featureStats(dataset, execs)
      .sort((a, b) => b.failures - a.failures)
      .slice(0, 8);
    return {
      question,
      headline: `${stats.reduce((a, s) => a + s.failures, 0)} failures across ${stats.length} feature files`,
      narrative: [
        stats[0]
          ? `${stats[0].breakdownName} (${stats[0].featureName}) carries the most failures: ${stats[0].failures} of ${stats[0].total} executions.`
          : "No failures recorded for the current filters.",
        "Open Regression Results with the same filters to inspect the failed steps and browser errors.",
      ],
      table: {
        columns: ["Breakdown", "Feature file", "Failures", "Executions", "Avg duration"],
        rows: stats.map((s) => [
          s.breakdownName,
          s.featureName,
          String(s.failures),
          String(s.total),
          formatSeconds(s.avgDuration),
        ]),
      },
      followUps,
      scope,
    };
  }

  // Single-number intent with previous-period delta
  const current = metricValue(metric, execs, runs);
  const prev = previousPeriod(filters);
  const prevFilters: GlobalFilters = { ...filters, from: prev.from, to: prev.to };
  const previous = metricValue(
    metric,
    filterExecutions(dataset, { ...prevFilters, status: "all" }),
    filterRuns(dataset, prevFilters),
  );
  const change = percentChange(current, previous);
  const s = summarise(execs, runs.length);

  return {
    question,
    headline: `${metricLabels[metric]}: ${formatValue(metric, current)}`,
    narrative: [
      `Measured over ${runs.length} runs and ${execs.length} scenario executions (${s.passed} passed, ${s.failed} failed, ${s.blocked} blocked, ${s.unknown} unknown).`,
      change === null
        ? "There is no comparable previous period in the connected data, so no trend is reported."
        : `Compared with ${prev.from} → ${prev.to} the value moved ${change > 0 ? "up" : "down"} by ${Math.abs(change).toFixed(1)}%.`,
    ],
    followUps,
    scope,
  };
}

export function formatValue(metric: MetricId, v: number | null) {
  if (v === null) return "No data";
  if (metric === "passRate") return formatPercent(v);
  if (metric === "failureCount") return String(v);
  return formatSeconds(v);
}
