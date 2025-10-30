"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import projectsData from "@/data/projects.json";

interface Project {
  name: string;
  github: string;
  live?: string;
  photos?: string[];
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState<Project[]>(projectsData);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState<Project>({
    name: "",
    github: "",
    live: "",
    photos: [],
  });
  const [photoFiles, setPhotoFiles] = useState<FileList | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) setIsAuthenticated(true);
    else alert("Invalid credentials");
  };

  const handleSave = async () => {
    let uploadedPhotos: string[] = [];

    // Upload novas fotos, se existirem
    if (photoFiles && photoFiles.length > 0) {
      const formData = new FormData();
      for (const file of Array.from(photoFiles)) {
        formData.append("photos", file);
      }
      formData.append("projectName", newProject.name);

      const uploadRes = await fetch("/api/projects/upload", {
        method: "POST",
        body: formData,
      });

      if (uploadRes.ok) {
        uploadedPhotos = await uploadRes.json();
      } else {
        alert("Error uploading photos");
        return;
      }
    }

    // Se estiver a editar, junta as fotos antigas não removidas + novas
    const finalPhotos = [
      ...(newProject.photos || []),
      ...uploadedPhotos,
    ];

    const projectToSave = {
      ...newProject,
      photos: finalPhotos,
    };

    const method = editingProject ? "PUT" : "POST";

    const res = await fetch("/api/projects", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectToSave),
    });

    if (res.ok) {
      const updated = await res.json();
      setProjects(updated);
      setShowModal(false);
      setNewProject({ name: "", github: "", live: "", photos: [] });
      setEditingProject(null);
      setPhotoFiles(null);
    } else {
      alert("Error saving project");
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete project "${name}"?`)) return;

    const res = await fetch(`/api/projects?name=${encodeURIComponent(name)}`, {
      method: "DELETE",
    });

    if (res.ok) {
      const updated = await res.json();
      setProjects(updated);
    } else {
      alert("Error deleting project");
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setNewProject({ ...project });
    setShowModal(true);
  };

  // Remover fotos específicas
  const handleRemovePhoto = (photoUrl: string) => {
    setNewProject((prev) => ({
      ...prev,
      photos: prev.photos?.filter((p) => p !== photoUrl),
    }));
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="bg-gray-800 p-6 rounded-xl shadow-xl w-80"
        >
          <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-3 p-2 rounded bg-gray-700 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 p-2 rounded bg-gray-700 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Projects Manager</h1>
          <button
            onClick={() => {
              setEditingProject(null);
              setNewProject({ name: "", github: "", live: "", photos: [] });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            <Plus size={18} /> Add Project
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-700 text-gray-300">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">GitHub</th>
                <th className="py-3 px-4">Live</th>
                <th className="py-3 px-4">Photos</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-700 hover:bg-gray-750 transition"
                >
                  <td className="py-3 px-4 font-medium">{p.name}</td>
                  <td className="py-3 px-4 text-blue-400 truncate">
                    <a href={p.github} target="_blank" rel="noopener noreferrer">
                      {p.github || "-"}
                    </a>
                  </td>
                  <td className="py-3 px-4 text-green-400 truncate">
                    {p.live ? (
                      <a href={p.live} target="_blank" rel="noopener noreferrer">
                        {p.live}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {p.photos && p.photos.length
                      ? `${p.photos.length} photo${p.photos.length > 1 ? "s" : ""}`
                      : "-"}
                  </td>
                  <td className="py-3 px-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="p-2 rounded bg-yellow-600 hover:bg-yellow-700"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.name)}
                      className="p-2 rounded bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit Project */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-gray-800 p-6 rounded-xl w-[90%] max-w-md text-gray-100 relative overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h2>

              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  disabled={!!editingProject}
                  className="p-2 rounded bg-gray-700 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="GitHub URL"
                  value={newProject.github}
                  onChange={(e) =>
                    setNewProject({ ...newProject, github: e.target.value })
                  }
                  className="p-2 rounded bg-gray-700 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Live Demo URL"
                  value={newProject.live}
                  onChange={(e) =>
                    setNewProject({ ...newProject, live: e.target.value })
                  }
                  className="p-2 rounded bg-gray-700 focus:outline-none"
                />

                {/* Preview das fotos existentes */}
                {editingProject && newProject.photos && newProject.photos.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Existing Photos:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {newProject.photos.map((photo, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={photo}
                            alt={`photo-${idx}`}
                            className="rounded-lg w-full h-24 object-cover border border-gray-700"
                          />
                          <button
                            onClick={() => handleRemovePhoto(photo)}
                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  multiple
                  onChange={(e) => setPhotoFiles(e.target.files)}
                  className="p-2 rounded bg-gray-700 focus:outline-none file:mr-3 file:bg-blue-600 file:text-white file:rounded file:border-0 mt-2"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
