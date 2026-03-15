import { useIsClient } from "@/hooks/useIsClient";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	const isClient = useIsClient();

	if (!isClient) {
		return <>{children}</>;
	}

	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
