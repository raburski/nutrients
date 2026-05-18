/**
 * Scrape Blueprint Bryan Johnson products into data/blueprint/raw/{handle}.json
 *
 * Usage:
 *   node scripts/blueprint/scrape.mjs
 *   node scripts/blueprint/scrape.mjs --force
 *   node scripts/blueprint/scrape.mjs --limit 5
 */

import fs from "fs/promises"
import path from "path"
import { RAW_DIR, MANIFEST_PATH, PRODUCTS_JSON_URL, USER_AGENT } from "./lib/paths.mjs"
import { extractNutritionPanel, fetchShopifyProducts } from "./lib/extract.mjs"

const DELAY_MS = 350
const BASE_URL = "https://blueprint.bryanjohnson.com"

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
		headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
	})
	if (!response.ok) {
		throw new Error(`HTTP ${response.status} for ${url}`)
	}
	return response.text()
}

async function loadManifest() {
	try {
		const text = await fs.readFile(MANIFEST_PATH, "utf8")
		return JSON.parse(text)
	} catch {
		return {
			lastRunAt: null,
			productsJsonUrl: PRODUCTS_JSON_URL,
			handles: {},
			errors: {},
		}
	}
}

async function saveManifest(manifest) {
	await fs.mkdir(path.dirname(MANIFEST_PATH), { recursive: true })
	await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, "\t"))
}

function rawFilePath(handle) {
	return path.join(RAW_DIR, `${handle}.json`)
}

async function scrapeProduct(shopifyProduct) {
	const handle = shopifyProduct.handle
	const url = `${BASE_URL}/products/${handle}`
	const html = await fetchText(url)
	const nutritionPanel = extractNutritionPanel(html)

	const record = {
		handle,
		url,
		scrapedAt: new Date().toISOString(),
		shopify: {
			id: shopifyProduct.id,
			handle,
			title: shopifyProduct.title,
			product_type: shopifyProduct.product_type,
			tags: shopifyProduct.tags,
			vendor: shopifyProduct.vendor,
		},
		nutritionPanel,
	}

	await fs.mkdir(RAW_DIR, { recursive: true })
	await fs.writeFile(rawFilePath(handle), JSON.stringify(record, null, "\t"))

	return {
		hasNutrition: !!nutritionPanel?.texts?.length,
		name: shopifyProduct.title,
		nutrientLineCount: nutritionPanel?.texts?.length ?? 0,
	}
}

async function main() {
	const args = parseArgs(process.argv)
	const manifest = await loadManifest()

	console.log("Fetching Shopify product list…")
	const products = await fetchShopifyProducts(PRODUCTS_JSON_URL, USER_AGENT)
	console.log(`Found ${products.length} products.`)

	let handles = products.map(product => product.handle)
	if (args.limit) {
		handles = handles.slice(0, args.limit)
		products.splice(args.limit)
		console.log(`Limited to ${handles.length} products (--limit ${args.limit}).`)
	}

	const productByHandle = Object.fromEntries(products.map(product => [product.handle, product]))

	let scraped = 0
	let skipped = 0
	let failed = 0

	for (const handle of handles) {
		const outPath = rawFilePath(handle)
		if (!args.force) {
			try {
				await fs.access(outPath)
				skipped++
				continue
			} catch {
				// scrape
			}
		}

		try {
			const result = await scrapeProduct(productByHandle[handle])
			manifest.handles[handle] = {
				scrapedAt: new Date().toISOString(),
				productId: productByHandle[handle].id,
				hasNutrition: result.hasNutrition,
				nutrientLineCount: result.nutrientLineCount,
				name: result.name,
			}
			delete manifest.errors[handle]
			scraped++
			console.log(`✓ ${handle}${result.hasNutrition ? "" : " (no nutrition panel)"}`)
		} catch (error) {
			manifest.errors[handle] = {
				at: new Date().toISOString(),
				message: error.message,
			}
			failed++
			console.log(`✗ ${handle}: ${error.message}`)
		}

		await sleep(DELAY_MS)
	}

	manifest.lastRunAt = new Date().toISOString()
	manifest.productCount = handles.length
	await saveManifest(manifest)

	console.log("")
	console.log(`Done. Scraped: ${scraped}, skipped (cached): ${skipped}, failed: ${failed}`)
	console.log(`Raw files: ${RAW_DIR}`)
	console.log(`Manifest: ${MANIFEST_PATH}`)
	console.log("Next: npm run build:blueprint")
}

main().catch(error => {
	console.error(error)
	process.exit(1)
})
