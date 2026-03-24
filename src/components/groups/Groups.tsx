import { FaExternalLinkAlt } from "react-icons/fa";

export function Groups() {
	return (
		<div className="mx-auto px-4 py-8 max-w-[500px] flex flex-col text-center gap-5">
			<p>
				If you're in a band and it hasn't been submitted via the Google Form below, please
				do so before <b>September 13th</b>. Only one member of your band needs to submit.
			</p>
			<div className="w-fit mx-auto">
				<a
					href="https://docs.google.com/forms/d/e/1FAIpQLSfs5PK55UuYUo6MSvzwRGFeBMerAavh61ADhYZK7oJmO2A0qw/viewform"
					target="_blank"
					rel="noreferrer"
				>
					<div className="text-center px-3.5 py-1.5 rounded bg-primary text-primary-foreground flex items-center justify-center gap-2">
						Submit your group
						<FaExternalLinkAlt size={15} />
					</div>
				</a>
			</div>
		</div>
	);
}
