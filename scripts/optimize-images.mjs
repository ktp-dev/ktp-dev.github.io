/**
 * Resize/compress images in place under public/images/.
 *
 * Usage:
 *   npm run images:optimize:home
 *   node scripts/optimize-images.mjs --preset member
 *   node scripts/optimize-images.mjs --preset home --dry-run
 */

import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import sharp from 'sharp'

const PRESETS = {
  home: {
    inputDir: 'images/home',
    maxWidth: 1600,
    quality: 85,
  },
  about: {
    inputDir: 'images/about',
    maxWidth: 1600,
    quality: 85,
  },
  member: {
    inputDir: 'images/members',
    maxWidth: 800,
    quality: 85,
  },
}

function parseArgs(argv) {
  let preset = 'home'
  let dryRun = false
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--preset' && argv[i + 1]) {
      preset = argv[i + 1]
      i += 1
    }
    if (argv[i] === '--dry-run') dryRun = true
  }
  return { preset, dryRun }
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

async function walkImages(absoluteDir, relativeDir, files = []) {
  const entries = await fs.readdir(absoluteDir, { withFileTypes: true })
  for (const entry of entries) {
    const rel = `${relativeDir}/${entry.name}`
    const abs = path.join(absoluteDir, entry.name)
    if (entry.isDirectory()) {
      await walkImages(abs, rel, files)
      continue
    }
    if (/\.(jpe?g|png)$/i.test(entry.name)) {
      files.push({ relativePath: rel, absolutePath: abs })
    }
  }
  return files
}

async function optimizeFile(inputPath, preset) {
  const inputBuffer = await fs.readFile(inputPath)
  const outputBuffer = await sharp(inputBuffer)
    .rotate()
    .resize({ width: preset.maxWidth, withoutEnlargement: true })
    .jpeg({ quality: preset.quality, mozjpeg: true })
    .toBuffer()

  const tempPath = path.join(
    os.tmpdir(),
    `ktp-opt-${process.pid}-${path.basename(inputPath)}`
  )
  await fs.writeFile(tempPath, outputBuffer)
  await fs.rename(tempPath, inputPath)

  return {
    inputBytes: inputBuffer.byteLength,
    outputBytes: outputBuffer.byteLength,
  }
}

async function main() {
  const { preset: presetName, dryRun } = parseArgs(process.argv.slice(2))
  const preset = PRESETS[presetName]
  if (!preset) {
    console.error(`Unknown preset "${presetName}". Use: ${Object.keys(PRESETS).join(', ')}`)
    process.exit(1)
  }

  const publicRoot = path.join(process.cwd(), 'public')
  const inputRoot = path.join(publicRoot, preset.inputDir)

  const files = await walkImages(inputRoot, preset.inputDir)
  if (files.length === 0) {
    console.error(`No images found under public/${preset.inputDir}`)
    process.exit(1)
  }

  console.log(
    dryRun ? '[dry-run] ' : '',
    `Optimizing ${files.length} file(s) in place → public/${preset.inputDir}/`
  )
  console.log(`Preset: ${presetName} (max width ${preset.maxWidth}, JPEG q${preset.quality})\n`)

  let totalIn = 0
  let totalOut = 0

  for (const file of files.sort((a, b) => a.relativePath.localeCompare(b.relativePath))) {
    if (dryRun) {
      const inputBuffer = await fs.readFile(file.absolutePath)
      totalIn += inputBuffer.byteLength
      console.log(`  would overwrite ${file.relativePath} (${formatBytes(inputBuffer.byteLength)} source)`)
      continue
    }

    const { inputBytes, outputBytes } = await optimizeFile(file.absolutePath, preset)
    totalIn += inputBytes
    totalOut += outputBytes
    const saved = inputBytes > 0 ? Math.round((1 - outputBytes / inputBytes) * 100) : 0
    console.log(
      `  ${path.basename(file.relativePath)}: ${formatBytes(inputBytes)} → ${formatBytes(outputBytes)} (−${saved}%)`
    )
  }

  if (!dryRun) {
    const saved = totalIn > 0 ? Math.round((1 - totalOut / totalIn) * 100) : 0
    console.log(`\nTotal: ${formatBytes(totalIn)} → ${formatBytes(totalOut)} (−${saved}%)`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
