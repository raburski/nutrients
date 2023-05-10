import { styled } from 'goober'

const Input = styled('input')`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-self: flex-start;

    border: 1px solid #909090;
    border-radius: .5rem;
    font-family: "Inter var",ui-sans-serif,system-ui,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
    font-size: .875rem;
    font-weight: 600;
    line-height: 1.25rem;
    padding: .35rem .4rem;
    text-decoration: none #D1D5DB solid;
    text-decoration-thickness: auto;

    box-shadow: 0 1px 2px 0 #B0B0B0 inset;
    background-color: white;
    color: black;

    &:hover {
        background-color: #FAFAFA;
    }
    &:active {
        box-shadow: 0 1px 2px 0 gray inset;
    }
`

export default function TextField({ ...props }) {
    return <Input type="text" {...props} />
}
