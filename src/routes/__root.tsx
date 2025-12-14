import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";

export const Route = createRootRoute({
	component: () => (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<div className="absolute top-4 right-4 z-50">
				<ModeToggle />
			</div>
			<Outlet />
		</ThemeProvider>
	),
});
