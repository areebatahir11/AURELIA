"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { aiService } from "@/services/ai.service";
import SectionHeader from "@/components/ui/SectionHeader";
import Loader from "@/components/ui/Loader";

const TYPING_SPEED_MS = 15;

export default function ConciergePage() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Welcome to Aurelia. Tell me what you're looking for, and I'll help you find it." },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const scrollRef = useRef(null);
  const typingIntervalRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

  function typeOutMessage(fullText) {
    setIsTyping(true);
    setMessages((prev) => [...prev, { role: "assistant", text: "" }]);

    let charIndex = 0;
    typingIntervalRef.current = setInterval(() => {
      charIndex += 1;
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", text: fullText.slice(0, charIndex) };
        return updated;
      });

      if (charIndex >= fullText.length) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
        setIsTyping(false);
      }
    }, TYPING_SPEED_MS);
  }

  async function handleSend(event) {
    event.preventDefault();
    if (!input.trim() || isLoading || isTyping) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data } = await aiService.askConcierge(userMessage.text, conversationId);
      setConversationId(data.conversationId);
      setIsLoading(false);
      typeOutMessage(data.reply);
    } catch (error) {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Something went wrong reaching the concierge. Please try again." },
      ]);
    }
  }

  return (
    <div className="px-6 pt-32 pb-24 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <SectionHeader eyebrow="AI Concierge" title="Ask Aurelia" align="center" className="mx-auto" />

        <div className="mt-12 flex min-h-[420px] flex-col justify-between border border-hairline">
          <div className="flex flex-col gap-4 overflow-y-auto p-6">
            {messages.map((message, index) => {
              const isLastAssistantTyping =
                isTyping && index === messages.length - 1 && message.role === "assistant";

              return (
                <div
                  key={index}
                  className={`max-w-[80%] whitespace-pre-wrap px-4 py-3 font-body text-sm leading-relaxed ${
                    message.role === "user"
                      ? "self-end bg-gold text-void"
                      : "self-start border border-hairline text-ivory"
                  }`}
                >
                  {message.text}
                  {isLastAssistantTyping && (
                    <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-gold align-middle">
                      &nbsp;
                    </span>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="self-start px-4 py-3">
                <Loader size={16} />
              </div>
            )}

            <div ref={scrollRef} />
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-3 border-t border-hairline p-4">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="I'm looking for a low-mileage convertible under $200k..."
              className="flex-1 bg-transparent font-body text-sm text-ivory placeholder:text-graphite focus:outline-none"
              disabled={isLoading || isTyping}
            />
            <button
              type="submit"
              aria-label="Send message"
              className="text-gold transition-opacity hover:opacity-70 disabled:opacity-30"
              disabled={!input.trim() || isLoading || isTyping}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}