import { useEffect, useState } from "react"
import { styled } from "goober"
import Button from "./Button"
import { PRODUCT_SOURCES } from "./productSources"
import { getSourceCacheStatus } from "./productSourceDb"
import {
	ModalContent,
	ModalTitle,
	ModalSubtitle,
	ModalBody,
	ModalActions,
	ModalError,
} from "./modalContent"

const SourceRow = styled('label')`
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	gap: 12px;
	padding: 12px;
	border: 1px solid #e0e0e0;
	border-radius: 10px;
	cursor: pointer;
	background-color: ${props => props.$checked ? "#f7f7f7" : "white"};

	&:hover {
		border-color: #c4c4c4;
	}
`

const SourceText = styled('div')`
	display: flex;
	flex-direction: column;
	flex: 1;
	gap: 4px;
`

const SourceName = styled('div')`
	font-size: 14px;
	font-weight: 600;
	color: #1a1a1a;
`

const SourceDescription = styled('div')`
	font-size: 12px;
	line-height: 1.4;
	color: #606060;
`

const SourceMeta = styled('div')`
	font-size: 11px;
	color: #808080;
`

const Checkbox = styled('input')`
	margin-top: 2px;
	width: 16px;
	height: 16px;
	cursor: pointer;
`

function cacheStatusLabel(status) {
	if (status === "cached") return "Downloaded"
	return "Not downloaded yet"
}

export default function ProductSourcesModal({ enabledSourceIds, onSave, onCancel, cacheRevision }) {
	const [selectedIds, setSelectedIds] = useState(enabledSourceIds)
	const [error, setError] = useState("")
	const [cacheStatuses, setCacheStatuses] = useState({})

	useEffect(() => {
		setSelectedIds(enabledSourceIds)
		setError("")
	}, [enabledSourceIds])

	useEffect(() => {
		let cancelled = false

		async function loadStatuses() {
			const statuses = {}
			for (const source of PRODUCT_SOURCES) {
				statuses[source.id] = await getSourceCacheStatus(source.id)
			}
			if (!cancelled) setCacheStatuses(statuses)
		}

		loadStatuses()
		return () => { cancelled = true }
	}, [cacheRevision])

	function toggleSource(sourceId) {
		setSelectedIds(current => {
			if (current.includes(sourceId)) {
				return current.filter(id => id !== sourceId)
			}
			return [...current, sourceId]
		})
	}

	function onSubmit(e) {
		e.preventDefault()
		if (selectedIds.length === 0) {
			setError("Select at least one product database.")
			return
		}
		onSave(selectedIds)
	}

	return (
		<form onSubmit={onSubmit}>
			<ModalContent>
				<ModalTitle>Product databases</ModalTitle>
				<ModalSubtitle>
					Choose which sources to download and use for search. Data is stored in IndexedDB in your browser.
				</ModalSubtitle>
				<ModalBody>
					{PRODUCT_SOURCES.map(source => {
						const checked = selectedIds.includes(source.id)
						const cacheStatus = cacheStatuses[source.id] || "missing"
						return (
							<SourceRow key={`${source.id}-${cacheRevision}`} $checked={checked}>
								<Checkbox
									type="checkbox"
									checked={checked}
									onChange={() => toggleSource(source.id)}
									onClick={e => e.stopPropagation()}
								/>
								<SourceText>
									<SourceName>{source.name}</SourceName>
									<SourceDescription>{source.description}</SourceDescription>
									<SourceMeta>
										{source.approximateSize}
										{" · "}
										{cacheStatusLabel(cacheStatus)}
									</SourceMeta>
								</SourceText>
							</SourceRow>
						)
					})}
					{error ? <ModalError>{error}</ModalError> : null}
				</ModalBody>
				<ModalActions>
					<Button type="button" onClick={onCancel}>Cancel</Button>
					<Button type="submit" variant="primary">Save &amp; sync</Button>
				</ModalActions>
			</ModalContent>
		</form>
	)
}
