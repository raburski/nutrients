import { useEffect, useState } from "react"
import { styled } from "goober"
import Button from "./Button"
import {
	getDefaultResultSourceFilters,
	getSearchResultFilterOptions,
} from "./productSources"
import { getFaviconUrl } from "./productSourceDisplay"
import {
	ModalContent,
	ModalTitle,
	ModalSubtitle,
	ModalBody,
	ModalActions,
	ModalError,
} from "./modalContent"

const ModalScroll = styled('div')`
	max-height: 65vh;
	overflow-y: auto;
	padding-right: 4px;
`

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
	min-width: 0;
`

const SourceName = styled('div')`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 8px;
	font-size: 14px;
	font-weight: 600;
	color: #1a1a1a;
`

const SourceDescription = styled('div')`
	font-size: 12px;
	line-height: 1.4;
	color: #606060;
`

const Checkbox = styled('input')`
	margin-top: 2px;
	width: 16px;
	height: 16px;
	flex-shrink: 0;
	cursor: pointer;
`

const SourceIcon = styled('img')`
	width: 18px;
	height: 18px;
	flex-shrink: 0;
	border-radius: 4px;
	object-fit: contain;
	background-color: #eee;
`

const SourceEmoji = styled('span')`
	font-size: 16px;
	line-height: 1;
`

function SourceNameWithIcon({ filter }) {
	if (filter.faviconDomain) {
		return (
			<>
				<SourceIcon src={getFaviconUrl(filter.faviconDomain)} alt="" />
				{filter.name}
			</>
		)
	}
	if (filter.emoji) {
		return (
			<>
				<SourceEmoji>{filter.emoji}</SourceEmoji>
				{filter.name}
			</>
		)
	}
	return filter.name
}

export default function SearchResultFiltersModal({
	enabledSourceIds,
	resultSourceFilterIds,
	onSave,
	onCancel,
}) {
	const [selectedIds, setSelectedIds] = useState(resultSourceFilterIds)
	const [error, setError] = useState("")

	useEffect(() => {
		setSelectedIds(resultSourceFilterIds)
		setError("")
	}, [resultSourceFilterIds])

	function toggleFilter(filterId) {
		setSelectedIds(current => {
			if (current.includes(filterId)) {
				return current.filter(id => id !== filterId)
			}
			return [...current, filterId]
		})
	}

	function onSubmit(e) {
		e.preventDefault()
		const valid = getDefaultResultSourceFilters(enabledSourceIds)
		const resultFilters = selectedIds.filter(id => valid.includes(id))
		if (resultFilters.length === 0) {
			setError("Select at least one source to show in search results.")
			return
		}
		onSave(resultFilters)
	}

	const filterOptions = getSearchResultFilterOptions(enabledSourceIds)

	return (
		<form onSubmit={onSubmit}>
			<ModalContent style={{ minWidth: 360 }}>
				<ModalTitle>Show in search results</ModalTitle>
				<ModalSubtitle>
					Choose which product sources appear in the list below the nutrient selector.
				</ModalSubtitle>
				<ModalScroll>
					<ModalBody>
						{filterOptions.map(filter => {
							const checked = selectedIds.includes(filter.id)
							return (
								<SourceRow key={filter.id} $checked={checked}>
									<Checkbox
										type="checkbox"
										checked={checked}
										onChange={() => toggleFilter(filter.id)}
										onClick={e => e.stopPropagation()}
									/>
									<SourceText>
										<SourceName>
											<SourceNameWithIcon filter={filter} />
										</SourceName>
										<SourceDescription>{filter.description}</SourceDescription>
									</SourceText>
								</SourceRow>
							)
						})}
					</ModalBody>
				</ModalScroll>
				{error ? <ModalError>{error}</ModalError> : null}
				<ModalActions>
					<Button type="button" onClick={onCancel}>Cancel</Button>
					<Button type="submit" variant="primary">Save</Button>
				</ModalActions>
			</ModalContent>
		</form>
	)
}
