import { styled } from 'goober'

export const FieldInput = styled('input')`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-self: flex-start;
    box-sizing: border-box;

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

const NumberInput = styled(FieldInput)`
    width: 72px;
    text-align: right;
`

const CHEVRON_SVG = encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="#505050" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
)

export const FieldSelect = styled('select')`
	display: flex;
	flex: 1;
	min-width: 0;
	box-sizing: border-box;
	border: 1px solid #909090;
	border-radius: .5rem;
	font-family: "Inter var", ui-sans-serif, system-ui, -apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
	font-size: .875rem;
	font-weight: 600;
	line-height: 1.25rem;
	padding: .35rem 2rem .35rem .5rem;
	box-shadow: 0 1px 2px 0 #B0B0B0 inset;
	background-color: white;
	color: #1a1a1a;
	cursor: pointer;
	appearance: none;
	background-image: url("data:image/svg+xml,${CHEVRON_SVG}");
	background-repeat: no-repeat;
	background-position: right .45rem center;
	background-size: 1rem;

	&:hover {
		background-color: #FAFAFA;
	}

	&:focus {
		outline: 2px solid #707070;
		outline-offset: 1px;
	}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	option {
		font-weight: 500;
		color: #1a1a1a;
	}
`

export default function TextField({ ...props }) {
    return <FieldInput type="text" {...props} />
}

export function NumberField({ ...props }) {
    return <NumberInput type="number" min="0" step="any" {...props} />
}
