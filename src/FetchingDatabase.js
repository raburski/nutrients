import { styled } from "goober"
import Modal from "./Modal"

const Container = styled('div')`
    display: flex;
    flex-direction: column;
    padding: 24px;
    justify-content: center;
`

const Title = styled('div')`
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 22px;
`

export default function FetchingDatabase() {
    return (
        <Modal isOpen>
            <Container>
                <Title>Fetching database...</Title>
                This may take a while since it is almost 100mb.<br />
                It will be stored in your browser.<br />
                It won't have to be loaded again next time!
            </Container>
        </Modal>
    )
}