export interface MarkdownSection {
  label: string;
  startIndex: number;
  endIndex: number;
}

/**
 * Parse markdown into sections by splitting on `## ` heading boundaries.
 * Returns sections with their label and character offsets.
 */
export function parseMarkdownSections(md: string): MarkdownSection[] {
  const sections: MarkdownSection[] = [];
  const regex = /^## (.+)$/gm;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(md)) !== null) {
    if (sections.length > 0) {
      sections[sections.length - 1].endIndex = match.index;
    }
    sections.push({
      label: match[1].trim(),
      startIndex: match.index,
      endIndex: md.length,
    });
  }

  return sections;
}

/**
 * Insert text at the end of a named section (just before the next `## ` heading or EOF).
 * Trims trailing whitespace in the section before appending.
 */
export function insertIntoSection(
  md: string,
  sectionLabel: string,
  text: string
): string {
  const sections = parseMarkdownSections(md);
  const section = sections.find((s) => s.label === sectionLabel);
  if (!section) return md + "\n" + text;

  // Find insertion point: end of section content, before trailing newlines
  const sectionContent = md.slice(section.startIndex, section.endIndex);
  const trimmedEnd = sectionContent.trimEnd().length;
  const insertAt = section.startIndex + trimmedEnd;

  return md.slice(0, insertAt) + "\n" + text + md.slice(insertAt);
}
