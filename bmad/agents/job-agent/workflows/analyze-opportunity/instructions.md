# Analyze Job Opportunity - Workflow Instructions

<critical>This workflow analyzes job opportunities against the user's knowledge base</critical>
<critical>You MUST follow the workflow execution engine: {project-root}/bmad/core/tasks/workflow.xml</critical>

<workflow>

<step n="1" goal="Capture job posting information">
<ask>How would you like to provide the job posting?
1. Paste URL
2. Paste job description text
3. Provide file path
</ask>

<action>Store the input method and content</action>
<action>If URL → Note for extraction in next step</action>
<action>If text → Store directly as job_description_raw</action>
<action>If file → Note path for reading in next step</action>
</step>

<step n="2" goal="Extract job description">
<check if="input_method == url">
  <action>Use WebFetch to retrieve job posting from URL</action>
  <action>Extract main content, remove navigation/ads</action>
  <action>Store as job_description_raw</action>
</check>

<check if="input_method == file">
  <action>Read file from provided path</action>
  <action>Store contents as job_description_raw</action>
</check>

<check if="input_method == text">
  <action>job_description_raw already stored from step 1</action>
</check>

<action>Display extracted job description to user</action>
<ask>Does this look correct? [y/n]</ask>
</step>

<step n="3" goal="Parse job metadata">
<action>Analyze job_description_raw and extract:</action>

**Required Fields:**
- job_title: Parse from description or ask user
- company: Parse from description or ask user
- niche: Determine category (backend/frontend/fullstack/data/devops/etc.) or ask user

**Optional Fields (parse or mark as unknown):**
- source_url: From step 1 if URL provided
- salary_range: Look for compensation info
- location: Remote/hybrid/onsite + location
- employment_type: Full-time/contract/etc.

<action>For any unclear fields, ask user for clarification</action>

<action>Generate job_id: {niche}_{job_title_slug}</action>
<action>Example: "backend_senior-go-developer"</action>

<ask>Confirm job details:
- Title: {{job_title}}
- Company: {{company}}
- Niche: {{niche}}
- Job ID: {{job_id}}

Proceed? [y/n/edit]
</ask>
</step>

<step n="4" goal="Extract job requirements">
<action>Parse job_description_raw for requirements:</action>

**Must-Have Skills:**
- Look for: "required", "must have", "essential"
- Extract technical skills, years of experience, certifications
- Store as array: must_have_skills[]

**Nice-to-Have Skills:**
- Look for: "preferred", "nice to have", "bonus", "plus"
- Extract additional skills and qualifications
- Store as array: nice_to_have_skills[]

**Responsibilities:**
- Extract key job responsibilities
- Store as array: key_responsibilities[]

**Benefits/Compensation:**
- Parse salary range, equity, benefits
- Store structured data

<template-output>extracted_requirements</template-output>
</step>

<step n="5" goal="Load knowledge base">
<action>Scan {knowledge_base} folder for all exp_*.md files</action>
<action>Load each file and extract:</action>
- Skills mentioned (technical, tools, soft skills)
- Technologies used
- Project types and domains
- Roles and responsibilities
- Outcomes and achievements
- Status: [Delivered] vs [Concept]

<action>Build comprehensive skill inventory from KB</action>
<action>Categorize: technical_skills[], tools[], domains[], soft_skills[]</action>

<template-output>kb_inventory</template-output>
</step>

<step n="6" goal="Calculate match score">
<action>Compare job requirements vs KB inventory:</action>

**Must-Have Skills Analysis:**
<action for-each="skill in must_have_skills">
  <action>Check if skill exists in KB (exact or similar match)</action>
  <action>If found → Add to matched_must_have[] with evidence (exp_file reference)</action>
  <action>If not found → Add to missing_must_have[]</action>
</action>

**Nice-to-Have Skills Analysis:**
<action for-each="skill in nice_to_have_skills">
  <action>Check if skill exists in KB</action>
  <action>If found → Add to matched_nice_to_have[] with evidence</action>
  <action>If not found → Add to missing_nice_to_have[]</action>
</action>

**Calculate Scores:**
```
must_have_count = length(must_have_skills)
matched_must_have_count = length(matched_must_have)
must_have_percentage = (matched_must_have_count / must_have_count) * 100

nice_to_have_count = length(nice_to_have_skills)
matched_nice_to_have_count = length(matched_nice_to_have)
nice_to_have_percentage = (matched_nice_to_have_count / nice_to_have_count) * 100

# Overall match score (weighted)
match_score = (must_have_percentage * 0.7) + (nice_to_have_percentage * 0.3)
```

<action>Boost score if:</action>
- Recent experience (within last 2 years): +5%
- [Delivered] status (vs [Concept]): +3% per relevant project
- Direct domain match: +5%

<action>Cap final score at 100%</action>

<template-output>match_calculation</template-output>
</step>

<step n="7" goal="Determine tier rating">
<action>Based on match_score, assign tier:</action>

- **Tier 1** (85%+): Perfect fit
- **Tier 2** (70-84%): Strong candidate
- **Tier 3** (55-69%): Reach opportunity
- **Tier 4** (40-54%): Stretch position
- **Tier 5** (<40%): Mismatch

<action>Determine confidence level:</action>
- High: Clear evidence in KB for most requirements
- Medium: Some inferences or related skills
- Low: Significant gaps or unclear matches

<action>Write justification (2-3 sentences explaining tier rating)</action>

<template-output>tier_rating</template-output>
</step>

<step n="8" goal="Create job folder structure">
<action>Create directory: {jobs_database}/{job_id}/</action>
<action>Create subdirectory: {jobs_database}/{job_id}/correspondence/</action>
<action>Note: application/ folder will be created by apply-to-job workflow</action>

<template-output>folder_structure</template-output>
</step>

<step n="9" goal="Generate job metadata file">
<action>Create {jobs_database}/{job_id}/job-metadata.json with full structure:</action>

```json
{
  "job_id": "{{job_id}}",
  "niche": "{{niche}}",
  "title": "{{job_title}}",
  "company": "{{company}}",
  "source_url": "{{source_url or null}}",
  "source_type": "{{source_type}}",

  "dates": {
    "listed": "{{listed_date or null}}",
    "discovered": "{{date}}",
    "deadline": null,
    "applied": null,
    "response": null,
    "interview": null,
    "closed": null
  },

  "classification": {
    "tier": {{tier}},
    "confidence": "{{confidence}}",
    "justification": "{{justification}}",
    "match_score": {{match_score}}
  },

  "requirements": {
    "must_have": {{must_have_skills}},
    "nice_to_have": {{nice_to_have_skills}},
    "missing": {{missing_must_have + missing_nice_to_have}},
    "match_percentage": {{match_score}}
  },

  "compensation": {
    "salary_range": "{{salary_range or unknown}}",
    "equity": "{{equity or unknown}}",
    "benefits": {{benefits_array or []}}
  },

  "status": {
    "stage": "discovered",
    "last_action": "{{date}}: Job analyzed and categorized as Tier {{tier}}",
    "next_action": "{{next_action_suggestion}}",
    "priority": "{{priority}}"
  },

  "flags": {
    "red_flags": [],
    "green_flags": [],
    "notes": ""
  },

  "application": {
    "cv_version": null,
    "cover_letter": false,
    "portfolio_pieces": {{suggested_portfolio_pieces}},
    "custom_materials": []
  }
}
```

<template-output>job_metadata</template-output>
</step>

<step n="10" goal="Save job description">
<action>Create {jobs_database}/{job_id}/job-description.md</action>
<action>Format with markdown headers and sections</action>

```markdown
# {{job_title}} at {{company}}

**Source**: {{source_url or "Provided directly"}}
**Discovered**: {{date}}
**Niche**: {{niche}}

## Overview

{{company_description if available}}

## Position Summary

{{role_summary}}

## Responsibilities

{{key_responsibilities}}

## Requirements

### Must-Have
{{must_have_skills}}

### Nice-to-Have
{{nice_to_have_skills}}

## Compensation & Benefits

{{compensation_details}}

## Original Job Posting

{{job_description_raw}}
```

<template-output>job_description_file</template-output>
</step>

<step n="11" goal="Generate analysis document">
<action>Create {jobs_database}/{job_id}/analysis.md</action>

```markdown
# Job Analysis: {{job_title}} at {{company}}

**Analysis Date**: {{date}}
**Analyst**: {{user_name}}

## Quick Summary

- **Tier Rating**: {{tier}} ({{tier_label}})
- **Match Score**: {{match_score}}%
- **Confidence**: {{confidence}}
- **Recommendation**: {{recommendation}}

## Match Analysis

### Strengths (Skills You Have)

{{for each matched_must_have}}
- ✅ **{{skill}}** - Evidence: {{evidence_reference}}
{{end}}

### Nice-to-Haves You Bring

{{for each matched_nice_to_have}}
- ✅ **{{skill}}** - Evidence: {{evidence_reference}}
{{end}}

### Gaps (Skills to Address)

{{for each missing_must_have}}
- ⚠️ **{{skill}}** - {{gap_severity}}: {{how_to_address}}
{{end}}

## Detailed Assessment

### Must-Have Requirements Match
- **Matched**: {{matched_must_have_count}}/{{must_have_count}} ({{must_have_percentage}}%)
- **Missing**: {{missing_must_have}}

### Nice-to-Have Requirements Match
- **Matched**: {{matched_nice_to_have_count}}/{{nice_to_have_count}} ({{nice_to_have_percentage}}%)

### Relevant Experience

{{for each relevant KB entry}}
**{{exp_title}}** ({{exp_dates}})
- Why relevant: {{relevance_reason}}
- Key overlap: {{overlapping_skills}}
- Status: {{status}}
{{end}}

## Strategic Recommendations

### If Applying
1. {{application_strategy_point_1}}
2. {{application_strategy_point_2}}
3. {{application_strategy_point_3}}

### Portfolio Pieces to Highlight
{{suggested_portfolio_pieces}}

### Areas to Emphasize in Application
{{emphasis_areas}}

### Potential Concerns to Address
{{concerns_to_address}}

## Next Steps

{{if tier == 1 or tier == 2}}
**Recommended Action**: Apply - This is a strong match for your profile.

Suggested next steps:
1. Review and customize CV to highlight: {{top_skills_to_highlight}}
2. Prepare cover letter addressing: {{key_points_to_address}}
3. Select portfolio pieces: {{portfolio_suggestions}}
4. Research company culture and recent news
5. Submit application within {{suggested_timeline}}
{{end}}

{{if tier == 3}}
**Recommended Action**: Consider - This is a reach opportunity.

Before applying:
1. Assess if gaps are critical or can be addressed
2. Determine if company/role aligns with career goals
3. Consider networking approach vs. cold application
{{end}}

{{if tier == 4 or tier == 5}}
**Recommended Action**: Skip - Likely not a good fit.

Rationale: {{skip_rationale}}
Alternative: Look for roles emphasizing {{better_fit_skills}}
{{end}}

---

**Analysis Quality Notes**
- Evidence sources: {{count_kb_entries}} KB entries analyzed
- Match calculation: {{calculation_notes}}
- Assumptions made: {{assumptions}}
```

<template-output>analysis_document</template-output>
</step>

<step n="12" goal="Present summary and next actions">
<action>Display summary to user:</action>

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JOB ANALYSIS COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Position: {{job_title}} at {{company}}
🎯 Tier: {{tier}} - {{tier_label}}
📊 Match Score: {{match_score}}%
🎚️ Confidence: {{confidence}}

✅ Strengths: {{matched_must_have_count}}/{{must_have_count}} must-haves
⚠️ Gaps: {{missing_must_have_count}} missing skills
💼 Status: {{stage}}

📁 Created: {jobs_database}/{{job_id}}/
   ├── job-metadata.json
   ├── job-description.md
   └── analysis.md

{{recommendation}}
```

<check if="tier == 1 or tier == 2">
  <ask>This looks like a {{tier_label}} match. Would you like to proceed with the Application Assistant to tailor your CV and cover letter? [y/n]</ask>

  <check if="user_says_yes">
    <action>Invoke apply-to-job workflow with job_id={{job_id}}</action>
  </check>
</check>

<check if="tier >= 3">
  <action>Suggest: "Consider reviewing the analysis in {{job_id}}/analysis.md before deciding whether to apply."</action>
</check>

</step>

</workflow>
