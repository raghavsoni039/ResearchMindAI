"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  Plus,
  Trash2,
} from "lucide-react";
import { API_BASE_URL, apiFetch } from "@/lib/api";

interface Session {
  id: string;
  title: string;
}

interface Props {
  currentSession: string;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export default function ChatSidebar({

  currentSession,

  onSelect,

  onNew,

}: Props) {

  const [sessions, setSessions] = useState<Session[]>([]);

  async function loadChats() {

    try {

      const response = await apiFetch(
        `${API_BASE_URL}/chat/sessions`
      );

      const data = await response.json();

      setSessions(data.sessions || []);

    } catch (error) {

      console.error(error);

    }

  }

  useEffect(() => {

    loadChats();

  }, []);

  async function deleteChat(id: string) {

    await apiFetch(

      `${API_BASE_URL}/chat/${id}`,

      {

        method: "DELETE",

      }

    );

    loadChats();

  }

  return (

    <aside className="rounded-3xl border bg-card p-6 shadow h-fit sticky top-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="font-bold text-lg">

          Chats

        </h2>

        <button

          onClick={onNew}

          className="rounded-xl bg-primary text-primary-foreground p-2"

        >

          <Plus className="w-5 h-5"/>

        </button>

      </div>

      <div className="space-y-3">

        {sessions.map((chat)=>(

          <div

            key={chat.id}

            className={`

              group

              flex

              justify-between

              items-center

              rounded-xl

              border

              p-3

              cursor-pointer

              transition

              ${
                currentSession===chat.id
                  ? "border-primary bg-primary/10"
                  : "hover:border-primary hover:bg-muted"
              }

            `}

            onClick={()=>onSelect(chat.id)}

          >

            <div className="flex gap-3 items-center">

              <MessageSquare className="w-4 h-4"/>

              <span className="text-sm">

                {chat.title}

              </span>

            </div>

            <button

              onClick={(e)=>{

                e.stopPropagation();

                deleteChat(chat.id);

              }}

              className="opacity-0 group-hover:opacity-100"

            >

              <Trash2 className="w-4 h-4 text-red-500"/>

            </button>

          </div>

        ))}

      </div>

    </aside>

  );

}