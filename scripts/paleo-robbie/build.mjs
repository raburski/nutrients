/**
 * Build public/paleo_robbie_products.json from data/paleo-robbie/raw/*.json
 * Re-run after editing scripts/paleo-robbie/lib/transform.mjs
 */

import fs from "fs/promises"
import path from "path"
import { RAW_DIR, OUTPUT_PATH, MANIFEST_PATH } from "./lib/paths.mjs"
import { buildProductsFromRawRecords } from "./lib/transform.mjs"

async function loadRawRecords() {
	const files = await fs.readdir(RAW_DIR)
	const jsonFiles = files.filter(f => f.endsWith(".json"))
	const records = []

	for (const file of jsonFiles) {
		const text = await fs.readFile(path.join(RAW_DIR, file), "utf8")
		records.push(JSON.parse(text))
	}

	return records
}

async function main() {
	let manifest = null
	try {
		manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"))
	} catch {
		// optional
	}

	const records = await loadRawRecords()
	console.log(`Loaded ${records.length} raw scrape files.`)

	const withNutrition = records.filter(r => r.data?.nutrition_id).length
	const products = buildProductsFromRawRecords(records)

	const meta = {
		builtAt: new Date().toISOString(),
		rawFileCount: records.length,
		rawWithNutrition: withNutrition,
		productCount: products.length,
		manifestLastRun: manifest?.lastRunAt ?? null,
	}

	const output = { meta, products }
	await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true })
	await fs.writeFile(OUTPUT_PATH, JSON.stringify(output))

	console.log(`Wrote ${products.length} products (${withNutrition} raw files had nutrition).`)
	console.log(`Output: ${OUTPUT_PATH}`)
}

main().catch(error => {
	console.error(error)
	process.exit(1)
})
