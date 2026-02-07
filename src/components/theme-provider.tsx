import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { useEffect, useState } from "react";

function useIsClient() {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return isClient;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	const isClient = useIsClient();

	if (!isClient) {
		return <>{children}</>;
	}

	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
