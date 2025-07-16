# 🧹 rm-deps

A simple, `npkill`-like script to quickly **remove all dependency directories** from a target directory.

## 👩‍💻 Supported Languages

- `js` JavaScript
- `py` Python

## 🛠 Usage

### Arguments

```bash
npx github:rmhaiderali/rm-deps [target directory] [language]
```

### Remove javascript dependency directories from current directory and its subdirectories:

```bash
npx github:rmhaiderali/rm-deps . js
```

### Remove python dependency directories from a specific directory (e.g., `~/projects`):

```bash
npx github:rmhaiderali/rm-deps ~/projects py
```

## 📌 Notes

- Bash is required to run this script. On Windows, install a Bash environment such as **Git Bash**, **WSL**, or **MSYS2**.

## ⚠️ Warnings

- Do **not** use this script in directories you don’t fully control or recognize. Many applications (e.g., Electron based apps, system tools, and IDEs) use `node_modules` in critical internal directories. Deleting them may break software functionality.
- The author is **not responsible** for any damage or data loss caused by misuse of this script.
