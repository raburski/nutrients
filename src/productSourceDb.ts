import { Product } from "./types/nutrient"
import { PRODUCT_SOURCES } from "./productSources"

const DB_NAME = "nutrients"
const DB_VERSION = 1
const STORE_NAME = "productSources"
const MIGRATION_FLAG_KEY = "product_sources_idb_v1"

export type SourceCacheStatus = "cached" | "missing"

interface SourceRecord {
	sourceId: string
	products: Product[]
	savedAt: string
}

let dbPromise: Promise<IDBDatabase> | null = null

function openDatabase(): Promise<IDBDatabase> {
	if (dbPromise) return dbPromise

	dbPromise = new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION)

		request.onerror = () => {
			dbPromise = null
			reject(request.error ?? new Error("Failed to open IndexedDB"))
		}

		request.onupgradeneeded = () => {
			const db = request.result
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: "sourceId" })
			}
		}

		request.onsuccess = () => resolve(request.result)
	})

	return dbPromise
}

function runTransaction<T>(
	mode: IDBTransactionMode,
	run: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
	return openDatabase().then(db => new Promise((resolve, reject) => {
		const transaction = db.transaction(STORE_NAME, mode)
		const store = transaction.objectStore(STORE_NAME)
		const request = run(store)

		request.onsuccess = () => resolve(request.result)
		request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"))
		transaction.onerror = () => reject(transaction.error ?? new Error("IndexedDB transaction failed"))
	}))
}

export function purgeLegacyLocalStorageProductCaches() {
	const keysToRemove: string[] = []
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i)
		if (key && (key === "food_products" || key.startsWith("food_products_"))) {
			keysToRemove.push(key)
		}
	}
	keysToRemove.forEach(key => localStorage.removeItem(key))
}

export async function ensureProductSourceStorageReady() {
	await openDatabase()
	if (localStorage.getItem(MIGRATION_FLAG_KEY)) return

	purgeLegacyLocalStorageProductCaches()
	localStorage.setItem(MIGRATION_FLAG_KEY, "1")
}

export async function hasSourceCache(sourceId: string): Promise<boolean> {
	const record = await getSourceRecord(sourceId)
	return !!record && record.products.length > 0
}

export async function needsSourceDownload(sourceId: string): Promise<boolean> {
	const record = await getSourceRecord(sourceId)
	if (!record) return true
	return record.products.length === 0
}

export async function getSourceCacheStatus(sourceId: string): Promise<SourceCacheStatus> {
	if (await hasSourceCache(sourceId)) return "cached"
	return "missing"
}

async function getSourceRecord(sourceId: string): Promise<SourceRecord | null> {
	const result = await runTransaction<SourceRecord | undefined>("readonly", store => store.get(sourceId))
	return result ?? null
}

export async function loadSourceProducts(sourceId: string): Promise<Product[]> {
	const record = await getSourceRecord(sourceId)
	return record?.products ?? []
}

export async function saveSourceProducts(sourceId: string, products: Product[]) {
	const record: SourceRecord = {
		sourceId,
		products,
		savedAt: new Date().toISOString(),
	}
	await runTransaction("readwrite", store => store.put(record))
}

export async function deleteSourceCache(sourceId: string) {
	await runTransaction("readwrite", store => store.delete(sourceId))
}

export async function getCachedSourceIds(): Promise<string[]> {
	const cached: string[] = []
	for (const source of PRODUCT_SOURCES) {
		if (await hasSourceCache(source.id)) {
			cached.push(source.id)
		}
	}
	return cached
}
