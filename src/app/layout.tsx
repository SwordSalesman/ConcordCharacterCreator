import Header from "@/layout/header/header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<Header />
				<div>{children}</div>
			</body>
		</html>
	);
}
