# Analyze Opportunity Workflow - Validation Checklist

## Pre-Flight Checks

- [ ] Knowledge base exists at {project-root}/About-me/Projects/
- [ ] At least one exp_*.md file exists in knowledge base
- [ ] Jobs database folder exists at {project-root}/Jobs/
- [ ] Module config loaded successfully

## Input Validation

- [ ] Job posting source captured (URL, text, or file)
- [ ] Job description extracted successfully
- [ ] Job title identified or provided by user
- [ ] Company name identified or provided by user
- [ ] Niche/category determined
- [ ] Job ID generated in format: {niche}_{job_title_slug}

## Requirements Extraction

- [ ] Must-have skills list populated (minimum 1 item)
- [ ] Nice-to-have skills list populated (can be empty)
- [ ] Key responsibilities extracted
- [ ] Compensation details captured (or marked as unknown)

## Knowledge Base Analysis

- [ ] All exp_*.md files loaded from knowledge base
- [ ] Skills inventory built from KB entries
- [ ] Technical skills categorized
- [ ] Tools and technologies cataloged
- [ ] Project domains identified
- [ ] Delivery status noted ([Delivered] vs [Concept])

## Match Calculation

- [ ] Must-have skills compared against KB
- [ ] Matched must-haves identified with evidence references
- [ ] Missing must-haves identified
- [ ] Nice-to-have skills compared against KB
- [ ] Match score calculated (0-100%)
- [ ] Score adjustments applied (recency, delivery status, domain match)
- [ ] Final match score within valid range (0-100%)

## Tier Rating

- [ ] Tier assigned based on match score (1-5)
- [ ] Confidence level determined (high/medium/low)
- [ ] Justification written (2-3 sentences minimum)
- [ ] Tier aligns with score thresholds:
  - Tier 1: 85%+
  - Tier 2: 70-84%
  - Tier 3: 55-69%
  - Tier 4: 40-54%
  - Tier 5: <40%

## Folder Structure

- [ ] Job folder created: {jobs_database}/{job_id}/
- [ ] Correspondence subfolder created: {jobs_database}/{job_id}/correspondence/
- [ ] Folder path accessible and valid
- [ ] No naming conflicts with existing job folders

## Metadata File

- [ ] job-metadata.json created
- [ ] All required fields populated:
  - job_id
  - niche
  - title
  - company
  - dates.discovered
  - classification (tier, confidence, justification, match_score)
  - requirements (must_have, nice_to_have, missing, match_percentage)
  - status (stage, last_action, next_action, priority)
- [ ] Valid JSON syntax
- [ ] Match score matches tier rating
- [ ] Dates in YYYY-MM-DD format

## Job Description File

- [ ] job-description.md created
- [ ] Contains source information
- [ ] Position summary included
- [ ] Responsibilities listed
- [ ] Requirements sections populated
- [ ] Original job posting preserved
- [ ] Markdown formatting valid

## Analysis Document

- [ ] analysis.md created
- [ ] Quick summary section complete
- [ ] Strengths listed with evidence references
- [ ] Gaps identified with severity and mitigation
- [ ] Detailed assessment provided
- [ ] Strategic recommendations included
- [ ] Next steps appropriate for tier rating
- [ ] Relevant portfolio pieces suggested
- [ ] KB entries referenced correctly

## Output Quality

- [ ] All evidence references valid (point to actual KB files)
- [ ] Skills mentioned exist in job posting
- [ ] No hallucinated capabilities (all from KB)
- [ ] Gaps are actual gaps (not in KB)
- [ ] Recommendations actionable and specific
- [ ] Tone matches user preference (pragmatic, direct)

## User Experience

- [ ] Summary presented to user
- [ ] Key metrics clearly displayed (tier, score, matches, gaps)
- [ ] Next action suggested based on tier
- [ ] If Tier 1-2: Offered application assistance
- [ ] User can easily find created files
- [ ] Analysis is skimmable and actionable

## Edge Cases Handled

- [ ] No must-have skills identified → Ask user to specify
- [ ] Empty knowledge base → Warn user, suggest creating entries
- [ ] Duplicate job_id → Append number or ask user
- [ ] Missing compensation info → Mark as "unknown"
- [ ] Unclear requirements → Flag for manual review
- [ ] URL fetch fails → Fallback to manual paste
- [ ] File read fails → Ask for alternate source

## Final Validation

- [ ] All three files exist in job folder:
  - job-metadata.json
  - job-description.md
  - analysis.md
- [ ] Files are non-empty and properly formatted
- [ ] Match score is defensible based on KB evidence
- [ ] Tier rating makes sense for match score
- [ ] User understands next steps
- [ ] Workflow completed successfully

## Post-Workflow Cleanup

- [ ] Temporary variables cleared
- [ ] No leftover files in incorrect locations
- [ ] User session context preserved for next command
- [ ] Workflow ready to run again for another job

---

## Success Criteria

**Workflow is successful if:**
1. Job folder created with all required files
2. Match score accurately reflects KB vs requirements
3. Tier rating justified and appropriate
4. User can immediately understand if this is a good fit
5. Next action is clear (apply / consider / skip)
6. Evidence is traceable back to KB entries
7. No false claims about user's capabilities

**Workflow has failed if:**
1. Files missing or corrupted
2. Match score doesn't match evidence
3. Tier rating contradicts match score
4. User confused about recommendation
5. Evidence references non-existent KB entries
6. Critical job requirements missed
7. User has to manually fix data
