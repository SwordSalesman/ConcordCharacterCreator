import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { Button, ButtonVariant } from "../../common/Button/Button";

export function Modal({
	open,
	onClose,
	title,
	subtitle,
	actions,
	body,
	size,
}: {
	open: boolean;
	onClose: () => void;
	title?: string | React.ReactNode;
	subtitle?: string | React.ReactNode;
	actions?: {
		label: string;
		onClick: () => void;
		variant?: ButtonVariant;
	}[];
	body?: React.ReactNode;
	size?: "small" | "medium";
}) {
	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				if (!open && onClose) onClose();
			}}
		>
			<DialogContent
				showCloseButton={false}
				className={`${
					size === "small" ? "w-[300px]" : "w-[500px]"
				} text-center sm:text-left`}
			>
				<div className="flex flex-col gap-4">
					<DialogHeader>
						{title && <DialogTitle>{title}</DialogTitle>}
						{subtitle && <DialogDescription>{subtitle}</DialogDescription>}
					</DialogHeader>
					{body}
					{actions && (
						<div className={`flex justify-center sm:justify-end gap-2`}>
							{actions?.map((action, i) => {
								return (
									<Button
										key={i}
										variant={action.variant}
										onClick={action.onClick}
										className={"flex-1"}
									>
										{action.label}
									</Button>
								);
							})}
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
