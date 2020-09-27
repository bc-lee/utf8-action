import {ensureUTF8} from "../src/main"

test("Normal File", async () => {
  const buffer = Buffer.from(`Hello, World\n`)
  expect(() => {
    ensureUTF8(buffer)
  }).not.toThrow()
})

test("UTF-8 File", async () => {
  const buffer = Buffer.from("ec9588eb8595", "hex")
  expect(() => {
    if (buffer.toString("utf8") !== "안녕") {
      throw new Error("Invalid test set")
    }
  }).not.toThrow()
  expect(() => {
    ensureUTF8(buffer)
  }).not.toThrow()
})

test("Have BOM", async () => {
  const buffer = Buffer.concat([
    Buffer.from("efbbbf", "hex"),
    Buffer.from(`Hello, World\n`)
  ])
  expect(() => {
    ensureUTF8(buffer)
  }).toThrow(Error)
})

test("Invalid Encoding", async () => {
  const buffer = Buffer.from("48c555b1", "hex")
  expect(() => {
    if (buffer.toString("utf16le") !== "안녕") {
      throw new Error("Invalid test set")
    }
  }).not.toThrow()
  expect(() => {
    ensureUTF8(buffer)
  }).toThrow(Error)
})
