import { useEffect, useRef } from "react";
import type { RefObject } from "react";

const CURSED_TEXT = "YOU ARE NOT PERMITTED";

/**
 * "Blindfold of the Uninitiated" curse: while active, replaces all rendered
 * text within the given container with CURSED_TEXT, operating directly on
 * DOM text nodes so no component needs to know about the curse.
 */
export function useBlindfoldCurse(containerRef: RefObject<HTMLElement | null>, active: boolean) {
	const originalText = useRef(new WeakMap<Text, string>());

	useEffect(() => {
		if (!active) return;
		let animationFrame: number | undefined;
		let stopCursing: (() => void) | undefined;

		function curseNode(node: Text) {
			if (!node.nodeValue || !node.nodeValue.trim() || CURSED_TEXT.includes(node.nodeValue))
				return;

			const desiredLength = Math.min(CURSED_TEXT.length, node.nodeValue.length);
			if (!originalText.current.has(node)) {
				originalText.current.set(node, node.nodeValue);
			}
			node.nodeValue =
				node.nodeValue === "herb-garden"
					? CURSED_TEXT
					: CURSED_TEXT.slice(0, desiredLength);
		}

		function curseSubtree(root: Node) {
			if (root.nodeType === Node.TEXT_NODE) {
				curseNode(root as Text);
				return;
			}
			const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
			let node: Node | null;
			while ((node = walker.nextNode())) {
				curseNode(node as Text);
			}
		}

		function startCursing() {
			const container = containerRef.current;
			if (!container) {
				animationFrame = window.requestAnimationFrame(startCursing);
				return;
			}

			curseSubtree(container);

			// Catch any text added/changed after the initial sweep (re-renders, animations, etc).
			const observer = new MutationObserver((mutations) => {
				for (const mutation of mutations) {
					if (mutation.type === "characterData") {
						curseNode(mutation.target as Text);
					} else {
						mutation.addedNodes.forEach(curseSubtree);
					}
				}
			});
			observer.observe(container, { subtree: true, childList: true, characterData: true });

			stopCursing = () => {
				observer.disconnect();
				const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
				let node: Node | null;
				while ((node = walker.nextNode())) {
					const original = originalText.current.get(node as Text);
					if (original !== undefined) {
						(node as Text).nodeValue = original;
					}
				}
			};
		}

		startCursing();

		return () => {
			if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame);
			stopCursing?.();
		};
	}, [active, containerRef]);
}
