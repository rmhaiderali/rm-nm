import { exec } from "child_process"
import trash from "trash"
import prompts from "prompts"
import getFolderSize from "get-folder-size"
import prettyBytes from "pretty-bytes"
import duration from "duration"
import Bluebird from "bluebird"
import picocolors from "picocolors"

const { red: fr, green: fg, yellow: fy, reset: r } = picocolors

function run(command) {
  return new Promise((resolve, reject) =>
    exec(command, (error, stdout, stderr) => resolve(stdout))
  )
}

function ResolveTasksConcurrently(tasks, concurrency) {
  return Bluebird.map(tasks, (task) => task(), { concurrency })
}

console.log("Wait! Searching for node_modules directories")

const command =
  "find " +
  (process.argv[2] || ".") +
  " -type d -name node_modules -not -path \"*/node_modules/*/node_modules\""

const d = new Date()
const output = await run(command)
const t = duration(d).toString(1)

const dirs = output.split("\n").filter(Boolean)
console.log(
  "Found " + fr(dirs.length) + " node_modules directories in " + fg(t)
)

if (dirs.length === 0) {
  console.log("No node_modules directories found")
  process.exit()
}

const tasks = dirs.map((dir) => async () => {
  const { size: bytes } = await getFolderSize(dir)
  const [size, unit] = prettyBytes(bytes, { binary: true }).split(" ")
  return { dir, size, unit }
})

console.log("Wait! Calculating size of directories")

const d2 = new Date()
const dirsAndSizes = await ResolveTasksConcurrently(tasks, Infinity)
const t2 = duration(d2).toString(1)

console.log("Calculated size of directories in " + fg(t2))

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
