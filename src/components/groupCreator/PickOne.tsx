import { Chip } from "../common/Chip/Chip";
import WikiLink from "../common/WikiLink/WikiLink";

export function PickOne({
	handleClick,
	value,
	title,
	subtitle,
	options,
	allowNone,
	link,
}: {
	handleClick: (value: string | undefined) => void;
	value?: string;
	title?: string;
	subtitle?: string;
	options: string[];
	allowNone?: string;
	link?: string;
}) {
	return (
		<div>
			{title && <p>{title}</p>}
			{subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
			{link && <WikiLink path={link} />}
			<div className="flex gap-1 flex-wrap">
				{allowNone && (
					<Chip key="none" onClick={() => handleClick(undefined)} selected={!value}>
						{allowNone}
					</Chip>
				)}
				{options.map((g) => (
					<Chip key={g} onClick={() => handleClick(g)} selected={value === g}>
						{g}
					</Chip>
				))}
			</div>
		</div>
	);
}
