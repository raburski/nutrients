import { styled } from "goober"

const EmojiButton = styled('button')`
    font-size: 14px;
    margin-left: 12px;
    padding-left: 8px;
    padding-right: 8px;
    border-radius: 16px;
    border-width: 0px;
    cursor: pointer;
    background-color: transparent;
    &:hover {
        background-color: #d9d9d9;
    }
`

export default EmojiButton