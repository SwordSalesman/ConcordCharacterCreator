import { Box } from "@mui/material";
import Link from "next/link";
import React from "react";

export default function Home() {
	return (
		<Box display="flex" flexDirection="column">
			<h2>Home</h2>
			<Link href="/approvals">Approvals</Link>
			<Link href="/creator">Character Creator</Link>
		</Box>
	);
}
