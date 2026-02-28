import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ModeToggle } from "@/components/mode-toggle";
import ScrollToTop from "@/components/ScrollToTop";

export const Route = createRootRoute({
	component: () => (
		<>
			<div className="absolute top-4 right-4 z-50">
				<ModeToggle />
			</div>
			<Outlet />
			<ScrollToTop />
		</>
	),
});
