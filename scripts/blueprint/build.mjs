/**
 * Build public/blueprint_products.json from data/blueprint/raw/*.json
 */

import fs from "fs/promises"
import path from "path"
import { RAW_DIR, OUTPUT_PATH, MANIFEST_PATH } from "./lib/paths.mjs"
import { buildProductsFromRawRecords } from "./lib/transform.mjs"

async function loadRawRecords() {
	const files = await fs.readdir(RAW_DIR)
	const jsonFiles = files.filter(file => file.endsWith(".json"))
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

	const withPanel = records.filter(record => record.nutritionPanel?.texts?.length).length
	const products = buildProductsFromRawRecords(records)

	const meta = {
		builtAt: new Date().toISOString(),
		rawFileCount: records.length,
		rawWithNutritionPanel: withPanel,
		productCount: products.length,
		manifestLastRun: manifest?.lastRunAt ?? null,
	}

	const output = { meta, products }
	await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true })
	await fs.writeFile(OUTPUT_PATH, JSON.stringify(output))

	console.log(`Wrote ${products.length} products (${withPanel} raw files had nutrition panels).`)
	console.log(`Output: ${OUTPUT_PATH}`)
}

main().catch(error => {
	console.error(error)
	process.exit(1)
})
