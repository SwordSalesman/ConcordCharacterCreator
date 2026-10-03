import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import toast from "react-hot-toast";
import ContentWrapper from "@/components/layout/ContentWrapper";
import { Input } from "@/components/common/Input/Input";
import { Button } from "@/components/common/Button/Button";
import { resetPasswordWithCode } from "@/hooks/use-firebase";
import { PATH_HOME } from "@/utils/constants";

// Firebase's default hosted reset page auto-verifies the oobCode on load, which
// lets email security scanners (that prefetch links) burn the code before the
// user clicks it. This page only touches the code on explicit form submit.
export default function ResetPassword() {
	const router = useRouter();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [done, setDone] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);

	const { mode, oobCode } = router.query;
	const validLink =
		typeof mode === "string" && mode === "resetPassword" && typeof oobCode === "string";

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (typeof oobCode !== "string") return;

		if (password.length < 6) {
			setError("Password must be at least 6 characters.");
			return;
		}
		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		setError(undefined);
		setLoading(true);
		try {
			await resetPasswordWithCode(oobCode, password);
			setDone(true);
			toast.success("Password reset successfully.");
		} catch (err: any) {
			if (
				err.code === "auth/expired-action-code" ||
				err.code === "auth/invalid-action-code"
			) {
				setError(
					"This reset link has expired or already been used. Please request a new one.",
				);
			} else if (err.code === "auth/weak-password") {
				setError("Password is too weak.");
			} else {
				setError("Something went wrong. Please try again.");
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<ContentWrapper layout="narrow">
			<div className="w-90 mx-auto">
				<h1 className="text-lg font-bold text-center mb-4">Reset Password</h1>
				{!router.isReady ? null : !validLink ? (
					<p className="text-center">
						This reset link is invalid. Please request a new one from the login menu.
					</p>
				) : done ? (
					<p className="text-center">
						Your password has been reset.{" "}
						<Link href={PATH_HOME} className="underline">
							Return home
						</Link>{" "}
						to log in.
					</p>
				) : (
					<form onSubmit={handleSubmit}>
						<div className="flex flex-col gap-2">
							<Input
								type="password"
								label="New Password"
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<Input
								type="password"
								label="Confirm Password"
								id="confirmPassword"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								error={error}
							/>
							<Button
								type="submit"
								disabled={loading}
								variant="primary"
								className="mt-3"
								spinner={loading}
							>
								Set New Password
							</Button>
						</div>
					</form>
				)}
			</div>
		</ContentWrapper>
	);
}
