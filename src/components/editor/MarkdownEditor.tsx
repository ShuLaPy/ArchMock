"use client";

import "@mdxeditor/editor/style.css";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  tablePlugin,
  linkPlugin,
  linkDialogPlugin,
} from "@mdxeditor/editor";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({
  value,
  onChange,
}: MarkdownEditorProps) {
  return (
    <div className="mdx-scroll-host">
      <style>{`
        .mdx-scroll-host {
          height: 100%;
          overflow-y: auto;
        }
        /* Light mode */
        .mdx-scroll-host {
          background: hsl(var(--background, 0 0% 100%));
        }
        .mdx-scroll-host .mdxeditor {
          height: auto;
          background: transparent;
          color: var(--mdx-text, #374151);
          font-family: var(--font-geist-sans), system-ui, sans-serif;
        }
        .mdx-scroll-host [class*="_contentEditable_"] {
          padding: 28px 36px 100px;
          min-height: 100%;
          outline: none;
        }
        .mdx-scroll-host h1 { font-size: 1.625rem; font-weight: 600; margin: 1.5rem 0 0.5rem; color: var(--mdx-heading, #111827); letter-spacing: -0.025em; }
        .mdx-scroll-host h2 { font-size: 1.25rem; font-weight: 600; margin: 1.3rem 0 0.4rem; color: var(--mdx-heading, #111827); letter-spacing: -0.02em; }
        .mdx-scroll-host h3 { font-size: 1.05rem; font-weight: 600; margin: 1rem 0 0.3rem; color: var(--mdx-heading, #1f2937); }
        .mdx-scroll-host h4 { font-size: 0.95rem; font-weight: 600; margin: 0.8rem 0 0.3rem; color: var(--mdx-subhead, #6b7280); }
        .mdx-scroll-host p { margin: 0.4rem 0; line-height: 1.75; color: var(--mdx-text, #374151); font-size: 0.9375rem; }
        .mdx-scroll-host ul, .mdx-scroll-host ol { padding-left: 1.5rem; margin: 0.3rem 0; color: var(--mdx-text, #374151); font-size: 0.9375rem; }
        .mdx-scroll-host li { margin: 0.15rem 0; line-height: 1.7; }
        .mdx-scroll-host blockquote { border-left: 2px solid var(--mdx-border, #e5e7eb); padding-left: 1rem; color: var(--mdx-muted, #6b7280); margin: 0.5rem 0; }
        .mdx-scroll-host code { background: var(--mdx-code-bg, #f3f4f6); color: var(--mdx-code, #6b7280); padding: 1px 5px; border-radius: 3px; font-family: var(--font-geist-mono), monospace; font-size: 0.85em; }
        .mdx-scroll-host pre { background: var(--mdx-code-bg, #f3f4f6) !important; border: 1px solid var(--mdx-border, #e5e7eb); border-radius: 6px; padding: 14px 18px; overflow-x: auto; margin: 0.5rem 0; }
        .mdx-scroll-host pre code { background: transparent; padding: 0; color: var(--mdx-text, #374151); }
        .mdx-scroll-host table { border-collapse: collapse; width: 100%; margin: 0.5rem 0; font-size: 0.875rem; }
        .mdx-scroll-host th { background: var(--mdx-code-bg, #f3f4f6); color: var(--mdx-muted, #6b7280); font-weight: 500; text-align: left; padding: 8px 12px; border: 1px solid var(--mdx-border, #e5e7eb); }
        .mdx-scroll-host td { padding: 8px 12px; border: 1px solid var(--mdx-border, #e5e7eb); color: var(--mdx-text, #374151); }
        .mdx-scroll-host hr { border-color: var(--mdx-border, #e5e7eb); margin: 1.5rem 0; }
        .mdx-scroll-host a { color: var(--mdx-heading, #111827); text-decoration: underline; text-underline-offset: 2px; }
        .mdx-scroll-host strong { color: var(--mdx-heading, #111827); font-weight: 600; }
        .mdx-scroll-host em { color: var(--mdx-muted, #6b7280); }

        /* Dark mode overrides */
        .dark .mdx-scroll-host {
          background: #0a0a0a;
          --mdx-heading: #fafafa;
          --mdx-subhead: #a3a3a3;
          --mdx-text: #a3a3a3;
          --mdx-muted: #525252;
          --mdx-border: #262626;
          --mdx-code-bg: #171717;
          --mdx-code: #a3a3a3;
        }
        .dark .mdx-scroll-host .mdxeditor {
          color: #d4d4d4;
        }
        .dark .mdx-scroll-host [class*="_contentEditable_"] {
          caret-color: #d4d4d4;
        }
        .dark .mdx-scroll-host p { color: #737373; }
        .dark .mdx-scroll-host ul, .dark .mdx-scroll-host ol { color: #737373; }
        .dark .mdx-scroll-host h1 { color: #fafafa; }
        .dark .mdx-scroll-host h2 { color: #e5e5e5; }
        .dark .mdx-scroll-host h3 { color: #d4d4d4; }
        .dark .mdx-scroll-host h4 { color: #a3a3a3; }
        .dark .mdx-scroll-host a { color: #d4d4d4; }
        .dark .mdx-scroll-host strong { color: #e5e5e5; }
        .dark .mdx-scroll-host em { color: #a3a3a3; }
      `}</style>
      <MDXEditor
        markdown={value}
        onChange={onChange}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          tablePlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "sql" }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              sql: "SQL",
              js: "JavaScript",
              ts: "TypeScript",
              python: "Python",
              bash: "Bash",
              json: "JSON",
              yaml: "YAML",
              "": "Plain",
            },
          }),
          markdownShortcutPlugin(),
        ]}
      />
    </div>
  );
}
