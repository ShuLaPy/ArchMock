import { Problem } from "@/types/problem";

export function getMarkdownTemplate(problem: Problem): string {
  return `# ${problem.title} — System Design

## 1. Requirements Clarification
<!-- Clarify scope before diving in -->
- **In scope**:
- **Out of scope**:
- **Key assumptions**:

## 2. Back-of-Envelope Estimates
| Metric | Value |
|--------|-------|
| Daily Active Users (DAU) | |
| Read/Write ratio | |
| Requests per second (RPS) | |
| Storage per day | |
| Bandwidth | |
| Cache hit rate target | |

## 3. API Contracts
\`\`\`
POST /api/v1/...
  Body: {}
  Response: {}

GET /api/v1/...
  Params: {}
  Response: {}
\`\`\`

## 4. Database Design
### Schema
\`\`\`sql
-- Primary tables

\`\`\`

### Choice of DB
- **Primary store**: (reason)
- **Cache**: (reason)
- **Search index**: (reason)

## 5. High-Level System Design
<!-- Describe your architecture narrative here -->
> Reference your Excalidraw diagram on the right.

**Key components:**
-
-

**Data flow:**
1.
2.

## 6. Deep Dives
### Scalability
-

### Reliability & Fault Tolerance
-

### Caching Strategy
-

### Security Considerations
-

## 7. Trade-offs & Alternatives
| Decision | Chosen | Alternative | Reason |
|----------|--------|-------------|--------|
| | | | |
`;
}
