"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { aiService } from "@/services/ai.service";
import SectionHeader from "@/components/ui/SectionHeader";
import Loader from "@/components/ui/Loader";

export default function ConciergePage() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Welcome to Aurelia. Tell me what you're looking for, and I'll help you find it." },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  async function handleSend(event) {
    event.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const { data } = await aiService.askConcierge(userMessage.text, conversationId);
    setConversationId(data.conversationId);
    setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    setIsLoading(false);
  }

  return (
    <div className="px-6 pt-32 pb-24 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <SectionHeader eyebrow="AI Concierge" title="Ask Aurelia" align="center" className="mx-auto" />

        <div className="mt-12 flex min-h-[420px] flex-col justify-between border border-hairline">
          <div className="flex flex-col gap-4 overflow-y-auto p-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[80%] px-4 py-3 font-body text-sm leading-relaxed ${
                  message.role === "user"
                    ? "self-end bg-gold text-void"
                    : "self-start border border-hairline text-ivory"
                }`}
              >
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className="self-start px-4 py-3">
                <Loader size={16} />
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-3 border-t border-hairline p-4">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="I'm looking for a low-mileage convertible under $200k..."
              className="flex-1 bg-transparent font-body text-sm text-ivory placeholder:text-graphite focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="text-gold transition-opacity hover:opacity-70 disabled:opacity-30"
              disabled={!input.trim() || isLoading}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}