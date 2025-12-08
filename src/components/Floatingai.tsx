"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface Message {
  from: "user" | "bot";
  text: string;
}

export default function FloatingAI() {
  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Halo! Aku PustakaBot. Ada yang bisa dibantu?" },
  ]);
  const [input, setInput] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // scroll otomatis ke bawah setiap kali ada pesan baru
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // kirim pesan manual
  const handleSend = (): void => {
    if (!input.trim()) return;
    const newMessages: Message[] = [
      ...messages,
      { from: "user", text: input },
      { from: "bot", text: "Baik! Saya akan bantu menelusuri informasi itu." },
    ];
    setMessages(newMessages);
    setInput("");
  };

  const mainMenu = [
    { icon: "ℹ️", label: "Informasi Layanan" },
    { icon: "🔍", label: "Pencarian Koleksi Buku" },
    { icon: "🪪", label: "Pendaftaran Anggota" },
    { icon: "💻", label: "Layanan Digital" },
    { icon: "📅", label: "Agenda Buku" },
    { icon: "📞", label: "Bantuan & Pengaduan" },
  ];

  const handleMenuClick = (label: string): void => {
    const newMessages: Message[] = [
      ...messages,
      { from: "user", text: label },
      {
        from: "bot",
        text: `Baik! Saya akan bantu menelusuri informasi: ${label}`,
      },
    ];
    setMessages(newMessages);
  };

  return (
    <>
      {/* Tombol AI */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
        {!open && (
          <motion.div
            initial={{ opacity: 0, x: 10, y: -10 }}
            animate={{
              opacity: 1,
              x: [10, 5, 10],
              y: [-10, -8, -10],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-2 right-[40px] bg-white text-blue-950 text-sm font-medium px-3 py-2 rounded-lg shadow-lg border border-blue-200 relative"
          >
            Tanya PustakaBot!
            <div className="absolute -bottom-[6px] right-4 w-3 h-3 bg-white border-r border-b border-blue-200 rotate-45"></div>
          </motion.div>
        )}

        <motion.button
          onClick={() => setOpen(!open)}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-full hover:scale-110 transition-all"
        >
          <motion.img
            src="/bot.png"
            alt="AI Assistant"
            className="w-20 h-20 object-contain"
            animate={{
              y: [0, -8, 0],
              rotate: [0, 4, -4, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.button>
      </div>

      {/* Chatbox */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-28 right-6 w-80 max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-blue-200 p-4 z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-blue-950">
              Assistant Cerdas Perpustakaan 🤖
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-red-500"
            >
              ✕
            </button>
          </div>

          {/* Menu selalu tampil di atas */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {mainMenu.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuClick(item.label)}
                className="flex items-center justify-center gap-1 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-950 text-xs font-medium px-2 py-2 rounded-lg transition-all"
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </div>

          {/* Area chat (auto-scroll, fleksibel tinggi) */}
          <div className="flex-1 overflow-y-auto text-gray-700 text-sm mb-3 p-2 bg-gray-50 rounded-lg scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100 min-h-[100px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`my-2 flex ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg ${
                    msg.from === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white border border-blue-200"
                  } max-w-[80%] break-words`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pesan..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 border border-blue-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 rounded-lg text-sm"
            >
              Kirim
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}
