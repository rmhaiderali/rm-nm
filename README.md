# 🧹 rm-deps

A simple, `npkill`-like script to quickly **remove all dependency directories** from a target directory.

## 👩‍💻 Supported Languages

- `js` JavaScript
- `py` Python

## 🚀 Setup

1. **Clone the repository:**

```bash
git clone https://github.com/rmhaiderali/rm-deps.git
```

2. **Change into the rm-deps directory:**

```bash
cd rm-deps
```

3. **Install dependencies:**

```bash
npm i
```

4. **Set a permanent alias (optional):**

```bash
echo alias rm-deps="node $(pwd)" >> ~/.bashrc
source ~/.bashrc
```

## 🛠 Usage

### Remove js dependency directories from current directory and its subdirectories:

```bash
rm-deps . js
```

### Remove python dependency directories from a specific directory (e.g., `~/projects`):

```bash
rm-deps ~/projects py
```

## 📌 Notes

- Bash is required to run this script. On Windows, install a Bash environment such as **Git Bash**, **WSL**, or **MSYS2**.
- Make sure you have a JavaScript runtime installed — either **Node**, **Deno**, or **Bun**.
- The alias step is optional. You can also run it directly with `[node|deno|bun] [cloned dir] [target dir] [language]`.

## ⚠️ Warnings

- Do **not** use this script in directories you don’t fully control or recognize. Many applications (e.g., Electron based apps, system tools, and IDEs) use `node_modules` in critical internal directories. Deleting them may break software functionality.
- The author is **not responsible** for any damage or data loss caused by misuse of this script.
