"use client";

import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { motion } from "framer-motion";
import Taskbar from "@/components/Taskbar";
import projectsData from "@/data/projects.json";
import { Monitor, FolderOpen, User, Image as ImageIcon } from "lucide-react";

interface WindowPos {
  x?: number;
  y?: number;
}

interface Project {
  name: string;
  github: string;
  live?: string;
  photos?: string[];
}

interface FolderItem {
  name: string;
  type: "folder" | "file";
  preview?: string;
}

type PCFile = FolderItem & WindowPos;
type ProjectWithPos = Project & WindowPos;

export default function Home() {
  const [mounted, setMounted] = useState(false);

  const [windows, setWindows] = useState([
    {
      id: 3,
      title: "This PC",
      x: 220,
      y: 120,
      width: 520,
      height: 360,
      open: false,
    },
    {
      id: 1,
      title: "Projects",
      x: 100,
      y: 80,
      width: 500,
      height: 400,
      open: false,
    },
    {
      id: 2,
      title: "About",
      x: 160,
      y: 160,
      width: 400,
      height: 250,
      open: false,
    },
  ]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedPCItem, setSelectedPCItem] = useState<FolderItem | null>(null);
  const [galleryProject, setGalleryProject] = useState<ProjectWithPos | null>(
    null
  );
  const [openTextFile, setOpenTextFile] = useState<PCFile | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [windowOffset, setWindowOffset] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const photos = galleryProject?.photos ?? [];
      if (lightboxIndex !== null && photos.length) {
        if (e.key === "ArrowRight") {
          setLightboxIndex((prev) =>
            (prev ?? 0) < photos.length - 1 ? (prev ?? 0) + 1 : 0
          );
        } else if (e.key === "ArrowLeft") {
          setLightboxIndex((prev) =>
            (prev ?? 0) > 0 ? (prev ?? 0) - 1 : photos.length - 1
          );
        } else if (e.key === "Escape") {
          setLightboxIndex(null);
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, galleryProject]);

  if (!mounted) return null;

  const getNextWindowPosition = (baseX: number, baseY: number) => {
    if (typeof window === "undefined") return { x: baseX, y: baseY };

    const offsetStep = 40;
    const pad = 24;

    let nextX = baseX + windowOffset;
    let nextY = baseY + windowOffset;

    const maxX = Math.max(pad, window.innerWidth - 320);
    const maxY = Math.max(pad, window.innerHeight - 220);
    nextX = Math.min(Math.max(pad, nextX), maxX);
    nextY = Math.min(Math.max(pad, nextY), maxY);

    setWindowOffset((prev) => (prev + offsetStep) % 200);

    return { x: nextX, y: nextY };
  };

  const toggleWindow = (id: number) => {
    setWindows((ws) =>
      ws.map((w) => {
        if (w.id === id && w.open) {
          if (w.title === "Projects") setSelectedProject(null);
          if (w.title === "This PC") setSelectedPCItem(null);
        }
        return w.id === id ? { ...w, open: !w.open } : w;
      })
    );
  };

  const openGallery = (project: Project) => {
    setGalleryProject(project);
  };

  const closeGallery = () => {
    setGalleryProject(null);
  };

  const folderItems: FolderItem[] = [
    {
      name: "Documents",
      type: "folder",
      preview: "Some personal documents and notes.",
    },
    {
      name: "Pictures",
      type: "folder",
      preview: "Photos from trips and events.",
    },
    {
      name: "Downloads",
      type: "folder",
      preview: "Files you downloaded from the web.",
    },
    {
      name: "Readme.txt",
      type: "file",
      preview: "This is an example readme file.",
    },
  ];

  const getDesktopIcon = (title: string) => {
    switch (title) {
      case "Projects":
        return <FolderOpen size={44} />;
      case "About":
        return <User size={44} />;
      case "This PC":
        return <Monitor size={44} />;
      default:
        return <FolderOpen size={44} />;
    }
  };

  const formatTextWithBold = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      const match = line.match(/^(Name|Location|Role|Hobbies):/);
      if (match) {
        const label = match[0];
        const rest = line.replace(label, "").trim();
        return (
          <div key={i}>
            <strong>{label}</strong> {rest}
          </div>
        );
      }
      return <div key={i}>{line}</div>;
    });
  };

  return (
    <main className="h-screen w-screen bg-gradient-to-br from-gray-900 to-black relative overflow-hidden select-none">
      {/* Desktop icons */}
      <div className="absolute left-6 top-6 flex flex-col gap-6">
        {windows
          .sort((a, b) =>
            a.title === "This PC" ? -1 : b.title === "This PC" ? 1 : 0
          )
          .map((w) => (
            <button
              key={w.id}
              onDoubleClick={() => toggleWindow(w.id)}
              className="flex flex-col items-center text-sm text-gray-300 hover:text-white transition-all duration-150"
            >
              <motion.div whileHover={{ scale: 1.1 }} className="text-gray-100">
                {getDesktopIcon(w.title)}
              </motion.div>
              <span className="truncate mt-1">{w.title}</span>
            </button>
          ))}
      </div>

      {/* Windows */}
      {windows.map(
        (w) =>
          w.open && (
            <Rnd
              key={w.id}
              default={{ x: w.x, y: w.y, width: w.width, height: w.height }}
              bounds="window"
              minWidth={300}
              minHeight={200}
            >
              <motion.div
                className="bg-[#1e1e1e]/95 rounded-xl border border-gray-700 shadow-2xl overflow-hidden backdrop-blur-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15 }}
              >
                {/* Header */}
                <div className="flex justify-between items-center bg-[#2b2b2b]/90 px-3 py-1 border-b border-gray-700 cursor-grab">
                  <span className="font-medium text-sm text-gray-200">
                    {w.title}
                  </span>
                  <button
                    onClick={() => toggleWindow(w.id)}
                    className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600"
                  />
                </div>

                {/* Body */}
                <div className="p-4 text-sm text-gray-200 h-full overflow-auto bg-[#252525]/60">
                  {/* Projects */}
                  {w.title === "Projects" && (
                    <div>
                      {!selectedProject ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-6">
                          {projectsData.map((p, i) => (
                            <motion.button
                              key={i}
                              onDoubleClick={() => setSelectedProject(p)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex flex-col items-center text-sm text-gray-300 hover:text-white transition-all duration-150"
                            >
                              <div className="text-5xl mb-2">📁</div>
                              <span className="truncate">{p.name}</span>
                            </motion.button>
                          ))}
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25 }}
                          className="flex flex-col h-full"
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <button
                              onClick={() => setSelectedProject(null)}
                              className="px-2 py-1 bg-gray-700/60 rounded hover:bg-gray-700"
                            >
                              ←
                            </button>
                            <h3 className="text-gray-100 font-medium text-lg">
                              {selectedProject.name}
                            </h3>
                          </div>

                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
                            {selectedProject.github && (
                              <a
                                href={selectedProject.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center text-gray-300 hover:text-white transition-all"
                              >
                                <div className="text-5xl mb-2">💻</div>
                                <span className="text-xs">Repository</span>
                              </a>
                            )}
                            {selectedProject.live &&
                              selectedProject.live !== "" && (
                                <a
                                  href={selectedProject.live}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex flex-col items-center text-gray-300 hover:text-white transition-all"
                                >
                                  <div className="text-5xl mb-2">🌐</div>
                                  <span className="text-xs">Live Demo</span>
                                </a>
                              )}
                            {selectedProject.photos?.length ? (
                              <button
                                onClick={() => openGallery(selectedProject)}
                                className="flex flex-col items-center text-gray-300 hover:text-white transition-all"
                              >
                                <div className="text-5xl mb-2">📷</div>
                                <span className="text-xs">Photos</span>
                              </button>
                            ) : null}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* This PC */}
                  {w.title === "This PC" && (
                    <div className="text-gray-200 space-y-6 select-none">
                      {/* Drives Section */}
                      <div>
                        <h3 className="text-sm font-semibold mb-2 text-gray-400">
                          Devices and drives
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Local Disk (C:) */}
                          <div className="bg-[#2a2a2a] rounded-xl p-4 border border-gray-700 hover:border-gray-500 transition-all">
                            <div className="flex items-center justify-between text-sm font-medium mb-2">
                              <span className="flex items-center gap-2">
                                🖥️ <span>Local Disk (C:)</span>
                              </span>
                              <span className="text-xs text-gray-400">
                                92% full
                              </span>
                            </div>
                            <div className="w-full h-3 bg-gray-700 rounded-lg overflow-hidden">
                              <div className="h-full w-[92%] bg-blue-600 rounded-lg" />
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
                              12 GB free of 256 GB
                            </div>
                          </div>

                          {/* Data (D:) */}
                          <div className="bg-[#2a2a2a] rounded-xl p-4 border border-gray-700 hover:border-gray-500 transition-all">
                            <div className="flex items-center justify-between text-sm font-medium mb-2">
                              <span className="flex items-center gap-2">
                                💾 <span>Data (D:)</span>
                              </span>
                              <span className="text-xs text-gray-400">
                                47% full
                              </span>
                            </div>
                            <div className="w-full h-3 bg-gray-700 rounded-lg overflow-hidden">
                              <div className="h-full w-[47%] bg-green-600 rounded-lg" />
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
                              136 GB free of 256 GB
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Folders Section */}
                      <div>
                        <h3 className="text-sm font-semibold mb-2 text-gray-400">
                          Folders
                        </h3>
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                          {/* Documents */}
                          <div
                            onDoubleClick={() =>
                              setOpenTextFile({
                                name: "AboutMe.txt",
                                type: "file",
                                preview: `Name: Miguel Carvalho
Location: Luxembourg / Portugal
Role: Full-Stack Developer
Hobbies: Game development, Drone photography, Travel`,
                              })
                            }
                            className="flex flex-col items-center p-2 cursor-pointer hover:text-white transition-all"
                          >
                            <div className="text-5xl mb-1">📄</div>
                            <span className="text-xs">Documents</span>
                          </div>

                          {/* Projects */}
                          <div
                            onDoubleClick={() =>
                              setWindows((prev) =>
                                prev.map((win) =>
                                  win.title === "Projects"
                                    ? { ...win, open: true }
                                    : win
                                )
                              )
                            }
                            className="flex flex-col items-center p-2 cursor-pointer hover:text-white transition-all"
                          >
                            <div className="text-5xl mb-1">📁</div>
                            <span className="text-xs">Projects</span>
                          </div>

                          {/* System Info */}
                          <div
                            onDoubleClick={() =>
                              setOpenTextFile({
                                name: "SystemInfo.txt",
                                type: "file",
                                preview: `Device Name: MIGUEL-PC
System Type: Full-Stack Developer
Processor: Human (Curious Type)
Memory: 32GB of caffeine
Battery: Always charging ☕
Network: Connected to innovation
OS Build: v1.0.2025`,
                              })
                            }
                            className="flex flex-col items-center p-2 cursor-pointer hover:text-white transition-all"
                          >
                            <div className="text-5xl mb-1">⚙️</div>
                            <span className="text-xs">SystemInfo.txt</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* About */}
                  {w.title === "About" && (
                    <div className="relative h-full">
                      {!selectedPCItem ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 mt-2">
                          {/* AboutMe.txt */}
                          <div
                            onDoubleClick={() =>
                              setOpenTextFile({
                                name: "AboutMe.txt",
                                type: "file",
                                preview: `Name: Miguel Carvalho
Location: Luxembourg / Portugal
Role: Full-Stack Developer
Hobbies: Game development, Drone photography, Travel`,
                              })
                            }
                            className="flex flex-col items-center p-2 cursor-pointer hover:text-white transition-all"
                          >
                            <div className="text-5xl mb-2">📄</div>
                            <span className="text-xs text-gray-200">
                              AboutMe.txt
                            </span>
                          </div>

                          {/* CV.pdf */}
                          <div
                            onDoubleClick={() =>
                              setGalleryProject({
                                name: "CV.pdf",
                                github: "",
                                photos: ["/MiguelCarvalhoCV.pdf"], // we'll treat it as a single "photo"
                              })
                            }
                            className="flex flex-col items-center p-2 cursor-pointer hover:text-white transition-all"
                          >
                            <div className="text-5xl mb-2">📕</div>
                            <span className="text-xs text-gray-200">
                              CV.pdf
                            </span>
                          </div>

                          {/* Skills.cmd */}
                          <div
                            onDoubleClick={() =>
                              setOpenTextFile({
                                name: "Skills.cmd",
                                type: "file",
                                preview: `> skills --show

Frontend: React, Next.js, Tailwind, TypeScript
Backend: FastAPI, Node.js, Laravel
Databases: MongoDB, PostgreSQL, MySQL
Tools: Docker, Firebase, GitHub Actions`,
                              })
                            }
                            className="flex flex-col items-center p-2 cursor-pointer hover:text-white transition-all"
                          >
                            <div className="text-5xl mb-2">💻</div>
                            <span className="text-xs text-gray-200">
                              Skills.cmd
                            </span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </motion.div>
            </Rnd>
          )
      )}

      {/* GALLERY WINDOW */}
      {galleryProject && (
        <Rnd
          default={{ x: 180, y: 120, width: 600, height: 400 }}
          bounds="window"
          minWidth={300}
          minHeight={250}
        >
          <motion.div
            className="bg-[#1e1e1e]/95 rounded-xl border border-gray-700 shadow-2xl overflow-hidden backdrop-blur-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center bg-[#2b2b2b]/90 px-3 py-1 border-b border-gray-700">
              <span className="font-medium text-sm text-gray-200 flex items-center gap-2">
                <ImageIcon size={16} />
                {galleryProject.name} — Photos
              </span>
              <button
                onClick={() => {
                  setLightboxIndex(null);
                  closeGallery();
                }}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600"
              />
            </div>

            {/* Thumbnails */}
            <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 bg-[#252525]/60 overflow-auto">
              {galleryProject.photos?.map((src, i) => (
                <motion.img
                  key={i}
                  src={src}
                  alt={`Screenshot ${i + 1}`}
                  className="w-full h-28 object-cover rounded-md border border-gray-700 hover:scale-105 transition-transform cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setLightboxIndex(i)}
                />
              ))}
            </div>
          </motion.div>
        </Rnd>
      )}

      {/* NOTEPAD / TERMINAL WINDOW */}
      {openTextFile && (
        <Rnd
          default={{
            x: openTextFile?.x ?? 240,
            y: openTextFile?.y ?? 160,
            width: 500,
            height: 300,
          }}
          bounds="window"
          minWidth={300}
          minHeight={200}
        >
          <motion.div
            className={`rounded-xl border shadow-2xl overflow-hidden ${
              openTextFile.name.endsWith(".cmd")
                ? "bg-black text-green-400 border-gray-700"
                : "bg-[#fafafa] text-black border-gray-400"
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
          >
            {/* Header */}
            <div
              className={`flex justify-between items-center px-3 py-1 border-b text-sm ${
                openTextFile.name.endsWith(".cmd")
                  ? "bg-[#111] border-gray-700 text-green-400"
                  : "bg-[#e1e1e1] border-gray-400 text-gray-800"
              }`}
            >
              <span className="font-medium">
                {openTextFile.name} —{" "}
                {openTextFile.name.endsWith(".cmd")
                  ? "Command Prompt"
                  : "Notepad"}
              </span>
              <button
                onClick={() => setOpenTextFile(null)}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600"
              />
            </div>

            {/* Content */}
            <div
              className={`p-3 h-full overflow-auto font-mono text-sm whitespace-pre-wrap ${
                openTextFile.name.endsWith(".cmd")
                  ? "bg-black text-green-400"
                  : ""
              }`}
            >
              {openTextFile.name.endsWith(".txt")
                ? formatTextWithBold(openTextFile.preview || "")
                : openTextFile.preview || "This file is empty."}
            </div>
          </motion.div>
        </Rnd>
      )}

      {/* PDF VIEWER FULLSCREEN */}
      {galleryProject?.name === "CV.pdf" && (
        <motion.div
          className="fixed inset-0 bg-black/95 flex flex-col z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center bg-[#222] px-4 py-2 border-b border-gray-700 text-gray-200">
            <span className="font-medium">Viewing CV.pdf</span>
            <div className="flex items-center gap-3">
              <a
                href="/MiguelCarvalhoCV.pdf"
                download
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
              >
                Download
              </a>
              <button
                onClick={() => closeGallery()}
                className="w-4 h-4 text-gray-400 hover:text-white transition"
              >
                ✖
              </button>
            </div>
          </div>

          {/* PDF Content */}
          <iframe
            src="/MiguelCarvalhoCV.pdf"
            className="flex-1 w-full"
            title="CV"
          ></iframe>
        </motion.div>
      )}

      {/* LIGHTBOX / PHOTO VIEWER */}
      {galleryProject && lightboxIndex !== null && (
        <motion.div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setLightboxIndex(null)}
        >
          <div className="relative max-w-5xl w-full flex items-center justify-center">
            <motion.img
              key={lightboxIndex}
              src={galleryProject.photos?.[lightboxIndex] || ""}
              alt="Project photo"
              className="max-h-[80vh] rounded-lg shadow-lg select-none"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Prev Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) =>
                  prev! > 0
                    ? prev! - 1
                    : (galleryProject.photos?.length ?? 1) - 1
                );
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-gray-800/70 rounded-full hover:bg-gray-700 transition"
            >
              ←
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) =>
                  prev! < (galleryProject.photos?.length ?? 0) - 1
                    ? prev! + 1
                    : 0
                );
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-gray-800/70 rounded-full hover:bg-gray-700 transition"
            >
              →
            </button>

            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 p-2 bg-gray-800/80 hover:bg-gray-700 rounded-full transition"
            >
              ✖
            </button>

            {/* Caption */}
            <div className="absolute bottom-6 text-gray-300 text-sm">
              {lightboxIndex + 1} / {galleryProject.photos?.length}
            </div>
          </div>
        </motion.div>
      )}

      <Taskbar windows={windows} toggleWindow={toggleWindow} />
    </main>
  );
}
