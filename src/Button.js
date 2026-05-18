import { styled } from "goober"

function variantStyles(variant) {
	if (variant === "primary") {
		return `
			background-color: #1a1a1a;
			border-color: #1a1a1a;
			color: white;

			&:hover:not(:disabled) {
				background-color: #333333;
				border-color: #333333;
			}
		`
	}
	if (variant === "danger") {
		return `
			background-color: white;
			border-color: #d32f2f;
			color: #d32f2f;

			&:hover:not(:disabled) {
				background-color: #fff5f5;
			}
		`
	}
	if (variant === "ghost") {
		return `
			background-color: transparent;
			border-color: transparent;
			color: #505050;
			padding: 4px 8px;

			&:hover:not(:disabled) {
				background-color: #ebebeb;
			}
		`
	}
	return `
		background-color: white;
		border-color: #c4c4c4;
		color: #1a1a1a;

		&:hover:not(:disabled) {
			background-color: #f5f5f5;
		}
	`
}

function sizeStyles(size, variant) {
	if (variant === "ghost") {
		return `font-size: ${size === "small" ? "12px" : "13px"};`
	}
	if (size === "small") {
		return `
			font-size: 12px;
			padding: 5px 12px;
		`
	}
	return `
		font-size: 13px;
		padding: 8px 16px;
	`
}

const StyledButton = styled('button')`
	font-family: "Inter var", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
	font-weight: 600;
	line-height: 1.25rem;
	border-radius: 8px;
	border-width: 1px;
	border-style: solid;
	cursor: pointer;
	transition: background-color 0.12s ease, border-color 0.12s ease, color 0.12s ease;

	${props => sizeStyles(props.size, props.variant)}
	${props => variantStyles(props.variant || "secondary")}

	&:disabled {
		opacity: 0.45;
		cursor: default;
	}
`

export default function Button({ variant = "secondary", size = "default", ...props }) {
	return <StyledButton variant={variant} size={size} {...props} />
}
