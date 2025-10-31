# Miguel Carvalho — Portfolio

A modern, interactive **Windows-style portfolio** built with **Next.js**, **React**, and **Framer Motion**.  
The interface simulates a desktop environment, complete with draggable windows, folders, and a dynamic taskbar showcasing my projects, CV, and system-like details in a playful yet professional way.

---

## 🚀 Features

- 🖥️ **Windows-inspired UI** — draggable, resizable, and animated windows  
- 📁 **Projects folder** — view, browse, and preview all my current work  
- 💬 **About Me section** — includes a CV viewer and terminal-style skills display  
- 💾 **This PC window** — a creative representation of system drives and files  
- 🧩 **Admin dashboard** — password-protected CRUD system to manage projects  
- 📸 **Gallery & Lightbox** — preview project screenshots inside the desktop interface
- 📱 **Mobile-friendly design** — adaptive layout with stacked windows, larger controls, and smooth touch interactions  

---

## 🧰 Tech Stack

| Area | Technology |
|------|-------------|
| **Framework** | [Next.js 14](https://nextjs.org/) |
| **UI** | [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Draggable Windows** | [react-rnd](https://github.com/bokuweb/react-rnd) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Authentication** | Custom `.env`-based credentials |
| **Database** | [MongoDB](https://www.mongodb.com/) (via [Mongoose](https://mongoosejs.com/)) |

---

## 🧑‍💼 Admin Panel

A private `/admin` page allows you to:
- Add, edit, or delete projects  
- Upload project photos (stored under `/public/projects/<project_name>`)  
- Automatically update `projects.json`

Login credentials are securely checked against your `.env.local` values.

---

## 📄 License

This project is open-source under the **MIT License**.  
Feel free to fork, modify, and use for inspiration but please credit the original work.

---

### ✨ Author

**Miguel Carvalho**  
Full-Stack Developer based in Luxembourg / Portugal  
📫 [LinkedIn](https://www.linkedin.com/in/carvalho286) • [GitHub](https://github.com/Carvalho286)

---

> *“Building systems that look like art and feel like software.”*
