import { cn } from "@/lib/utils";
import { Input as UiInput } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { ReactNode } from "react";

const TEXT_AREA_LIMIT = 4000;

interface GenericInputProps {
	className?: string;
	label?: string;
	error?: string;
}

export function Input({
	className,
	type,
	label,
	error,
	...props
}: {
	type: string;
} & GenericInputProps &
	React.ComponentProps<"input">) {
	let inputComponent = (
		<UiInput type={type} className={className} maxLength={TEXT_AREA_LIMIT} {...props} />
	);

	if (error) {
		inputComponent = wrapWithError(
			<UiInput
				type={type}
				className={cn("border-destructive", className)}
				maxLength={TEXT_AREA_LIMIT}
				{...props}
			/>,
			error
		);
	}

	if (label) {
		return wrapWithLabel(inputComponent, label, props.id);
	}

	return inputComponent;
}

export function TextArea({
	className,
	label,
	error,
	...props
}: GenericInputProps & React.ComponentProps<"textarea">) {
	let inputComponent = <Textarea className={className} maxLength={TEXT_AREA_LIMIT} {...props} />;

	if (error) {
		inputComponent = wrapWithError(
			<Textarea
				className={cn("border-destructive", className)}
				maxLength={TEXT_AREA_LIMIT}
				{...props}
			/>,
			error
		);
	}

	if (label) {
		return wrapWithLabel(inputComponent, label, props.id);
	}

	return inputComponent;
}

function wrapWithError(inputElement: ReactNode, error: string) {
	return (
		<div className="flex flex-col">
			{inputElement}
			<span className="text-destructive text-xs text-center mt-0.5">{error}</span>
		</div>
	);
}

function wrapWithLabel(inputElement: ReactNode, label: string, id?: string) {
	return (
		<div className="grid w-full items-center gap-0">
			<label htmlFor={id}>{label}</label>
			{inputElement}
		</div>
	);
}
