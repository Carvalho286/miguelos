"use client";

import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { motion } from "framer-motion";
import Taskbar from "@/components/Taskbar";
import projectsData from "@/data/projects.json";
import { Monitor, FolderOpen, User, Image as ImageIcon } from "lucide-react";

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
  const [galleryProject, setGalleryProject] = useState<Project | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  if (!mounted) return <main className="h-screen w-screen bg-black" />;

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
                    <div>
                      {!selectedPCItem ? (
                        <div className="grid grid-cols-4 gap-4">
                          {folderItems.map((item) => (
                            <div
                              key={item.name}
                              onDoubleClick={() => setSelectedPCItem(item)}
                              className="flex flex-col items-center p-2 cursor-pointer hover:text-white transition-all"
                            >
                              <div className="text-5xl mb-2">
                                {item.type === "folder" ? "📁" : "📄"}
                              </div>
                              <span className="text-xs text-gray-200">
                                {item.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <button
                              onClick={() => setSelectedPCItem(null)}
                              className="px-2 py-1 bg-gray-700/60 rounded hover:bg-gray-700"
                            >
                              ←
                            </button>
                            <h3 className="text-gray-100 font-medium text-lg">
                              {selectedPCItem.name}
                            </h3>
                          </div>
                          <p className="text-gray-300 text-sm">
                            {selectedPCItem.preview || "This folder is empty."}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* About */}
                  {w.title === "About" && (
                    <div>
                      <h2 className="font-semibold mb-2 text-gray-100">
                        About Me
                      </h2>
                      <p>
                        Hello! I'm Miguel Carvalho, a full-stack developer with
                        a passion for creating beautiful and performant
                        applications. I love working with React, TypeScript, and
                        modern web tools to bring ideas to life.
                      </p>
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
                  onClick={() => setLightboxIndex(i)} // opens the photo viewer
                />
              ))}
            </div>
          </motion.div>
        </Rnd>
      )}

      {/* LIGHTBOX / PHOTO VIEWER */}
      {galleryProject && lightboxIndex !== null && (
        <motion.div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setLightboxIndex(null)} // click outside to close
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
