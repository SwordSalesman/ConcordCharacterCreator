import { GiOpenBook } from "react-icons/gi";
import React from "react";
import { PATH_WIKI } from "@/utils/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function WikiLink({
	path,
	className,
	...rest
}: {
	path?: string;
	className?: string;
}) {
	const root = PATH_WIKI;
	const url = path ? root + path : root;

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.stopPropagation();
	};

	return (
		<Link href={url} onClick={handleClick} target="_blank" rel="noreferrer">
			<div
				title={url}
				className={cn(
					"rounded-md w-[25px] h-[25px] flex justify-center items-center text-contrast-foreground bg-contrast hover:cursor-help max-sm:w-[30px] max-sm:h-[30px]",
					className
				)}
				{...rest}
			>
				<GiOpenBook size={19} color="white" />
			</div>
		</Link>
	);
}
