/**
 * Scrape Paleo Robbie grocery products into data/paleo-robbie/raw/{slug}.json
 *
 * Usage:
 *   node scripts/paleo-robbie/scrape.mjs              # scrape missing slugs only
 *   node scripts/paleo-robbie/scrape.mjs --force      # re-scrape all
 *   node scripts/paleo-robbie/scrape.mjs --limit 20   # scrape at most 20 (for testing)
 */

import fs from "fs/promises"
import path from "path"
import { RAW_DIR, MANIFEST_PATH, SITEMAP_URL, USER_AGENT } from "./lib/paths.mjs"

const DELAY_MS = 350

function parseArgs(argv) {
	const args = { force: false, limit: null }
	for (let i = 2; i < argv.length; i++) {
		if (argv[i] === "--force") args.force = true
		if (argv[i] === "--limit" && argv[i + 1]) {
			args.limit = parseInt(argv[i + 1], 10)
			i++
		}
	}
	return args
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchText(url) {
	const response = await fetch(url, {
		headers: { "User-Agent": USER_AGENT, Accept: "text/html,application/xml" },
	})
	if (!response.ok) {
		throw new Error(`HTTP ${response.status} for ${url}`)
	}
	return response.text()
}

function parseSlugsFromSitemap(xml) {
	const matches = xml.matchAll(/grocery_details\/([^<]+)/g)
	return [...new Set([...matches].map(m => m[1].trim()))]
}

function extractPageProps(html) {
	const match = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s)
	if (!match) return null
	const nextData = JSON.parse(match[1])
	return nextData?.props?.pageProps ?? null
}

async function loadManifest() {
	try {
		const text = await fs.readFile(MANIFEST_PATH, "utf8")
		return JSON.parse(text)
	} catch {
		return {
			lastRunAt: null,
			sitemapUrl: SITEMAP_URL,
			slugs: {},
			errors: {},
		}
	}
}

async function saveManifest(manifest) {
	await fs.mkdir(path.dirname(MANIFEST_PATH), { recursive: true })
	await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, "\t"))
}

function rawFilePath(slug) {
	return path.join(RAW_DIR, `${slug}.json`)
}

async function scrapeProduct(slug) {
	const url = `https://paleorobbie.com/grocery_details/${slug}`
	const html = await fetchText(url)
	const pageProps = extractPageProps(html)

	if (!pageProps) {
		throw new Error("Missing __NEXT_DATA__ pageProps")
	}

	if (pageProps.statusCode === 404 || pageProps.error) {
		throw new Error(pageProps.error || "Product page not found")
	}

	const data = pageProps.data
	if (!data) {
		throw new Error("Missing product data in pageProps")
	}

	const record = {
		slug,
		url,
		scrapedAt: new Date().toISOString(),
		productId: data.id ?? pageProps.product_id ?? null,
		data,
	}

	await fs.mkdir(RAW_DIR, { recursive: true })
	await fs.writeFile(rawFilePath(slug), JSON.stringify(record, null, "\t"))

	return {
		hasNutrition: !!data.nutrition_id,
		productId: record.productId,
		name: data.name,
	}
}

async function main() {
	const args = parseArgs(process.argv)
	const manifest = await loadManifest()

	console.log("Fetching sitemap…")
	const sitemapXml = await fetchText(SITEMAP_URL)
	let slugs = parseSlugsFromSitemap(sitemapXml)
	console.log(`Found ${slugs.length} grocery product URLs in sitemap.`)

	if (args.limit) {
		slugs = slugs.slice(0, args.limit)
		console.log(`Limited to ${slugs.length} products (--limit ${args.limit}).`)
	}

	let scraped = 0
	let skipped = 0
	let failed = 0

	for (const slug of slugs) {
		const outPath = rawFilePath(slug)
		if (!args.force) {
			try {
				await fs.access(outPath)
				skipped++
				continue
			} catch {
				// not cached — scrape
			}
		}

		try {
			const result = await scrapeProduct(slug)
			manifest.slugs[slug] = {
				scrapedAt: new Date().toISOString(),
				productId: result.productId,
				hasNutrition: result.hasNutrition,
				name: result.name,
			}
			delete manifest.errors[slug]
			scraped++
			console.log(`✓ ${slug}${result.hasNutrition ? "" : " (no nutrition)"}`)
		} catch (error) {
			manifest.errors[slug] = {
				at: new Date().toISOString(),
				message: error.message,
			}
			failed++
			console.log(`✗ ${slug}: ${error.message}`)
		}

		await sleep(DELAY_MS)
	}

	manifest.lastRunAt = new Date().toISOString()
	manifest.slugCount = slugs.length
	await saveManifest(manifest)

	console.log("")
	console.log(`Done. Scraped: ${scraped}, skipped (cached): ${skipped}, failed: ${failed}`)
	console.log(`Raw files: ${RAW_DIR}`)
	console.log(`Manifest: ${MANIFEST_PATH}`)
	console.log("Next: npm run build:paleo-robbie")
}

main().catch(error => {
	console.error(error)
	process.exit(1)
})
