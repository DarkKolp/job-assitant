# Experience Entry Template

## Frontmatter + Markdown (human-friendly, KB-ready)

Start with a small YAML **frontmatter** block (only fields you know), then a concise Markdown body.

```yaml
---
schema: "exp-v1"
id: "exp_<slug>"
title: "Concise Experience Title"
organization: "Org/Client/Project"
role: "Role/Title"
type: "employment | project | research | volunteer | entrepreneurship | education"
location: "City, Country | Remote"
start: "YYYY[-MM]"
end: "YYYY[-MM] | null"
status: "delivered | ongoing | paused | concept-only"
mode: "Delivery | Concept | Mixed"
sources:
  - kind: "pdf | repo | deck | note"
    label: "Name"
    ref: "path_or_url_or_id"
tags: ["domain:product","domain:tokenomics","industry:web3","tech:solidity"]
---
```

### Summary (4–6 sentences)

What it is, for whom, how it works, and why it matters. Add mode tags inline like `[Concept]` where helpful.

### Scope & Ownership (4–8 bullets)

- What you owned/led/delivered.
- Interfaces/partners (teams, stakeholders).

### Outcomes & Evidence (3–7 bullets)

- Use impact framing: problem → action → outcome.
- If conceptual, label bullets as **[Prospective]** or **[Concept]** and focus on _intended_ outcomes.
- Add brief evidence notes: `(Evidence: source | section | ≤20-word quote)`

### Workstreams / Features (3–8 bullets)

Bulleted list of key streams or features. Include `[Delivered]` vs `[Concept]` tags.

### Skills & Stack

**Hard Skills**: List technical/domain skills
**Soft Skills**: List interpersonal/cognitive skills
**Tools**: List technologies and platforms

Add evidence note if skills are derived from the source.

### Risks / Limitations & Mitigations (3–6 bullets)

Short, honest assessment. Use `[Unknown]` if not stated.

### Signals About the Candidate (5–10 bullets)

E.g., systems thinking, research rigor, leadership, communication. Tie to evidence where possible.

### Open Questions (4–8 items)

Targeted clarifications that would strengthen this entry. No blocking—just list them.

---

## JSON-lite (machine-friendly, permissive)

Use **only** fields you actually have. Omit unknowns. Keep it small.

```json
{
  "id": "exp_<slug>",
  "title": "Concise Experience Title",
  "org": "Org/Client/Project",
  "role": "Role/Title",
  "type": "project",
  "mode": "Concept",
  "status": "concept-only",
  "start": "2021",
  "end": null,
  "tags": ["industry:web3","domain:product","domain:tokenomics"],
  "highlights": [
    {"text": "Designed X to solve Y via Z. [Concept]", "evidence": "(Evidence: source | header | ≤20 words)"}
  ],
  "outcomes": [
    {"text": "[Prospective] Intended result or KPI", "evidence": "(Evidence: ...)"}
  ],
  "workstreams": [
    {"name": "Governance design", "delivered": false}
  ],
  "skills": {
    "hard": ["tokenomics","governance"],
    "soft": ["systems thinking"],
    "tools": ["Figma"]
  },
  "signals": [
    {"name": "Systems thinking", "strength": 0.8}
  ],
  "risks": [
    {"text": "Dependency on X", "severity": "high"}
  ],
  "open_questions": [
    "Any shipped prototypes or repos?",
    "Which metrics would define success?"
  ],
  "sources": [
    {"kind": "pdf", "label": "Whitepaper", "ref": "local:/path/file.pdf"}
  ]
}
```

---

## Processing Rules

1. **Don't stop to ask**—if context is thin, proceed with `[Unknown]`/`[Concept]` tags and Open Questions.
2. **Prefer Markdown clarity**; JSON-lite is a compact index for storage/search.
3. **De-duplicate** near-identical bullets; keep one canonical phrasing.
4. **No external browsing** unless explicitly provided as a source.
5. **Be concise**; aim for skimmable bullets.
6. **Evidence format**: `(Evidence: source | section/page/header | ≤20-word quote or paraphrase)`