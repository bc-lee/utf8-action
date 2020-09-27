import * as core from "@actions/core"
import isValidUTF8 from "utf-8-validate"
import {execSync} from "child_process"
import {OpenMode, PathLike, promises as fsPromises} from "fs"

const utf8Bom = Buffer.from("efbbbf", "hex")

export async function readFile(
  path: PathLike,
  options?: {encoding?: null; flag?: OpenMode} | null
): Promise<Buffer> {
  return fsPromises.readFile(path, options)
}

export function ensureUTF8(
  buffer: Buffer,
  fileName: string | null = null
): void {
  if (buffer.byteLength >= 3) {
    const slice = buffer.slice(0, 3)
    if (slice.compare(utf8Bom) === 0) {
      throw new Error(
        `Sorry, your file ${fileName} contains UTF-8 BOM, which is completely unnecessary.`
      )
    }
  }

  if (!isValidUTF8(buffer)) {
    throw new Error(`Sorry, your file ${fileName} is not a valid UTF-8 file`)
  }
}

function debug(msg: string, obj: unknown | null = null): void {
  core.debug(formatLogMessage(msg, obj))
}

function formatLogMessage(msg: string, obj: unknown | null = null): string {
  return obj ? `${msg}: ${JSON.stringify(obj)}` : msg
}

function lsFiles(): string[] {
  return execSync(
    "git grep --cached -Il ''",
    Object({encoding: "utf-8"})
  ).split("\n")
}

async function run(): Promise<void> {
  try {
    const files = lsFiles()
    for (const file of files) {
      // file always have a valid name.
      if (!file) {
        continue
      }
      debug("file", file)
      const data = await readFile(file)
      ensureUTF8(data, file)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
