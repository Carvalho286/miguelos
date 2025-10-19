"use client";

import { useState } from "react";
import { Rnd } from "react-rnd";
import { motion } from "framer-motion";

export default function Home() {
  const [windows, setWindows] = useState([
    { id: 1, title: "Projects", x: 50, y: 80, width: 400, height: 300, open: false },
    { id: 2, title: "About", x: 120, y: 150, width: 400, height: 250, open: false },
    { id: 3, title: "This PC", x: 200, y: 120, width: 520, height: 360, open: false, type: 'folder' },
  ]);

  const toggleWindow = (id: number) =>
    setWindows(ws => ws.map(w => (w.id === id ? { ...w, open: !w.open } : w)));

  const [selectedItem, setSelectedItem] = useState<{ name: string; type: string } | null>(null);

  const folderItems = [
    { name: 'Documents', type: 'folder', preview: 'Some personal documents and notes.' },
    { name: 'Pictures', type: 'folder', preview: 'Photos from trips and events.' },
    { name: 'Downloads', type: 'folder', preview: 'Files you downloaded from the web.' },
    { name: 'Readme.txt', type: 'file', preview: 'This is an example readme file.' },
  ];

  return (
    <main className="h-screen w-screen bg-gradient-to-br from-gray-900 to-black relative">
      {/* Desktop icons */}
      <div className="absolute left-6 top-6 flex flex-col gap-4">
        {windows.map(w => (
          <button
            key={w.id}
            onDoubleClick={() => toggleWindow(w.id)}
            className="flex flex-col items-center text-sm text-gray-300 hover:text-white"
          >
            <div className="h-12 w-12 bg-gray-700 rounded-md mb-1 flex items-center justify-center">
              {w.title === 'This PC' ? '�️' : '�🗔'}
            </div>
            {w.title}
          </button>
        ))}
      </div>

      {/* Windows */}
      {windows.map(w => (
        w.open && (
          <Rnd
            key={w.id}
            default={{ x: w.x, y: w.y, width: w.width, height: w.height }}
            bounds="window"
          >
            <motion.div
              className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex justify-between items-center bg-gray-700 px-3 py-1">
                <span>{w.title}</span>
                <button onClick={() => toggleWindow(w.id)} className="text-red-400">✖</button>
              </div>
              <div className="p-4 text-sm text-gray-200">
                {w.title === "Projects" && "Here you’ll showcase your best works."}
                {w.title === "About" && "A bit about who you are and what you build."}
                {w.title === 'This PC' && (
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3">
                      <div className="grid grid-cols-3 gap-4">
                        {folderItems.map(item => (
                          <div
                            key={item.name}
                            onClick={() => setSelectedItem({ name: item.name, type: item.type })}
                            className="flex flex-col items-center p-2 cursor-pointer hover:bg-gray-700 rounded"
                          >
                            <div className="h-12 w-12 bg-gray-700 rounded-md mb-1 flex items-center justify-center">
                              {item.type === 'folder' ? '📁' : '📄'}
                            </div>
                            <span className="text-xs text-gray-200">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-1 p-2 border-l border-gray-700">
                      <div className="text-sm font-medium text-gray-200 mb-2">Preview</div>
                      {selectedItem ? (
                        <div>
                          <div className="text-sm text-gray-100">{selectedItem.name}</div>
                          <div className="text-xs text-gray-300 mt-2">
                            {folderItems.find(i => i.name === selectedItem.name)?.preview}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400">Select an item to see preview.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </Rnd>
        )
      ))}
    </main>
  );
}
