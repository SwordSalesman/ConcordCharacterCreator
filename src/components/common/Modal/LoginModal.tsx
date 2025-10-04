import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import useUserContext from "@/hooks/use-user-context";
import { Input, TextArea } from "../Input/Input";
import { Button } from "../Button/Button";
import {
	logInWithEmailAndPassword,
	logout,
	registerWithEmailAndPassword,
	sendPasswordReset,
} from "@/hooks/use-firebase";
import toast from "react-hot-toast";

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState<{
		name: string;
		email: string;
		password: string;
	}>({ name: "", email: "", password: "" });
	const [validInputs, setValidInputs] = useState<{
		validEmail: boolean;
		validPassword: boolean;
		validName: boolean;
	}>({
		validEmail: true,
		validPassword: true,
		validName: true,
	});
	const { user, name: username, isAdmin } = useUserContext();

	useEffect(() => {
		if (open) {
			setForm({ name: "", email: "", password: "" });
			setValidInputs({ validEmail: true, validPassword: true, validName: true });
			if (state === "forgotpassword") setState("login");
		}
	}, [open]);

	useEffect(() => {
		onClose();
	}, [user]);

	function handleClose() {
		if (!loading) {
			onClose();
		}
	}

	function validateInputs() {
		const validName = ["login", "forgotpassword"].includes(state) || /\w+ \w+/.test(form.name);
		const validEmail = /(.+@.+\..+)/.test(form.email);
		const validPassword = state === "forgotpassword" || form.password.length >= 6;

		setValidInputs({ validEmail, validPassword, validName });
		return validEmail && validPassword && validName;
	}

	const [state, setState] = useState<"login" | "register" | "forgotpassword">("login");

	async function handleFormSubmit() {
		setLoading(true);
		try {
			if (state === "login") {
				await logInWithEmailAndPassword(form.email, form.password);
				toast.success("Welcome back!");
			} else if (state === "register") {
				await registerWithEmailAndPassword(form.name, form.email, form.password);
				toast.success("Account created.");
			} else if (state === "forgotpassword") {
				await sendPasswordReset(form.email);
				toast.success("Password reset email sent.");
				setState("login");
			}
		} catch (error) {
			console.error(`Error during ${state} action:`, error);
			const errorMessage = `Issue ${
				state === "login"
					? "logging in"
					: state === "register"
					? "registering"
					: "resetting password"
			}`;
			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	}

	async function handleLogout() {
		setLoading(true);
		try {
			await logout();
			toast.success("Logged out.");
		} catch (error) {
			console.error("Error during logout:", error);
		} finally {
			setLoading(false);
		}
	}

	const loginForm = (
		<form
			onSubmit={(e: any) => {
				e.preventDefault();
				if (validateInputs()) {
					handleFormSubmit();
				}
			}}
		>
			<div className="flex flex-col gap-2">
				{state === "register" && (
					<Input
						type="text"
						label="Name"
						id="name"
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
						error={!validInputs.validName ? "Please enter your full name." : undefined}
					/>
				)}
				<Input
					type="email"
					label="Email"
					id="email"
					value={form.email}
					onChange={(e) => setForm({ ...form, email: e.target.value })}
					error={
						!validInputs.validEmail ? "Please enter a valid email address." : undefined
					}
				/>
				{state !== "forgotpassword" && (
					<Input
						type="password"
						label="Password"
						id="password"
						value={form.password}
						onChange={(e) => setForm({ ...form, password: e.target.value })}
						error={
							!validInputs.validPassword
								? "Password must be at least 6 characters."
								: undefined
						}
					/>
				)}
				<Button
					type="submit"
					disabled={loading}
					variant="primary"
					className="mt-3"
					spinner={loading}
				>
					{state === "login"
						? "Login"
						: state === "register"
						? "Create Account"
						: "Send Recovery Email"}
				</Button>
			</div>
		</form>
	);

	const controls = (
		<div className="flex flex-col gap-1">
			{state === "login" && (
				<Button onClick={() => setState("forgotpassword")} variant="ghost" size="sm">
					Forgotten your password?
				</Button>
			)}
			{state === "forgotpassword" && (
				<Button onClick={() => setState("login")} variant="ghost" size="sm">
					Back to Login
				</Button>
			)}
			{state === "register" && (
				<Button onClick={() => setState("login")} variant="ghost" size="sm">
					Already have an account? Login here.
				</Button>
			)}
			{state === "login" && (
				<Button onClick={() => setState("register")} variant="ghost" size="sm">
					Don't have an account? Register here.
				</Button>
			)}
		</div>
	);

	if (user) {
		return (
			<Modal
				open={open}
				onClose={handleClose}
				title={"Account"}
				// subtitle={`${user.email}`}
				actions={[{ label: "Logout", onClick: handleLogout }]}
				body={
					<div className="flex flex-col gap-2">
						<span>
							<p className="text-sm text-muted-foreground">Name</p>
							<p className="">{username}</p>
						</span>
						<span>
							<p className="text-sm text-muted-foreground">Email</p>
							<p className="">{user.email}</p>
						</span>
						{isAdmin ? <p className="text-primary">You have admin access!</p> : null}
					</div>
				}
				size="small"
			/>
		);
	}

	return (
		<Modal
			open={open}
			title={
				state === "login"
					? "Login"
					: state === "register"
					? "Create Account"
					: "Reset Password"
			}
			onClose={handleClose}
			body={
				<div className="flex flex-col gap-4">
					{loginForm}
					{controls}
				</div>
			}
			size="small"
		/>
	);
}
