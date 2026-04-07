import { cn } from "@/lib/utils";
import { Input as UiInput } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { ReactNode } from "react";

export const TEXT_AREA_LIMIT = 4000;

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
		return wrapWithLabel({
			inputElement: inputComponent,
			label,
			sublabel,
			id: props.id,
			value: props.value,
		});
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
	value,
}: {
	inputElement: ReactNode;
	label: string;
	sublabel?: string;
	id?: string;
	value?: string | number | readonly string[] | undefined;
}) {
	const charsRemaining =
		value && typeof value === "string" ? TEXT_AREA_LIMIT - value.length : undefined;

	return (
		<div className="grid w-full items-center gap-0 relative">
			<label htmlFor={id}>{label}</label>
			{sublabel && <span className="text-muted-foreground text-sm">{sublabel}</span>}
			{inputElement}
			{charsRemaining !== undefined && charsRemaining < TEXT_AREA_LIMIT / 2 && (
				<div
					className={`text-muted-foreground text-xs text-right top-full right-0 animate-warning-fade-in`}
				>
					{charsRemaining}/{TEXT_AREA_LIMIT}
				</div>
			)}
		</div>
	);
}
