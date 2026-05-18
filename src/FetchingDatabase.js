import { styled } from "goober"
import Modal from "./Modal"
import Button from "./Button"
import { ModalContent, ModalTitle, ModalSubtitle, ModalActions } from "./modalContent"

const Progress = styled('div')`
	font-size: 13px;
	line-height: 1.5;
	color: ${props => props.$failed ? "#c62828" : "#404040"};
	margin-top: 8px;
`

export default function FetchingDatabase({ message, failed, onDismiss }) {
	return (
		<Modal isOpen onClickAway={failed ? onDismiss : () => {}}>
			<ModalContent>
				<ModalTitle>{failed ? "Could not load databases" : "Loading product databases"}</ModalTitle>
				<ModalSubtitle>
					{failed
						? "Fix the issue below, then try Save & sync again."
						: "Large files are downloaded once and stored in IndexedDB in your browser."}
				</ModalSubtitle>
				{message ? <Progress $failed={failed}>{message}</Progress> : null}
				{failed ? (
					<ModalActions align="start">
						<Button type="button" variant="primary" onClick={onDismiss}>Close</Button>
					</ModalActions>
				) : null}
			</ModalContent>
		</Modal>
	)
}
