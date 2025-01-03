# 🧹 rm-nm

A simple, `npkill`-like script to quickly **remove all `node_modules` directories** from a target directory.

---

## 🚀 Setup

1. **Clone the repository:**

```bash
git clone https://github.com/rmhaiderali/rm-nm.git
```

2. **Change into the rm-nm directory:**

```bash
cd rm-nm
```

3. **Set a permanent alias (optional):**

```bash
echo alias rm-nm=\"node $(pwd)\" >> ~/.bashrc
source ~/.bashrc
```

---

## 🛠 Usage

### Remove `node_modules` from the current directory and its subdirectories:

```bash
rm-nm
```

### Remove `node_modules` from a specific directory (e.g., `~/projects`):

```bash
rm-nm ~/projects
```

---

## 📌 Notes
- Bash is required to run this script. On Windows, install a Bash environment such as **Git Bash**, **WSL**, or **MSYS2**.
- Make sure you have a JavaScript runtime installed — either **Node**, **Deno**, or **Bun**.
- The alias step is optional. You can also run it directly with `[node|deno|bun] [nm-rm dir] [target dir]`.
