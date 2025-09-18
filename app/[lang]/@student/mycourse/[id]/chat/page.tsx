"use client";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();
    if (data.reply) {
      setMessages((prev) => [...prev, data.reply]);
    }
  };

  return (
    <div className="flex flex-col items-center p-8">
      <div className="w-full max-w-lg border p-4 rounded-lg h-[500px] overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === "user" ? "text-blue-600" : "text-green-600"}
          >
            <b>{m.role}:</b> {m.content}
          </div>
        ))}
      </div>
      <div className="mt-4 flex w-full max-w-lg">
        <input
          className="flex-1 border p-2 rounded-l-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 rounded-r-lg"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
