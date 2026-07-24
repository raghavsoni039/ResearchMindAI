"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import ChatHeader from "@/components/chat/ChatHeader";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWelcome from "@/components/chat/ChatWelcome";
import SuggestedQuestions from "@/components/chat/SuggestedQuestions";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import TypingAnimation from "@/components/chat/TypingAnimation";
import SourceCard from "@/components/chat/SourceCard";
import { API_BASE_URL, apiFetch } from "@/lib/api";

interface Source {
  filename: string;
  page?: number;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  message: string;
  sources?: Source[];
}

export default function ChatPage() {

  const [sessionId, setSessionId] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);

  const [prompt, setPrompt] = useState("");

  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
    useEffect(() => {

    createChat();

  }, []);

  useEffect(() => {

    bottomRef.current?.scrollIntoView({

      behavior: "smooth",

    });

  }, [messages]);

  // --------------------------
  // Create New Chat
  // --------------------------

  async function createChat() {

    try {

      const response = await apiFetch(
        `${API_BASE_URL}/chat/new`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error("Unable to create session");
      }

      setSessionId(data.session.id);

      setMessages([]);

    }

    catch (error) {

      console.error(error);

      toast.error("Unable to create chat.");

    }

  }

  // --------------------------
  // Load Previous Conversation
  // --------------------------

  async function loadConversation(id: string) {

    try {

      const response = await apiFetch(
        `${API_BASE_URL}/chat/${id}`
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error("Unable to load chat");
      }

      setSessionId(id);

      setMessages(

        (data.session.messages || []).map(

          (msg: any, index: number) => ({

            id: msg.id ?? crypto.randomUUID(),

            role: msg.role,

            message: msg.message,

            sources: msg.sources || [],

          })

        )

      );

    }

    catch (error) {

      console.error(error);

      toast.error("Unable to load chat.");

    }

  }
    // --------------------------
  // Send Message
  // --------------------------

  async function sendMessage() {

    if (!prompt.trim()) return;

    const question = prompt;

    const userMessage: Message = {

      id: crypto.randomUUID(),

      role: "user",

      message: question,

    };

    setMessages((old) => [...old, userMessage]);

    setPrompt("");

    setLoading(true);

    try {

      const response = await apiFetch(

        `${API_BASE_URL}/chat/`,

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

          },

          body: JSON.stringify({

            session_id: sessionId,

            question,

          }),

        }

      );

      const data = await response.json();

      if (!response.ok || data.success === false) {

        throw new Error(data.message || "Chat failed");

      }

      const aiMessage: Message = {

        id: crypto.randomUUID(),

        role: "assistant",

        message: data.answer,

        sources: (data.sources || []).map((source: any) => {

          if (typeof source === "string") {

            return {

              filename: source,

              page: 1,

            };

          }

          return {

            filename: source.filename,

            page: source.page,

          };

        }),

      };

      setMessages((old) => [...old, aiMessage]);

    }

    catch (error) {

      console.error(error);

      toast.error("AI Server unavailable.");

    }

    finally {

      setLoading(false);

    }

  }
    return (

    <div className="space-y-10">

      <ChatHeader />

      <div className="grid xl:grid-cols-4 gap-8">

        <ChatSidebar

          currentSession={sessionId}

          onSelect={loadConversation}

          onNew={createChat}

        />

        <div className="xl:col-span-3">

          {messages.length === 0 && (

            <>

              <ChatWelcome />

              <SuggestedQuestions />

            </>

          )}

          <div className="space-y-8 mt-8">

            {messages.map((msg) => (

              <div key={msg.id}>

                <ChatBubble

                  role={msg.role}

                  message={msg.message}

                />

                {msg.role === "assistant" &&
                  msg.sources &&
                  msg.sources.length > 0 && (

                  <div className="grid md:grid-cols-2 gap-4 mt-5">

                    {msg.sources.map((source, index) => (

                      <SourceCard

                        key={`${source.filename}-${source.page ?? 1}-${index}`}

                        filename={source.filename}

                        page={source.page ?? 1}

                      />

                    ))}

                  </div>

                )}

              </div>

            ))}

            {loading && (

              <TypingAnimation />

            )}

            <div ref={bottomRef} />

          </div>

          <div className="mt-10">

            <ChatInput

              value={prompt}

              onChange={setPrompt}

              onSend={sendMessage}

            />

          </div>

        </div>

      </div>

    </div>

  );

}