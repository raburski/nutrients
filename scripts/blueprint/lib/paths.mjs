import path from "path"
import { fileURLToPath } from "url"

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
export const REPO_ROOT = path.resolve(SCRIPT_DIR, "../../..")
export const DATA_DIR = path.join(REPO_ROOT, "data/blueprint")
export const RAW_DIR = path.join(DATA_DIR, "raw")
export const MANIFEST_PATH = path.join(DATA_DIR, "manifest.json")
export const OUTPUT_PATH = path.join(REPO_ROOT, "public/blueprint_products.json")
export const PRODUCTS_JSON_URL = "https://blueprint.bryanjohnson.com/collections/all/products.json?limit=250"
export const USER_AGENT = "NutrientsApp-BlueprintScraper/1.0 (+local dev; nutrition research)"
