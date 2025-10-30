"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Monitor } from "lucide-react";

interface TaskbarProps {
  windows: { id: number; title: string; open: boolean }[];
  toggleWindow: (id: number) => void;
}

export default function Taskbar({ windows, toggleWindow }: TaskbarProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="
        fixed bottom-0 left-0 right-0
        bg-gray-900/70 backdrop-blur-md border-t border-gray-700
        flex items-center justify-between px-4 py-2
        text-gray-200 select-none
      "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Left side — Only "This PC" window */}
      <div className="flex items-center gap-2">
        {windows
          .filter((w) => w.title === "This PC")
          .map((w) => (
            <button
              key={w.id}
              onClick={() => toggleWindow(w.id)}
              className={`p-2 rounded transition-colors ${
                w.open
                  ? "bg-gray-700/70 border border-gray-600"
                  : "hover:bg-gray-700/40"
              }`}
            >
              <Monitor size={18} />
            </button>
          ))}
        <a
          href="https://github.com/Carvalho286"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded hover:bg-gray-700/60"
        >
          <Github size={18} />
        </a>
        <a
          href="https://www.linkedin.com/in/carvalho286"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded hover:bg-gray-700/60"
        >
          <Linkedin size={18} />
        </a>
        <a
          href="mailto:carvalhomiguel286@gmail.com"
          className="p-2 rounded hover:bg-gray-700/60"
          aria-label="Email"
        >
          <Mail size={18} />
        </a>

      </div>

      {/* Right side — Clock */}
      <div className="flex items-center gap-4">
        <div className="text-sm font-medium">{time}</div>
      </div>
    </motion.div>
  );
}
