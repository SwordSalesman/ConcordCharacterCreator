import { cn } from "@/lib/utils";
import { Input as UiInput } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { ReactNode } from "react";

const TEXT_AREA_LIMIT = 4000;

interface GenericInputProps {
	className?: string;
	label?: string;
	sublabel?: string;
	error?: string;
}

export function Input({
	className,
	type,
	label,
	sublabel,
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
		inputComponent = wrapWithError({
			inputElement: (
				<UiInput
					type={type}
					className={cn("border-destructive", className)}
					maxLength={TEXT_AREA_LIMIT}
					{...props}
				/>
			),
			error,
		});
	}

	if (label) {
		return wrapWithLabel({ inputElement: inputComponent, label, sublabel, id: props.id });
	}

	return inputComponent;
}

export function TextArea({
	className,
	label,
	sublabel,
	error,
	...props
}: GenericInputProps & React.ComponentProps<"textarea">) {
	let inputComponent = <Textarea className={className} maxLength={TEXT_AREA_LIMIT} {...props} />;

	if (error) {
		inputComponent = wrapWithError({
			inputElement: (
				<Textarea
					className={cn("border-destructive", className)}
					maxLength={TEXT_AREA_LIMIT}
					{...props}
				/>
			),
			error,
		});
	}

	if (label) {
		return wrapWithLabel({ inputElement: inputComponent, label, sublabel, id: props.id });
	}

	return inputComponent;
}

function wrapWithError({ inputElement, error }: { inputElement: ReactNode; error: string }) {
	return (
		<div className="flex flex-col">
			{inputElement}
			<span className="text-destructive text-xs text-center mt-0.5">{error}</span>
		</div>
	);
}

function wrapWithLabel({
	inputElement,
	label,
	sublabel,
	id,
}: {
	inputElement: ReactNode;
	label: string;
	sublabel?: string;
	id?: string;
}) {
	return (
		<div className="grid w-full items-center gap-0">
			<label htmlFor={id}>{label}</label>
			{sublabel && <span className="text-muted-foreground text-sm">{sublabel}</span>}
			{inputElement}
		</div>
	);
}
