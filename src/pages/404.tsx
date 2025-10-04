import ContentWrapper from "@/components/layout/ContentWrapper";

export default function NotFound() {
	return (
		<ContentWrapper>
			<div className="justify-center items-center text-center pt-10 gap-1">
				<h1 className="text-lg font-bold">404 - Not Found</h1>
				<i>The page you're looking for must be on a conflux.</i>
			</div>
		</ContentWrapper>
	);
}
