import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const blockedDirs = new Set(['.git', 'dist', 'node_modules'])
const checkedExtensions = new Set(['.env', '.example', '.js', '.json', '.md', '.ts', '.tsx'])
const dangerousPublicSecret = /VITE_[A-Z0-9_]*(SERVICE_ROLE|OPENAI|SECRET|PRIVATE)[A-Z0-9_]*/g

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (blockedDirs.has(entry.name)) continue
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      yield* walk(fullPath)
      continue
    }

    const ext = path.extname(entry.name)
    if (entry.name.startsWith('.env') || checkedExtensions.has(ext)) yield fullPath
  }
}

let hasError = false

for await (const filePath of walk(process.cwd())) {
  const source = await readFile(filePath, 'utf8')
  const matches = source.match(dangerousPublicSecret)
  if (!matches) continue

  hasError = true
  console.error(`${filePath}: unsafe browser-exposed secret env name: ${matches.join(', ')}`)
}

if (hasError) process.exit(1)
