"use client";

import { useState, useRef, useEffect, useCallback, FormEvent, KeyboardEvent } from "react";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { TYPE_LABEL, type DraftType } from "@/lib/drafts";

interface AiChatPanelProps {
  type: DraftType;
  title: string;
  body: string;
}

/**
 * Safely repairs unclosed Markdown formatting syntax during active streaming
 * (e.g. unclosed code blocks, bold/italic markers) to prevent layout breakages.
 */
function repairStreamingMarkdown(text: string): string {
  if (!text) return "";

  let repaired = text;

  // Repair unclosed code blocks (odd number of ```)
  const codeBlockMatches = repaired.match(/```/g);
  if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
    repaired += "\n```";
  }

  // Repair unclosed bold markers (odd number of **)
  const boldMatches = repaired.match(/\*\*/g);
  if (boldMatches && boldMatches.length % 2 !== 0) {
    repaired += "**";
  }

  return repaired;
}

/**
 * Lightweight, streaming-safe Markdown renderer.
 * Renders paragraphs, lists, headings, and code blocks safely without breaking on partial tokens.
 */
function StreamMarkdown({ content }: { content: string }) {
  const safeContent = repairStreamingMarkdown(content);
  const blocks = safeContent.split("\n\n");

  return (
    <div className="space-y-2.5 text-xs leading-relaxed text-ink">
      {blocks.map((block, blockIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Code block
        if (trimmed.startsWith("```")) {
          const lines = trimmed.split("\n");
          const lang = lines[0].replace("```", "").trim();
          const codeText = lines.slice(1, lines.length - (lines[lines.length - 1] === "```" ? 1 : 0)).join("\n");
          return (
            <div key={blockIdx} className="my-2 rounded bg-paper p-2.5 font-mono text-[11px] border border-line overflow-x-auto">
              {lang && <div className="text-[10px] text-ink-soft mb-1 uppercase font-semibold">{lang}</div>}
              <pre className="whitespace-pre-wrap break-words">{codeText}</pre>
            </div>
          );
        }

        // Headings
        if (trimmed.startsWith("# ")) {
          return <h3 key={blockIdx} className="font-display font-semibold text-sm text-ink">{trimmed.replace(/^#\s+/, "")}</h3>;
        }
        if (trimmed.startsWith("## ")) {
          return <h4 key={blockIdx} className="font-display font-semibold text-xs text-ink">{trimmed.replace(/^##\s+/, "")}</h4>;
        }
        if (trimmed.startsWith("### ")) {
          return <h5 key={blockIdx} className="font-display font-medium text-xs text-ink">{trimmed.replace(/^###\s+/, "")}</h5>;
        }

        // Bulleted lists
        if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
          const items = trimmed.split("\n").filter((l) => l.trim().startsWith("* ") || l.trim().startsWith("- "));
          return (
            <ul key={blockIdx} className="list-disc list-inside space-y-1 pl-1">
              {items.map((item, i) => (
                <li key={i}>{formatInlineMarkdown(item.replace(/^[*|-]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }

        // Numbered lists
        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split("\n").filter((l) => /^\d+\.\s/.test(l.trim()));
          return (
            <ol key={blockIdx} className="list-decimal list-inside space-y-1 pl-1">
              {items.map((item, i) => (
                <li key={i}>{formatInlineMarkdown(item.replace(/^\d+\.\s+/, ""))}</li>
              ))}
            </ol>
          );
        }

        // Blockquotes
        if (trimmed.startsWith("> ")) {
          return (
            <blockquote key={blockIdx} className="border-l-2 border-teal pl-2.5 py-0.5 italic text-ink-soft bg-paper/40 rounded-r">
              {formatInlineMarkdown(trimmed.replace(/^>\s+/, ""))}
            </blockquote>
          );
        }

        // Default paragraph
        return <p key={blockIdx}>{formatInlineMarkdown(trimmed)}</p>;
      })}
    </div>
  );
}

/**
 * Formats inline bold (**text**) and code (`text`) elements safely.
 */
function formatInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return <strong key={index} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code key={index} className="rounded bg-paper px-1 py-0.5 font-mono text-[11px] border border-line">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

/**
 * Extracts plain text from a UIMessage object.
 */
function getMessageText(message: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!message.parts || message.parts.length === 0) return "";
  return message.parts
    .filter((p) => p.type === "text" && typeof p.text === "string")
    .map((p) => p.text as string)
    .join("");
}

export function AiChatPanel({ type, title, body }: AiChatPanelProps) {
  const [input, setInput] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const { messages, status, sendMessage, stop, error, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Check scroll position to release or pin auto-scroll
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    setIsAtBottom(distanceFromBottom <= 25);
  }, []);

  // Auto-scroll to bottom if pinned
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isAtBottom) return;
    container.scrollTop = container.scrollHeight;
  }, [messages, status, isAtBottom]);

  const scrollToBottom = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    setIsAtBottom(true);
  };

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setInput("");
    setIsAtBottom(true);

    sendMessage(
      { text: trimmed },
      {
        body: { type, title, body },
      }
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  const typeLabel = TYPE_LABEL[type] || type;

  return (
    <div className="flex flex-col h-[520px] max-h-[75vh] w-full text-xs">
      {/* Subheader context bar */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-line">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-ink-soft">
          <span className="h-2 w-2 rounded-full bg-teal" aria-hidden="true" />
          <span>Context: <strong className="text-ink font-medium">{typeLabel}</strong></span>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={handleClearHistory}
            className="text-ink-soft hover:text-ink font-mono text-[10px] underline underline-offset-2 transition-colors"
          >
            Clear chat
          </button>
        )}
      </div>

      {/* Message Thread Scroll Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="relative flex-1 overflow-y-auto pr-1 space-y-3 scroll-smooth"
        aria-live="polite"
        aria-label="Chat history"
      >
        {messages.length === 0 && (
          <div className="border border-dashed border-line rounded-lg p-4 text-center bg-paper/50 my-auto">
            <p className="font-display font-medium text-ink text-xs mb-1">
              Editorial Co-Pilot Ready
            </p>
            <p className="text-ink-soft text-[11px] leading-relaxed">
              Ask for feedback on your {typeLabel.toLowerCase()}, suggest catchy titles, or refine tone and structure.
            </p>
          </div>
        )}

        {messages.map((m) => {
          const text = getMessageText(m);
          const isUser = m.role === "user";

          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[90%] rounded-lg p-3 border transition-colors ${
                  isUser
                    ? "bg-paper border-line text-ink"
                    : "bg-highlight-soft border-highlight/40 text-ink shadow-2xs"
                }`}
              >
                <div className="font-mono text-[10px] text-ink-soft mb-1 flex items-center gap-1">
                  {isUser ? (
                    <span>You</span>
                  ) : (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden="true" />
                      <span className="font-semibold text-ink">Gemini Assistant</span>
                    </>
                  )}
                </div>

                {text ? (
                  <StreamMarkdown content={text} />
                ) : (
                  /* Smooth inline thinking state inside assistant bubble if text is not yet streamed */
                  !isUser && (
                    <div className="flex items-center gap-1.5 py-1 text-ink-soft font-mono text-[11px]">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal animate-ping" />
                      <span>Thinking...</span>
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}

        {/* Global Submitted Thinking State before assistant message is created */}
        {status === "submitted" && (messages.length === 0 || messages[messages.length - 1].role === "user") && (
          <div className="flex flex-col items-start">
            <div className="max-w-[90%] rounded-lg p-3 border bg-highlight-soft border-highlight/40 text-ink shadow-2xs">
              <div className="font-mono text-[10px] text-ink-soft mb-1 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden="true" />
                <span className="font-semibold text-ink">Gemini Assistant</span>
              </div>
              <div className="flex items-center gap-2 py-1 text-ink-soft font-mono text-[11px]">
                <span className="h-2 w-2 rounded-full bg-teal animate-pulse" />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}

        {/* Floating "Jump to latest" button when user scrolls up */}
        {!isAtBottom && (
          <div className="sticky bottom-2 flex justify-center z-10">
            <button
              type="button"
              onClick={scrollToBottom}
              className="bg-ink text-paper hover:bg-teal shadow-md rounded-full px-3 py-1 text-[11px] font-medium transition-all flex items-center gap-1"
            >
              <span>Jump to latest</span>
              <span aria-hidden="true">↓</span>
            </button>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mt-2 border-l-4 border-danger/80 bg-paper-raised p-2.5 rounded text-[11px] text-danger">
          <span className="font-semibold">Error:</span> {error.message || "Failed to generate AI response."}
        </div>
      )}

      {/* Input Form & Action Bar */}
      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2 pt-2.5 border-t border-line">
        <div className="relative flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask about this ${typeLabel.toLowerCase()}… (Shift+Enter for new line)`}
            aria-label="Message to AI assistant"
            rows={2}
            className="w-full resize-none rounded-lg border border-line bg-paper p-2.5 pr-14 text-xs placeholder:text-ink-soft/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            {isLoading ? (
              <button
                type="button"
                onClick={stop}
                className="bg-danger text-paper hover:bg-danger/90 rounded px-2 py-1.5 text-[11px] font-medium transition-colors flex items-center gap-1"
                aria-label="Stop generation"
              >
                <span className="h-2 w-2 bg-paper rounded-xs" aria-hidden="true" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-ink text-paper hover:bg-teal disabled:opacity-40 rounded px-2.5 py-1.5 text-[11px] font-medium transition-colors"
                aria-label="Send message"
              >
                Send
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] text-ink-soft font-mono">
          <span>Press Enter to send</span>
          {isLoading && <span className="text-teal font-medium animate-pulse">Streaming response…</span>}
        </div>
      </form>
    </div>
  );
}
