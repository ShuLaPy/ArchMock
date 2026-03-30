import { FeedbackSection as FeedbackSectionType } from "@/types/feedback";

function getScoreColor(score: number) {
  if (score >= 8) return { bar: "bg-emerald-500", text: "text-emerald-500" };
  if (score >= 6) return { bar: "bg-amber-500", text: "text-amber-500" };
  if (score >= 4) return { bar: "bg-orange-500", text: "text-orange-500" };
  return { bar: "bg-red-500", text: "text-red-500" };
}

export function FeedbackSectionCard({
  section,
}: {
  section: FeedbackSectionType;
}) {
  const { bar, text } = getScoreColor(section.score);

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">{section.name}</h4>
        <span className={`text-xs font-mono ${text}`}>
          {section.score}/10
        </span>
      </div>

      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${bar} rounded-full transition-all duration-500`}
          style={{ width: `${section.score * 10}%` }}
        />
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {section.feedback}
      </p>

      {section.suggestions.length > 0 && (
        <ul className="space-y-1 pt-1">
          {section.suggestions.map((s, i) => (
            <li key={i} className="text-xs text-muted-foreground flex gap-2">
              <span className="shrink-0">-</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
