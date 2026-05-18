import { styled } from "goober"

export const ModalContent = styled('div')`
	display: flex;
	flex-direction: column;
	padding: 16px 20px 20px;
	min-width: 320px;
`

export const ModalTitle = styled('h2')`
	margin: 0;
	font-size: 20px;
	font-weight: 700;
	line-height: 1.25;
	color: #1a1a1a;
`

export const ModalSubtitle = styled('div')`
	margin: 4px 0 16px;
	font-size: 12px;
	line-height: 1.4;
	color: #606060;
`

export const ModalBody = styled('div')`
	display: flex;
	flex-direction: column;
	gap: 10px;
`

export const ModalSectionTitle = styled('h3')`
	margin: 8px 0 0;
	font-size: 13px;
	font-weight: 700;
	color: #303030;
`

export const ModalSectionHint = styled('div')`
	margin: -4px 0 4px;
	font-size: 11px;
	line-height: 1.4;
	color: #808080;
`

export const ModalActions = styled('div')`
	display: flex;
	flex-direction: row;
	justify-content: ${props => props.align === "start" ? "flex-start" : "flex-end"};
	align-items: center;
	gap: 8px;
	margin-top: 20px;
	padding-top: 16px;
	border-top: 1px solid #e8e8e8;
`

export const ModalFieldRow = styled('div')`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 12px;
`

export const ModalFieldLabel = styled('label')`
	flex: 1;
	font-size: 13px;
	font-weight: 600;
	color: #303030;
`

export const ModalFieldUnit = styled('span')`
	font-size: 12px;
	color: #707070;
	min-width: 16px;
	text-align: right;
`

export const ModalError = styled('div')`
	font-size: 12px;
	color: #c62828;
	margin-top: 4px;
`
