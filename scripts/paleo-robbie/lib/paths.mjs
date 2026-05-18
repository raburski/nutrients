import path from "path"
import { fileURLToPath } from "url"

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
export const REPO_ROOT = path.resolve(SCRIPT_DIR, "../../..")
export const DATA_DIR = path.join(REPO_ROOT, "data/paleo-robbie")
export const RAW_DIR = path.join(DATA_DIR, "raw")
export const MANIFEST_PATH = path.join(DATA_DIR, "manifest.json")
export const OUTPUT_PATH = path.join(REPO_ROOT, "public/paleo_robbie_products.json")
export const SITEMAP_URL = "https://paleorobbie.com/sitemap.xml"
export const USER_AGENT = "NutrientsApp-PaleoRobbieScraper/1.0 (+local dev; nutrition research)"
