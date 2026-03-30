import { z } from "zod";
import type { Problem } from "@/types/problem";

export const sectionResultSchema = z.object({
  score: z.number().min(1).max(10),
  feedback: z.string(),
  suggestions: z.array(z.string()),
});

export type SectionResult = z.infer<typeof sectionResultSchema>;

interface ChatMessage {
  role: string;
  content: string;
}

export interface SectionDefinition {
  name: string;
  key: string;
  keywords: string[];
  buildPrompt: (
    problem: Problem,
    markdown: string,
    chatHistory: ChatMessage[]
  ) => string;
}

function extractRelevantChat(
  chatHistory: ChatMessage[],
  keywords: string[]
): string {
  if (chatHistory.length === 0) return "";
  const relevant = chatHistory
    .filter((msg) => {
      const lower = msg.content.toLowerCase();
      return keywords.some((kw) => lower.includes(kw));
    })
    .slice(-10);
  if (relevant.length === 0) return "";
  return (
    "\n\n## Relevant Chat Exchanges\n" +
    relevant.map((m) => `**${m.role}:** ${m.content}`).join("\n")
  );
}

function sectionPreamble(
  sectionName: string,
  problem: Problem,
  markdown: string,
  chatHistory: ChatMessage[],
  keywords: string[]
): string {
  const chatContext = extractRelevantChat(chatHistory, keywords);
  return `You are a principal engineer evaluating ONLY the **${sectionName}** section of a system design interview submission.

## Problem: ${problem.title}

**Functional Requirements:**
${problem.requirements.functional.map((r) => `- ${r}`).join("\n")}

**Non-Functional Requirements:**
${problem.requirements.nonFunctional.map((r) => `- ${r}`).join("\n")}

## Candidate's Full Written Design
${markdown || "(No written design provided)"}
${chatContext}

## Scoring Rubric for ${sectionName}
- 1-3: Missing or fundamentally incorrect
- 4-6: Present but incomplete or has significant gaps
- 7-8: Solid with minor issues
- 9-10: Exceptional, production-ready thinking

## Instructions
- Evaluate ONLY ${sectionName} — ignore other sections
- Be specific — reference actual content from the submission
- Calibrate as a principal engineer: 7+ means genuinely solid
- If this section is completely missing, score it 1
- Provide 2-4 concrete, actionable suggestions`;
}

export const SECTION_DEFINITIONS: SectionDefinition[] = [
  {
    name: "Requirements Clarification",
    key: "requirements",
    keywords: [
      "requirement",
      "functional",
      "non-functional",
      "scope",
      "clarif",
      "use case",
    ],
    buildPrompt: (problem, markdown, chatHistory) =>
      `${sectionPreamble("Requirements Clarification", problem, markdown, chatHistory, ["requirement", "functional", "non-functional", "scope", "use case"])}

## Section-Specific Criteria
- Did they identify correct functional requirements for ${problem.title}?
- Did they identify non-functional requirements (latency, availability, consistency, scale)?
- Did they scope the problem appropriately — not too broad, not too narrow?
- Did they ask clarifying questions or state assumptions?`,
  },
  {
    name: "Capacity Estimation",
    key: "capacity",
    keywords: [
      "dau",
      "rps",
      "storage",
      "bandwidth",
      "estimation",
      "capacity",
      "qps",
      "traffic",
    ],
    buildPrompt: (problem, markdown, chatHistory) =>
      `${sectionPreamble("Capacity Estimation", problem, markdown, chatHistory, ["dau", "rps", "storage", "bandwidth", "estimation", "capacity", "qps"])}

## Section-Specific Criteria
- Are the traffic/user estimates reasonable for ${problem.title}?
- Did they estimate storage, bandwidth, and compute requirements?
- Is the methodology sound (DAU -> RPS -> storage over time)?
- Did they use concrete numbers, not just vague "millions of users"?`,
  },
  {
    name: "API Design",
    key: "api",
    keywords: [
      "api",
      "endpoint",
      "post /",
      "get /",
      "put /",
      "delete /",
      "rest",
      "graphql",
      "grpc",
    ],
    buildPrompt: (problem, markdown, chatHistory) =>
      `${sectionPreamble("API Design", problem, markdown, chatHistory, ["api", "endpoint", "post", "get", "rest", "graphql"])}

## Section-Specific Criteria
- Are the APIs RESTful and well-structured?
- Are HTTP methods used correctly (GET for reads, POST for creates, etc.)?
- Do request/response payloads include necessary fields?
- Is pagination, versioning, or error handling mentioned?
- Are the APIs sufficient to support the core use cases of ${problem.title}?`,
  },
  {
    name: "Database Design",
    key: "database",
    keywords: [
      "schema",
      "table",
      "database",
      "db",
      "sql",
      "nosql",
      "index",
      "partition",
      "primary key",
    ],
    buildPrompt: (problem, markdown, chatHistory) =>
      `${sectionPreamble("Database Design", problem, markdown, chatHistory, ["schema", "table", "database", "db", "sql", "nosql", "index"])}

## Section-Specific Criteria
- Is the data model appropriate for ${problem.title}?
- Was the right type of database chosen (SQL vs NoSQL) with justification?
- Are indexes and access patterns considered?
- Is the schema normalized/denormalized appropriately?
- Are relationships between entities clear?`,
  },
  {
    name: "High-Level Architecture",
    key: "architecture",
    keywords: [
      "load balancer",
      "cache",
      "queue",
      "cdn",
      "service",
      "architecture",
      "component",
      "microservice",
      "gateway",
    ],
    buildPrompt: (problem, markdown, chatHistory) =>
      `${sectionPreamble("High-Level Architecture", problem, markdown, chatHistory, ["load balancer", "cache", "queue", "cdn", "service", "architecture", "component"])}

## Section-Specific Criteria
- Are the major components present and correctly identified for ${problem.title}?
- Is there appropriate separation of concerns?
- Are component interactions and data flow clear?
- Are the right technologies chosen for each component?
- Does the architecture support the stated requirements?`,
  },
  {
    name: "Scalability",
    key: "scalability",
    keywords: [
      "scaling",
      "horizontal",
      "shard",
      "partition",
      "load balanc",
      "cdn",
      "replica",
      "throughput",
    ],
    buildPrompt: (problem, markdown, chatHistory) =>
      `${sectionPreamble("Scalability", problem, markdown, chatHistory, ["scaling", "horizontal", "shard", "partition", "load balanc", "cdn", "replica"])}

## Section-Specific Criteria
- Is horizontal scaling addressed for compute, storage, and caching?
- Are sharding/partitioning strategies discussed where relevant?
- Is load balancing mentioned for distributing traffic?
- Are CDN, caching layers, or read replicas used where appropriate?
- Can the design handle 10x traffic growth?`,
  },
  {
    name: "Reliability",
    key: "reliability",
    keywords: [
      "replication",
      "failover",
      "circuit breaker",
      "retry",
      "redundan",
      "availability",
      "fault tolerance",
      "backup",
    ],
    buildPrompt: (problem, markdown, chatHistory) =>
      `${sectionPreamble("Reliability", problem, markdown, chatHistory, ["replication", "failover", "circuit breaker", "retry", "redundan", "availability", "fault tolerance"])}

## Section-Specific Criteria
- Is data replication/redundancy addressed?
- Are failover strategies mentioned?
- Are circuit breakers, retries, or timeouts discussed?
- Is there a plan for handling partial failures?
- Are monitoring/alerting considerations mentioned?`,
  },
  {
    name: "Deep Dives",
    key: "deep_dives",
    keywords: [
      "sharding",
      "consistent hashing",
      "bottleneck",
      "trade-off",
      "failure mode",
      "edge case",
      "hot spot",
      "race condition",
    ],
    buildPrompt: (problem, markdown, chatHistory) =>
      `${sectionPreamble("Deep Dives", problem, markdown, chatHistory, ["sharding", "consistent hashing", "bottleneck", "trade-off", "failure mode", "edge case"])}

## Section-Specific Criteria
- Did they go beyond surface-level on at least one hard problem?
- Are trade-offs discussed with concrete reasoning (not just listing options)?
- Are edge cases, failure modes, or race conditions addressed?
- Is there depth of understanding shown in at least one technical area?
- Did they explain WHY they chose specific approaches?`,
  },
];
