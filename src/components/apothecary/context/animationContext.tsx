import { animate, createScope } from "animejs";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from "react";
import { GameContext, type AnimationAnchorId, type GameDeltaEvent } from "./gameContext";
import { HERBS } from "../components/data/gameData";

interface FloatingParticle {
	id: number;
	emoji: string;
	x: number;
	y: number;
}

interface AnimationContextInterface {
	registerAnchor: (anchorId: AnimationAnchorId) => (node: HTMLButtonElement | null) => void;
	active: boolean;
	toggleActive: () => void;
}

const MAX_PARTICLES_PER_EVENT = 3;
const MANUAL_POINTER_TTL_MS = 1200;

const AnimationContext = createContext<AnimationContextInterface>({
	registerAnchor: () => () => {},
	active: true,
	toggleActive: () => {},
});

function getEventEmoji(event: GameDeltaEvent) {
	switch (event.type) {
		case "herbGain":
			return HERBS[event.herbId].emoji;
		case "potionCraft":
			return "⚗️";
		case "potionSell":
			return "🗝️";
		default:
			return "✨";
	}
}

export function useApothecaryAnimation() {
	return useContext(AnimationContext);
}

export default function ApothecaryAnimationProvider({ children }: { children: ReactNode }) {
	const { deltaEvents, acknowledgeDeltaEvents } = useContext(GameContext);
	const rootRef = useRef<HTMLDivElement | null>(null);
	const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
	const lastPointerRef = useRef<{
		clientX: number;
		clientY: number;
		atMs: number;
	} | null>(null);
	const anchorsRef = useRef(new Map<AnimationAnchorId, HTMLButtonElement>());
	const particleElementsRef = useRef(new Map<number, HTMLSpanElement>());
	const animatedParticleIdsRef = useRef(new Set<number>());
	const processedEventIdsRef = useRef(new Set<number>());
	const nextParticleIdRef = useRef(1);
	const [particles, setParticles] = useState<FloatingParticle[]>([]);
	const [animationsActive, setAnimationsActive] = useState(true);

	useEffect(() => {
		scopeRef.current = createScope({ root: rootRef }).add(() => {});

		return () => {
			scopeRef.current?.revert();
		};
	}, []);

	const registerAnchor = useCallback(
		(anchorId: AnimationAnchorId) => (node: HTMLButtonElement | null) => {
			if (node) {
				anchorsRef.current.set(anchorId, node);
				return;
			}
			anchorsRef.current.delete(anchorId);
		},
		[],
	);

	useEffect(() => {
		if (deltaEvents.length === 0 || !rootRef.current) {
			return;
		}

		const rootRect = rootRef.current.getBoundingClientRect();
		const particlesToAnimate: FloatingParticle[] = [];
		let lastProcessedEventId = 0;

		for (const event of deltaEvents) {
			lastProcessedEventId = Math.max(lastProcessedEventId, event.id);
			if (processedEventIdsRef.current.has(event.id)) {
				continue;
			}
			processedEventIdsRef.current.add(event.id);

			if (!animationsActive) {
				continue;
			}

			const nowMs = performance.now();
			const hasFreshPointer =
				event.source === "manual" &&
				lastPointerRef.current !== null &&
				nowMs - lastPointerRef.current.atMs <= MANUAL_POINTER_TTL_MS;
			const pointer = lastPointerRef.current;

			let originX: number;
			let originY: number;
			let originWidth: number;
			let originHeight: number;

			if (hasFreshPointer && pointer) {
				originX = pointer.clientX - rootRect.left; //- 10;
				originY = pointer.clientY - rootRect.top; // - 10;
				originWidth = 0;
				originHeight = 0;
			} else {
				const anchorNode = anchorsRef.current.get(event.anchorId);
				if (!anchorNode) {
					continue;
				}

				const anchorRect = anchorNode.getBoundingClientRect();
				originX = anchorRect.left - rootRect.left;
				originY = anchorRect.top - rootRect.top;
				originWidth = anchorRect.width;
				originHeight = anchorRect.height;
			}

			const emoji = getEventEmoji(event);
			const spawnCount = Math.max(1, Math.min(MAX_PARTICLES_PER_EVENT, event.amount));
			for (let i = 0; i < spawnCount; i++) {
				const jitterX = Math.random() * originWidth;
				const jitterY = Math.random() * originHeight;
				particlesToAnimate.push({
					id: nextParticleIdRef.current++,
					emoji,
					x: originX + jitterX,
					y: originY + jitterY,
				});
			}
		}

		if (lastProcessedEventId > 0) {
			acknowledgeDeltaEvents(lastProcessedEventId);
		}

		if (particlesToAnimate.length === 0) {
			return;
		}

		setParticles((prev) => [...prev, ...particlesToAnimate]);
	}, [acknowledgeDeltaEvents, deltaEvents]);

	useEffect(() => {
		for (const particle of particles) {
			if (animatedParticleIdsRef.current.has(particle.id)) {
				continue;
			}

			const element = particleElementsRef.current.get(particle.id);
			if (!element) {
				continue;
			}

			animatedParticleIdsRef.current.add(particle.id);
			animate(element, {
				translateY: -25 - Math.random() * 20,
				translateX: (Math.random() - 0.5) * 30,
				scale: [0.8, 1.1, 0.9],
				opacity: [1, 1, 0],
				ease: "out(3)",
				duration: 700,
				onComplete: () => {
					animatedParticleIdsRef.current.delete(particle.id);
					particleElementsRef.current.delete(particle.id);
					setParticles((current) => current.filter((p) => p.id !== particle.id));
				},
			});
		}
	}, [particles]);

	const value = useMemo(
		() => ({
			registerAnchor,
			active: animationsActive,
			toggleActive: () => setAnimationsActive((prev) => !prev),
		}),
		[registerAnchor, animationsActive],
	);

	return (
		<AnimationContext.Provider value={value}>
			<div
				ref={rootRef}
				className="relative"
				onPointerDown={(event) => {
					lastPointerRef.current = {
						clientX: event.clientX,
						clientY: event.clientY,
						atMs: performance.now(),
					};
				}}
			>
				{children}
				<div className="pointer-events-none absolute inset-0 overflow-visible">
					{particles.map((particle) => (
						<span
							key={particle.id}
							data-particle-id={particle.id}
							ref={(node) => {
								if (node) {
									particleElementsRef.current.set(particle.id, node);
									return;
								}
								particleElementsRef.current.delete(particle.id);
							}}
							className="absolute select-none text-xl h-1 w-1 bg-transparent m-0 flex items-center justify-center"
							style={{
								left: particle.x,
								top: particle.y,
							}}
						>
							{particle.emoji}
						</span>
					))}
				</div>
			</div>
		</AnimationContext.Provider>
	);
}
