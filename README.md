# Regression Insight Hub

MASTER FRONT-END DEVELOPMENT PROMPT

XML Helper & Regression Intelligence Platform

MANDATORY MAIN DASHBOARD REQUIREMENT

The application MUST have a fully functional, professional Regression Intelligence Dashboard.

The Dashboard is the default landing page when the user opens the application.

Do NOT create a dashboard that is only decorative or contains placeholder cards.

Every dashboard component must be connected to the available demo data and must update when filters are changed.

1. DASHBOARD PURPOSE

The dashboard must provide the Regression/QA team with an immediate overview of:

Overall regression health

Environment health

Passed tests

Failed tests

Regression runs

Features

Scenarios

Performance

Login performance

AJAX load performance

Page-load performance

Recent failures

Related tasks

XML Helper information

Environment comparisons

Regression trends

Recently executed tests

The user should be able to understand the current regression state without opening another page.

2. DASHBOARD HEADER

At the top of the dashboard display:

Regression Intelligence Dashboard

[ Environment ▼ ] [ Version ▼ ] [ Date Range ▼ ] [ Refresh ]

Last updated: ...
Data source: Demo Data


Initially provide:

RI2403FIN
RI2211FIN
RI2205FIN


as selectable environments.

The dashboard must support selecting:

All Environments
RI2403FIN
RI2211FIN
RI2205FIN


When an environment is selected, ALL dashboard metrics must update.

3. DASHBOARD SUMMARY CARDS

Create a row of summary cards.

Card 1 — Regression Runs

Display:

Regression Runs

XXX

Compared with previous period
↑ / ↓ XX%


Card 2 — Total Scenarios

Total Scenarios

XXX

Across selected environments


Card 3 — Passed

PASSED

XXX

XX% pass rate


Card 4 — Failed

FAILED

XXX

XX% failure rate


Clicking the card should take the user to the relevant filtered regression results.

Card 5 — Average Execution Time

AVG EXECUTION

XX.X sec

↑ / ↓ XX%


Card 6 — Active Issues

RELATED TASKS

XX

Open / unresolved


Only display this value when task information is actually available.

4. REGRESSION HEALTH

Create a large Regression Health section.

Display a visual breakdown:

Regression Health

PASSED       ███████████████████
FAILED       ███
BLOCKED      ██
UNKNOWN      █


Use actual values from the imported data.

Allow the user to click:

Passed
Failed
Blocked
Unknown


to filter the regression results.

5. ENVIRONMENT HEALTH

Create an Environment Health section.

Display all available environments.

Example:

Environment Health

RI2403FIN
████████████████████  96% Passing

RI2211FIN
██████████████████    88% Passing

RI2205FIN
████████████████████  98% Passing


Do NOT use these percentages as fake demo values.

Calculate them from the actual uploaded/demo data.

For every environment display:

Total runs

Passed

Failed

Pass rate

Average execution time

Latest run

Performance status

6. ENVIRONMENT COMPARISON

Create a dashboard comparison chart.

Allow:

Compare

☑ RI2403FIN
☑ RI2211FIN
☑ RI2205FIN


Metrics:

Pass Rate
Failure Rate
Average Execution Time
Average Login Time
Average AJAX Load
Average Page Load


The user should be able to switch between metrics.

7. REGRESSION TREND

Create a large line chart titled:

Regression Trend


Allow the user to select:

Metric

[ Pass Rate ▼ ]

Options:

Pass Rate
Failure Count
Execution Time
Login Time
AJAX Load Time
Page Load Time


X-axis:

Date


Y-axis:

Selected metric


The chart must use actual available dates from the regression data.

8. PERFORMANCE OVERVIEW

Create a dedicated dashboard section:

Performance Overview


Show three primary performance cards:

Login

Average Login Time
XX.X sec

Trend
↑ / ↓ XX%


AJAX

Average AJAX Load
XX.X sec

Trend
↑ / ↓ XX%


Page Load

Average Page Load
XX.X sec

Trend
↑ / ↓ XX%


If a metric does not exist in the currently loaded data, display:

No data available


Do NOT invent a value.

9. PERFORMANCE COMPARISON CHART

Create a visual comparison:

Performance Comparison

             RI2403FIN   RI2211FIN   RI2205FIN

Login           ...
AJAX            ...
Page Load       ...
Execution       ...


Allow the user to select the metric.

Provide:

Chart
Table


views.

10. RECENT REGRESSION ACTIVITY

Create a Recent Activity panel.

Show the most recent regression activity.

Example structure:

Recent Regression Activity

18:59:55
✓ Allocate From Larger Amount Success
RI2403FIN
PASSED

18:59:44
✓ Allocate From Equal Amount Success
RI2211FIN
PASSED

18:57:57
✕ Allocate From Larger Amount Success
RI2211FIN
FAILED


Use actual records from the data.

Each item must be clickable.

Clicking opens the complete regression result.

11. RECENT FAILURES

Create a dedicated:

Recent Failures


section.

For every failure display:

Feature

Scenario

Environment

Date/time

Status

Failure reason

Related task if available

Example:

FAILED

Financials - Debtors - AR Periodic Processing
AR Account Allocation

Environment:
RI2211FIN

Scenario:
Allocate From Larger Amount Success

Failure:
Automation/browser interaction error

[ VIEW DETAILS ]


The supplied demo data contains an example where the scenario failed during table-cell interaction and the execution reported browser/automation errors. Preserve that technical information when displaying the demo record rather than replacing it with a generic failure message.

12. TOP FAILING FEATURES

Create a section:

Top Failing Features


Rank features by failure count.

Example:

1. Financials - Debtors - AR Periodic Processing     XX failures
2. ...
3. ...


Clicking a feature opens its regression history.

13. TOP SLOWEST FEATURES

Create:

Slowest Features


Rank features by average execution duration.

Display:

Feature
Average Duration
Number of Runs
Trend


14. TASK / ISSUE OVERVIEW

Create:

Regression Issues


Show:

Open Tasks
Resolved Tasks
Recently Logged
Regression-related Tasks


If task data is not yet available, show:

Task integration not yet connected


Do not fabricate tasks.

When task information becomes available, automatically populate this section.

15. XML HELPER OVERVIEW

Create an XML Helper dashboard widget.

Display:

XML Helper

Documents
XX

Features linked
XX

XML Tags
XX

Recently updated
...


Provide:

[ OPEN XML HELPER ]


When the user searches or opens a feature, show related XML Helper information if available.

16. AI ASSISTANT ON DASHBOARD

Place an assistant search box prominently near the top.

Example:

Ask the Regression Assistant

┌──────────────────────────────────────────────┐
│ Why are there failures on RI2211FIN?        │
└──────────────────────────────────────────────┘

[ ASK ]


Provide example clickable questions:

Why did RI2211FIN fail?

Compare RI2403FIN and RI2211FIN

Show slowest features

Show recent failures

What changed this week?

Find tasks related to this failure

Show XML Helper information for this feature


The assistant must search across all connected information.

17. DASHBOARD FILTERS

The dashboard must have global filters:

Environment
Version
Release
Feature
Scenario
Result
Metric
Date Range


Filters must work together.

Example:

Environment:
RI2211FIN

Feature:
AR Account Allocation

Result:
FAILED

Date:
01 Aug → 31 Aug


The entire dashboard should recalculate based on those filters.

18. DASHBOARD DRILL-DOWN

Every important dashboard number must be clickable.

For example:

FAILED: 24


Clicking it should open:

Regression Results

Filters automatically applied:

Status = FAILED
Environment = selected environment
Date = selected date range


Likewise:

Average AJAX Load


should open the AJAX performance analysis.

19. DASHBOARD QUICK ACTIONS

Add quick-action buttons:

+ Upload Regression Data

+ Upload XML Helper

+ Upload Excel

Run Comparison

Ask Assistant

View Failures

View Tasks

View Performance


These actions should lead directly to the appropriate workflow.

20. DATA SOURCE STATUS

Add a small dashboard panel:

Data Sources

Regression Data       ● Connected
XML Helper            ● Connected / Not Connected
Excel                 ● Available
Tasks                 ● Connected / Not Connected
Teams                 ● Connected / Not Connected


Use real connection/import state.

21. DEMO DATA INDICATOR

Because the first version uses demonstration information, clearly display:

DEMO MODE


in the dashboard header.

The dashboard must never imply that the demo data represents live production regression results.

22. DASHBOARD EMPTY STATES

When data is unavailable, use professional empty states.

Example:

No AJAX performance data available

Upload a regression dataset containing AJAX timing
information to enable this analysis.


Example:

No related tasks found

There are currently no task records connected
to the selected regression information.


23. RESPONSIVE DESIGN

The dashboard must work on:

Desktop

Laptop

Tablet

Prioritize desktop because this is an engineering/QA dashboard.

Charts and tables must resize correctly.

24. DASHBOARD LAYOUT

Use approximately this structure:

┌───────────────────────────────────────────────────────────────┐
│ Regression Intelligence Dashboard       Environment ▼  Date ▼ │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Regression Runs │ Scenarios │ Passed │ Failed │ Avg Time     │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Regression Health              │ Environment Health          │
│  [Pie/Bar/Progress]             │ [Environment Comparison]   │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Regression Trend                                             │
│  [Large Interactive Chart]                                    │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Performance Overview                                         │
│  Login │ AJAX │ Page Load │ Execution                          │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Recent Failures                 │ Recent Activity             │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Top Failing Features             │ Regression Issues          │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  XML Helper Overview              │ AI Regression Assistant     │
│                                                               │
└───────────────────────────────────────────────────────────────┘


25. DASHBOARD DESIGN STYLE

The dashboard should look like a professional enterprise engineering platform.

Use:

Clean typography

Strong information hierarchy

Minimal unnecessary decoration

Professional cards

Consistent spacing

Clear status indicators

Interactive charts

Search-first design

Accessible contrast

Responsive tables

Clear error states

Avoid:

Excessive gradients

Excessive animations

Fake metrics

Decorative charts with no data

Generic SaaS dashboard templates that do not reflect regression testing

26. DASHBOARD MUST BE THE APPLICATION HOME PAGE

When the application opens:

/


must display the Regression Intelligence Dashboard.

The dashboard should be the central starting point for all workflows.

The navigation should allow the user to move from the dashboard into:

Dashboard
Ask Assistant
XML Helper
Regression
Tasks
Teams
Environments
Data Sources
Query Builder
Reports
Settings


27. FINAL DASHBOARD ACCEPTANCE TEST

The dashboard is considered complete only when the following works:

Application opens on Dashboard.

Demo Mode is visible.

RI2403FIN can be selected.

RI2211FIN can be selected.

RI2205FIN can be selected.

Dashboard metrics update when environment changes.

Date filtering works.

Regression results are calculated from the supplied data.

Passed/failed counts are calculated from actual records.

Recent activity is generated from actual records.

Failed tests can be opened.

Feature drill-down works.

Environment comparison works.

Performance metrics work when data exists.

Missing metrics show proper empty states.

Related task information appears when task data exists.

XML Helper information appears when XML data exists.

Dashboard search can launch the AI assistant.

Dashboard cards can be clicked to drill down.

No fake production information is displayed.

Additional Excel files can be imported without redesigning the dashboard.

Additional environments automatically appear in the environment selector.

Additional query templates automatically become available.

Dashboard remains functional when new data sources are added.

CORE PRINCIPLE

The Dashboard is NOT simply a visual summary.

It is the central control center of the Regression Intelligence Platform.

Every major piece of information must be connected back to the dashboard.

The user should be able to start at the dashboard, identify a problem, drill into the regression result, investigate the feature and scenario, view the technical failure, find related XML Helper information, locate related tasks, identify the responsible team, and return to the dashboard without losing context.

Build a modern, enterprise-grade XML Helper + Regression Intelligence web application.

The application will become the central front-end interface for the Regression/QA team to investigate XML Helper information, regression results, test executions, environments, tasks, queries, failures, timing information, and all other information connected to the Regression team.

This is a living system.

More XML Helper documentation, Excel files, regression reports, environments, tasks, queries, examples, and supporting information will be provided over time.

Therefore, DO NOT hard-code the application around only the initial demo data.

The architecture must be designed so new information can be added without redesigning the application.

1. PRIMARY OBJECTIVE

Create a front-end application where a user can ask:

What happened?

Where did it happen?

Which environment was affected?

Which release/version was affected?

Which regression run was affected?

Which feature was affected?

Which scenarios failed?

What changed between versions?

Did performance get worse?

Did AJAX loading become slower?

Did page loading become slower?

When did the regression run start?

Which tests passed or failed?

What tasks/issues were logged about this problem?

Who is responsible for the affected area?

What other information is related to this issue?

What does the XML Helper documentation say about this functionality?

What regression results are associated with this functionality?

What previous incidents or tasks are related?

The system must provide a unified answer by connecting:

XML Helper → Features → Regression Tests → Scenarios → Runs → Environments → Versions → Failures → Performance → Tasks → Queries → Teams → Owners

2. IMPORTANT DESIGN PRINCIPLE

The application must be data-driven, not page-driven.

Do NOT create separate hard-coded pages for every new feature.

Instead, create a reusable information model.

For example:

Environment
    ↓
Regression Run
    ↓
Feature
    ↓
Scenario
    ↓
Result
    ↓
Failure / Error
    ↓
Task / Query
    ↓
Team / Owner


XML Helper information must be able to connect into the same model.

3. INITIAL DEMO ENVIRONMENTS

Use the following three environments as the initial demonstration/test environments:

RI2403FIN

RI2211FIN

RI2205FIN

These environments must be selectable throughout the application.

The application should make it very easy to expand this list later.

The Excel requirements workbook contains additional environments and should be treated as the source for the environment-selection architecture.

The requirements workbook currently identifies RI environments as the main comparison scope and includes environments such as:

RI2001

RI2001FIN

RI2008

RI2008FIN

RI2102

RI2102FIN

RI2205

RI2205FIN

RI2211

RI2211FIN

RI2403FIN

Do not assume this list is permanent.

Build environment management dynamically.

4. EXCEL FILE INTELLIGENCE

The application must support uploading Excel files.

When an Excel file is uploaded, automatically inspect the workbook.

The system must determine:

Workbook structure

Detect:

Workbook name

Workbook metadata

Number of sheets

Sheet names

Hidden sheets

Visible sheets

Tables

Named ranges

Columns

Rows

Headers

Formulas

Hyperlinks

Data validation

Filters

Pivot tables where available

Charts

Graphs

Images where detectable

Merged cells

Dates

Numeric fields

Text fields

Boolean fields

IDs

Environment values

Version values

Test results

Scenario names

Feature names

Task references

Error messages

Performance metrics

Do not assume every Excel file has the same structure.

The parser must inspect the actual workbook and adapt.

5. DYNAMIC EXCEL SELECTION BUILDER

This is one of the most important features.

After uploading an Excel file, automatically generate a Selection Builder.

For example:

Select Information

Environment
[ RI2403FIN ▼ ]

Version
[ Select version ▼ ]

Date
[ Select date ▼ ]

Feature
[ Select feature ▼ ]

Scenario
[ Select scenario ▼ ]

Result
[ Passed / Failed / All ▼ ]

Metric
[ AJAX Load ▼ ]

Output
[ Chart ▼ ]


The available dropdown values must be generated from the uploaded data.

Do NOT create fake dropdown values.

If the Excel file contains:

RI2403FIN
RI2211FIN
RI2205FIN


those should automatically become environment options.

If another file contains additional environments, those should automatically appear after ingestion.

6. DETECT WHAT INFORMATION IS AVAILABLE

The system should intelligently identify what the uploaded Excel file can answer.

For example:

If the file contains:

Environment
Feature
Scenario
Status
Duration
Timestamp


the UI should automatically expose:

Environment
Feature
Scenario
Result
Execution Time
Date/Time


If the file contains:

ajaxLoad
pageLoad
loginTime


the UI should expose:

AJAX Load Time
Page Load Time
Login Time


If the file contains failures:

Error
Exception
Failure Message


the UI should expose:

Failure
Error
Exception


The user should not need to understand the underlying Excel structure.

7. USE THE REGRESSION REQUIREMENTS AS THE INITIAL MODEL

Use the provided Regression Tool Requirements workbook as the initial specification for the application's query and selection model.

The workbook identifies these core regression questions:

Multi-version comparison for a particular batch for a particular day.

Single-version results for a specific feature file.

Single-version comparison for a specific feature file over a specified time period.

Multi-version comparison for a particular batch for a particular day focusing on execution times.

Single-version results for a specific feature file focusing on execution times.

Single-version comparison for a specific feature file over a period focusing on timing.

Single-version comparison of login time over a specified period.

Multi-version comparison of login time over a specified period.

Single-version comparison of average AJAX load time over a specified period.

Multi-version comparison of average AJAX load time over a specified period.

Multi-version comparison of average page-load time over a specified period.

Single-version comparison of average page-load time over a specified period.

Use these as the initial Query Templates.

Do not hard-code the application to twelve queries.

Create a query-template architecture so additional queries can be added later.

8. QUERY BUILDER

Create a visual Query Builder.

Example:

WHAT DO YOU WANT TO INVESTIGATE?

[ Compare environments ]

ENVIRONMENT(S)
☑ RI2403FIN
☑ RI2211FIN
☑ RI2205FIN

FEATURE
[ Select feature ▼ ]

SCENARIO
[ Select scenario ▼ ]

DATE RANGE
[ Start Date ] → [ End Date ]

METRIC
[ Execution Time ▼ ]

RESULT
[ All ▼ ]

GROUP BY
[ Environment ▼ ]

DISPLAY
[ Chart ▼ ]

[ RUN ANALYSIS ]


The available options must change dynamically depending on the selected query.

9. OUTPUT TYPES

Use the output types defined by the requirements workbook.

Support:

Single Number

Example:

Average AJAX Load

1.42 sec
↑ 18% slower


Table

Example:

EnvironmentPassedFailedAvg TimeRI2403FIN24584.2sRI2211FIN238155.1sRI2205FIN24953.9s

Chart

Support:

Line charts

Bar charts

Comparison charts

Trend charts

Timing charts

Pass/fail charts

Environment comparison charts

Scenario List

Show:

Scenario name

Feature

Environment

Status

Duration

Failure reason

Run ID

Narrative

Generate a clear explanation of the result.

Example:

RI2211FIN is showing a higher average AJAX load time than
RI2205FIN over the selected period.

The average increased from 1.2s to 1.8s.

The largest increase occurred on 12 August.

3 scenarios also experienced related failures.


Comprehensive Analysis

Combine:

Summary

Numbers

Charts

Tables

Failed scenarios

Errors

Related tasks

Related XML Helper information

10. XML HELPER SECTION

Create a dedicated XML Helper area.

The XML Helper content will be supplied progressively.

Do not assume the final XML Helper structure yet.

The system must support importing:

XML Helper documentation

XML examples

XML definitions

XML field information

XML mappings

XML configurations

XML screenshots

XML-related tasks

XML-related regression tests

XML-related troubleshooting information

Each item should be searchable.

11. XML HELPER SEARCH

Create a powerful search interface:

Search XML Helper

[ Search by feature, field, XML tag, error, task or scenario... ]

[ SEARCH ]


Search results should identify:

Matching XML Helper documentation

Related feature

XML field/tag

Related regression scenarios

Related failures

Related tasks

Related environments

Related releases

Related team/owner

12. UNIFIED SEARCH / AI ASSISTANT

Create a global assistant.

Example:

Ask Regression Assistant

"What happened to AR Account Allocation
between RI2211FIN and RI2403FIN?"


The assistant should search across the connected data sources.

It should be able to return:

Regression results

Runs

Scenarios

Passed tests

Failed tests

Failure messages

Execution times

Environment information

Environment

Version

Last run

Number of runs

Performance

Login time

AJAX load time

Page load time

Scenario duration

XML Helper

Related XML information

XML configuration

XML fields

XML documentation

Task information

Jira/task references

Task status

Task description

Related failures

Related feature

Related environment

Team information

Responsible team

Owner

Division

Regression team members where available

13. RELATED TASK INTELLIGENCE

When answering a question, automatically search for related tasks.

For example, if a user asks:

Why is RI2211FIN failing?


the system should investigate:

RI2211FIN
    ↓
Failed regression scenarios
    ↓
Failure/error messages
    ↓
Feature
    ↓
Known tasks
    ↓
Related Jira issues
    ↓
XML Helper information
    ↓
Previous occurrences


The answer should include related tasks even when the user did not explicitly ask for them.

14. TASK SEARCH

Create a Tasks section.

Allow filtering by:

Task ID

Feature

Environment

Release

Status

Team

Date

Error

Scenario

Example:

RR-2016

Feature:
Account Name

Environment:
RI2211FIN

Status:
Open

Related Regression Failures:
3

Related Scenarios:
2


15. TEAM / OWNERSHIP

Create a Team section.

The system should associate information with:

Regression team

QA team

Development team

Feature team

Division

Owner

Responsible person

The relationship should look like:

Feature
   ↓
Regression Team
   ↓
Development Team
   ↓
Owner
   ↓
Tasks


If the data does not contain ownership information, do not invent it.

Display:

Owner information unavailable


instead.

16. RELATIONSHIP ENGINE

Create a reusable relationship engine.

Possible relationships:

Environment → Run

Run → Feature

Feature → Scenario

Scenario → Result

Result → Failure

Failure → Error

Error → Task

Task → Team

Team → Owner

Feature → XML Helper

XML Helper → XML Tag

XML Tag → Scenario


This relationship layer is critical because future information will be added.

17. REGRESSION DASHBOARD

Create the main dashboard.

Show:

Environments

RI2403FIN
273 runs

RI2211FIN
270 runs

RI2205FIN
282 runs


Use the uploaded data as the actual source rather than hard-coding these values.

Overall status

PASSING
FAILED
BLOCKED
UNKNOWN


Performance

Average Login Time
Average AJAX Load
Average Page Load
Average Scenario Duration


Trends

Show performance and failure trends.

18. ENVIRONMENT COMPARISON

Create a dedicated comparison screen.

Example:

Compare Environments

RI2403FIN  VS  RI2211FIN  VS  RI2205FIN


Show:

Scenario overlap

Unique scenarios

Passed

Failed

Failure rate

Average duration

Login time

AJAX load

Page load

Common failures

Environment-specific failures

19. VERSION COMPARISON

Allow users to select multiple environments/releases.

Example:

Version A
[ RI2211FIN ]

Version B
[ RI2403FIN ]

Metric
[ Failure Rate ]

Date
[ 01 Aug → 31 Aug ]

[ COMPARE ]


The results should clearly explain differences.

20. TREND ANALYSIS

Allow the user to select:

Environment
Feature
Metric
Date Range


Metrics include:

Login

AJAX Load

Page Load

Scenario Duration

Failure Count

Pass Rate

Display trends using charts.

21. REGRESSION RESULT DETAIL

When the user opens a regression result, show:

Feature
Scenario
Environment
Run ID
Status
Duration
Timestamp
Worker
Execution state
Failure reason


Where available, show the complete execution steps.

The supplied demo data contains regression execution structures with fields such as:

featureName

breakdownName

scenario name

scenario ID

status

steps

keyword

timestamp

duration

workerId

actuallyExecuted

Use these fields as an example of the data model.

22. FAILED TEST DETAIL

For a failed test show:

FAILED

Feature:
...

Scenario:
...

Environment:
...

Failure:
...

Browser/Automation Error:
...

Last Successful Step:
...

Failed Step:
...

Related Tasks:
...

Related XML Helper Information:
...


If browser logs or technical error messages exist, display them separately.

23. DATA INGESTION

Create a Data Import section.

Support:

Excel

JSON

CSV

XML

Regression result exports

Each uploaded source should be classified.

Example:

Source
Regression_Tool_Requirements.xlsx

Type
Excel

Status
Processed

Sheets
6

Records
...

Detected fields
...

Relationships found
...


24. SOURCE MANAGEMENT

Create a Source Registry.

Every imported source should have:

Source name

Source type

Upload date

Version

Data range

Number of records

Status

Last updated

Imported by

Processing errors

This will make the application maintainable.

25. DATA VALIDATION

Before importing data:

Inspect structure.

Detect columns.

Detect data types.

Detect duplicate records.

Detect missing required values.

Detect invalid dates.

Detect unknown environments.

Detect inconsistent statuses.

Detect conflicting identifiers.

Report problems.

Never silently discard information.

26. SMART FIELD MAPPING

If a new Excel file uses different column names, intelligently map equivalent fields.

For example:

Environment
Environment Name
Env
ENV


should be recognized as potentially representing the same concept.

Likewise:

Scenario
Scenario Name
Test Scenario
Test Case


However, mappings must be shown to the user for confirmation when confidence is low.

27. NO DATA FABRICATION

This is mandatory.

The system must never invent:

Test results

Task IDs

Team members

Owners

Failure reasons

XML fields

Environments

Dates

Metrics

If information does not exist, say:

No matching information was found in the connected sources.


28. SEARCH EXPERIENCE

Global search should support:

Feature
Scenario
Environment
Task
Error
XML tag
Version
Date
Run ID
Worker ID


Example:

Search:
"AR Account Allocation"


Results:

FEATURES
1 result

SCENARIOS
12 results

FAILURES
4 results

TASKS
2 results

XML HELPER
6 results

ENVIRONMENTS
3 results


29. RESULT EXPLANATION

Every result should answer:

What happened?

Where?

When?

How often?

Which environments?

Which scenarios?

What changed?

Is there a related task?

Is there XML Helper information?

Which team owns it?

What should the user investigate next?

Do not provide unsupported conclusions.

Clearly separate:

FACT
INFERENCE
UNKNOWN


when necessary.

30. UI DESIGN

Create a professional enterprise QA/engineering interface.

Use:

Clean modern layout

Left navigation

Responsive design

Dashboard cards

Search bar

Filters

Dropdowns

Tabs

Tables

Charts

Detail panels

Side drawers

Modal dialogs

Status badges

Empty states

Loading states

Error states

Suggested navigation:

Dashboard

Ask Assistant

XML Helper

Regression
    Overview
    Runs
    Features
    Scenarios
    Failures
    Performance
    Comparisons
    Trends

Tasks

Teams

Environments

Data Sources

Query Builder

Reports

Settings


31. MAIN USER FLOW

The primary user flow should be:

OPEN APPLICATION
      ↓
DASHBOARD
      ↓
SELECT ENVIRONMENT
      ↓
SELECT INFORMATION TYPE
      ↓
SELECT FILTERS
      ↓
RUN QUERY
      ↓
ANALYZE RESULTS
      ↓
OPEN DETAILS
      ↓
VIEW RELATED INFORMATION
      ↓
VIEW RELATED TASKS
      ↓
VIEW XML HELPER INFORMATION


32. ASK ASSISTANT FLOW

The second major flow:

User asks a question
        ↓
Understand intent
        ↓
Identify entities
        ↓
Search regression data
        ↓
Search XML Helper
        ↓
Search tasks
        ↓
Search environments
        ↓
Search team/ownership
        ↓
Combine evidence
        ↓
Generate answer


Example:

User:
"Did AJAX get slower on RI2211FIN after 12 August?"

Assistant:

YES

Average AJAX Load:
Before 12 Aug: 1.21s
After 12 Aug: 1.68s

Change:
+38%

Affected runs:
...

Affected features:
...

Related failures:
...

Related tasks:
...

XML Helper:
...

Evidence:
...


33. DEMO MODE

The initial application must include a Demo Mode.

Use the supplied demo regression information for:

RI2403FIN

RI2211FIN

RI2205FIN

Clearly label the data:

DEMO DATA


Do not present demo information as live production data.

Include a Demo Data indicator in the header.

34. ENVIRONMENT SWITCHER

Create a global environment selector.

Example:

Environment

[ All Environments ▼ ]

RI2403FIN
RI2211FIN
RI2205FIN


When the user selects an environment, the dashboard and relevant screens should update automatically.

35. DATE FILTER

Create a global date selector.

Support:

Today

Yesterday

Last 7 days

Last 30 days

This month

Custom range

Use actual dates from the data.

36. SAVED QUERIES

Users should be able to save queries.

Example:

My Queries

"RI2211FIN AJAX Performance"
"FIN Release Comparison"
"AR Account Allocation Failures"
"Weekly Regression Health"


Allow:

Save

Rename

Duplicate

Delete

Run

Export

37. REPORT EXPORT

Allow users to export results as:

PDF

Excel

CSV

JSON

Reports should include:

Query

Filters

Date

Environments

Results

Charts

Related tasks

Source information

38. TRACEABILITY

Every answer should be traceable back to its source.

For example:

Source:
Regression Run #12345

Feature:
Financials - Debtors - AR Periodic Processing - AR Account Allocation

Scenario:
Allocate From Larger Amount Success

Environment:
RI2211FIN


Where possible, allow the user to click through to the original record.

39. ARCHITECTURE REQUIREMENTS

Use a modular architecture.

Recommended structure:

/src
  /components
  /pages
  /features
    /dashboard
    /xml-helper
    /regression
    /tasks
    /teams
    /environments
    /queries
    /sources
  /services
    /ingestion
    /search
    /analytics
    /relationships
    /assistant
  /models
  /utils


Keep ingestion logic separate from presentation logic.

Keep data models separate from UI components.

40. FUTURE-PROOF DATA MODEL

Design entities for:

Environment
Version
Release
RegressionRun
Feature
Scenario
ScenarioExecution
Step
Result
Failure
Error
Metric
Task
Team
User
XMLHelperDocument
XMLTag
XMLField
QueryTemplate
SavedQuery
DataSource


Use IDs and relationships rather than relying only on display names.

41. AI ASSISTANT RULES

The assistant must:

Search connected data before answering.

Prefer exact matching records.

Use environment and date filters.

Connect related records.

Include relevant tasks automatically.

Include XML Helper information when relevant.

Explain where information came from.

Never fabricate missing information.

Distinguish facts from assumptions.

Tell the user when there is insufficient data.

42. QUERY TEMPLATE ENGINE

Do not hard-code the twelve initial queries.

Create a configuration structure similar to:

{
  "id": "ajax_performance_comparison",
  "name": "Compare AJAX Load Time",
  "category": "Performance",
  "requiredFilters": [
    "environment",
    "dateRange"
  ],
  "optionalFilters": [
    "feature",
    "scenario"
  ],
  "metrics": [
    "ajaxLoad"
  ],
  "outputs": [
    "singleNumber",
    "table",
    "chart",
    "narrative"
  ]
}


This allows new query types to be added later without rebuilding the front end.

43. DYNAMIC DROPDOWN ENGINE

All dropdowns should be data-driven.

For example:

Environment
→ values from environment data

Feature
→ values from feature data

Scenario
→ values from scenario data

Task
→ values from task data

XML Tag
→ values from XML Helper data

Metric
→ values detected from available metrics


Filters should cascade.

Example:

Environment
   ↓
Feature
   ↓
Scenario
   ↓
Run


Selecting RI2211FIN should only show features/scenarios available for that environment where appropriate.

44. ERROR HANDLING

Create friendly error states.

Examples:

No regression data found.

No matching XML Helper information found.

This environment has no runs for the selected date.

The uploaded Excel file could not be mapped automatically.

This query requires a date range.

No related task was found.


Never show raw technical errors to normal users unless they open a technical details panel.

45. PERFORMANCE

The front end must be designed for potentially large regression datasets.

Use:

Pagination

Virtualized tables where appropriate

Lazy loading

Search indexing

Cached query results

Filtered queries

Debounced search

Background processing indicators

Do not load the entire regression archive into the browser unnecessarily.

46. SECURITY

Design the application so authentication/authorization can be added.

Support future roles:

Admin
Regression Team
QA
Developer
Read Only


Do not expose credentials or API keys in the front end.

47. IMPORTANT DEMO REQUIREMENT

The first implementation must work using the supplied demo data.

The three initial environments are:

RI2403FIN
RI2211FIN
RI2205FIN


Create realistic navigation and interactions using the supplied data.

However:

DO NOT create fake regression results simply to populate the UI.

Where data is unavailable, display an appropriate empty state.

48. ACCEPTANCE CRITERIA

The application is successful when a user can:

Excel

Upload an Excel workbook.

See detected sheets.

See detected fields.

See detected charts/tables where supported.

Select information from dynamically generated dropdowns.

Run an analysis.

Regression

Select RI2403FIN.

Select RI2211FIN.

Select RI2205FIN.

Compare environments.

Search features.

Search scenarios.

Search failures.

View execution details.

View timing information.

Performance

View login timing.

View AJAX load timing.

View page-load timing.

Compare metrics.

View trends.

XML Helper

Search XML Helper information.

Open related documentation.

Connect XML Helper information to features and regression results.

Tasks

Search tasks.

Display related tasks automatically.

Connect tasks to regression failures/features.

Assistant

Ask natural-language questions.

Receive evidence-backed answers.

Display related regression information.

Display related tasks.

Display XML Helper information.

Display related team/ownership information when available.

Extensibility

Add another Excel file.

Add another environment.

Add another query.

Add another XML Helper document.

Add another task source.

WITHOUT requiring a redesign of the application.

49. DO NOT DO THESE THINGS

Do not:

Hard-code the initial three environments permanently.

Hard-code only twelve questions.

Assume all Excel files have the same columns.

Invent missing data.

Invent tasks.

Invent team members.

Invent XML information.

Treat demo data as production data.

Create disconnected pages that cannot share data.

Hide the source of an answer.

Require users to understand database structures.

Make users manually configure every Excel column when automatic mapping is possible.

50. FINAL PRODUCT VISION

The final product should feel like a combination of:

Regression Dashboard + XML Helper + Search Engine + Analytics Platform + QA Knowledge Base + AI Assistant

The user should be able to start with either:

Option A — Structured investigation

Environment
→ Feature
→ Scenario
→ Date
→ Metric
→ Analyze


or:

Option B — Natural language

"Why did RI2211FIN have more failures last week?"


The system then performs the investigation across:

Regression Data
        +
XML Helper
        +
Tasks
        +
Environments
        +
Versions
        +
Performance Metrics
        +
Team Information


and returns one connected, traceable answer.

51. BUILD ORDER

Implement in this order:

Phase 1

Create the complete UI shell and navigation.

Phase 2

Implement Demo Mode using:

RI2403FIN

RI2211FIN

RI2205FIN

Phase 3

Implement Excel ingestion and workbook inspection.

Phase 4

Implement dynamic dropdown/selection generation.

Phase 5

Implement regression search and filtering.

Phase 6

Implement comparison and trend analysis.

Phase 7

Implement XML Helper knowledge management.

Phase 8

Implement task and team relationships.

Phase 9

Implement unified search.

Phase 10

Implement the AI Regression Assistant.

Phase 11

Implement saved queries and reporting.

Phase 12

Implement authentication, permissions, production data connectors, and deployment configuration.

52. MOST IMPORTANT REQUIREMENT

Treat everything provided today as initial source material, not the final system specification.

The system must be built so that I can continue providing:

XML Helper documentation

Excel files

Regression exports

New environments

New releases

New tasks

New queries

New teams

New examples

New requirements

and the application can incorporate them into the same unified information model.

The application must therefore be modular, configurable, extensible, searchable, traceable, and data-driven.

Build the front end as a production-quality foundation rather than a one-off demo.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f829d0d0-632e-4786-adec-4cbe3a04ac1f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
