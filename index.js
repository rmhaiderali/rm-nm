#!/usr/bin/env node

import os from "node:os"
import { exec } from "node:child_process"
import trash from "trash"
import prompts from "prompts"
import getFolderSize from "get-folder-size"
import prettyBytes from "pretty-bytes"
import duration from "duration"
import Bluebird from "bluebird"
import picocolors from "picocolors"
import ora from "ora"

const { red: fr, green: fg, yellow: fy, magenta: fm, reset: r } = picocolors

function run(command) {
  return new Promise((resolve, reject) =>
    exec(command, (error, stdout, stderr) => resolve(stdout))
  )
}

const cwd = process.cwd()
process.chdir(import.meta.dirname)

if (!(await run("find . ! -name . -prune -type f")).includes("index.js")) {
  console.log(
    "System's find utility is either missing or lacks POSIX compatibility"
  )
  if (os.platform() === "win32")
    console.log(
      "You can use POSIX-like enviornment e.g.(WSL, Git Bash, Cygwin)"
    )
  process.exit(1)
}

process.chdir(cwd)

function ResolveTasksConcurrently(tasks, concurrency) {
  return Bluebird.map(tasks, (task) => task(), { concurrency })
}

const root = process.argv[2] || "."
const language = process.argv[3] || "js"
const availableLanguages = {
  js: [
    " -type d -name node_modules -not -path '*/node_modules/*/node_modules'",
    ["node_modules"],
  ],
  py: [
    " -type d \\( -name __pycache__ -o -name .venv -o -name venv \\) -not -path '*/.venv/*/__pycache__' -not -path '*/venv/*/__pycache__'",
    ["pycache", "venv", ".venv"],
  ],
}
const availableLanguagesKeys = Object.keys(availableLanguages)

if (!availableLanguagesKeys.includes(language)) {
  console.log(
    fr(
      "Invalid language specified. Available languages: " +
        availableLanguagesKeys.join(" ")
    )
  )
  process.exit(1)
}

const command = "find " + root + availableLanguages[language][0]
const spinner = ora({ color: "white" })

spinner.start(
  "Searching for " +
    availableLanguages[language][1].map(fm).join(" or ") +
    " directories in " +
    fg(root)
)
const d = new Date()
const output = await run(command)
const t = duration(d).toString(1)
spinner.stop()

const dirs = output
  .split("\n")
  .filter(Boolean)
  .sort((a, b) => a.split("/").at(-1).localeCompare(b.split("/").at(-1)))

console.log(
  fg(t) +
    " Total of " +
    (dirs.length ? fy : fr)(dirs.length) +
    " " +
    availableLanguages[language][1].map(fm).join(" or ") +
    " directories found in " +
    fg(root)
)

if (dirs.length === 0) process.exit()

let totalBytes = 0

const tasks = dirs.map((dir) => async () => {
  const { size: bytes } = await getFolderSize(dir)
  totalBytes += bytes
  const [size, unit] = prettyBytes(bytes, { binary: true }).split(" ")
  return { dir, size, unit }
})

spinner.start("Calculating size of directories")
const d2 = new Date()
const dirsAndSizes = await ResolveTasksConcurrently(tasks, 32)
const t2 = duration(d2).toString(1)
spinner.stop()

console.log(
  fg(t2) + " Total size is " + fy(prettyBytes(totalBytes, { binary: true }))
)

const maxSizeLen = dirsAndSizes
  .map(({ size }) => size.length)
  .reduce((acc, cur) => Math.max(acc, cur), 0)

const maxUnitLen = dirsAndSizes
  .map(({ unit }) => unit.length)
  .reduce((acc, cur) => Math.max(acc, cur), 0)

for (const { dir, size, unit } of dirsAndSizes) {
  const su = size.padStart(maxSizeLen) + " " + unit.padEnd(maxUnitLen)
  const response = await prompts(
    {
      type: "confirm",
      name: "confirm",
      message: r("Do you want to delete " + fy(su) + " " + dir + "?"),
      initial: false,
    },
    { onCancel: () => process.exit() }
  )

  if (response.confirm) {
    try {
      await trash(dir)
    } catch (err) {
      console.error("Failed to move " + dir + " to trash:", err.message)
    }
  }
}
