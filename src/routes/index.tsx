import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, Sparkles, ChefHat } from "lucide-react";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	const navigate = useNavigate();
	const [query, setQuery] = useState("");
	const [level, setLevel] = useState("Intermediate");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!query) return;
		navigate({
			to: "/recipe/$recipeId",
			params: { recipeId: `${query} for a ${level} cook` },
		});
	};

	const suggestions = [
		"Avocado Toast",
		"Beef Wellington",
		"Pad Thai",
		"Margherita Pizza",
	];
	const levels = ["Beginner", "Intermediate", "Advanced", "Master"];

	return (
		<div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-6">
			{/* Animated Background Mesh */}
			<div className="absolute inset-0 z-0 opacity-40">
				<div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/30 rounded-full blur-[120px] animate-blob"></div>
				<div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/30 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
				<div className="absolute top-[40%] right-[30%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
			</div>

			<div className="relative z-10 w-full max-w-4xl mx-auto text-center space-y-12">
				{/* Hero Typography */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
					className="space-y-6"
				>
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-white/5 backdrop-blur-md text-accent-foreground text-sm font-medium mb-4">
						<ChefHat className="w-4 h-4" />
						<span>Your Personal AI Chef</span>
					</div>

					<h1 className="text-6xl md:text-8xl font-black tracking-tight text-black dark:text-blue-50 leading-[1.1]">
						Cook Smarter, <br />
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-indigo-400">
							Not Harder.
						</span>
					</h1>

					<p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
						Unlock culinary creativity with our AI-powered assistant. From
						pantry staples to gourmet meals, we guide you every step of the way.
					</p>
				</motion.div>

				{/* Floating Search Bar */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.4, duration: 0.5 }}
					className="w-full max-w-xl mx-auto space-y-4"
				>
					{/* Level Selector */}
					<div className="flex justify-center gap-2">
						{levels.map((l) => (
							<button
								key={l}
								onClick={() => setLevel(l)}
								className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
									level === l
										? "bg-primary text-primary-foreground shadow-lg scale-105"
										: "bg-accent/30 text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
								}`}
							>
								{l}
							</button>
						))}
					</div>

					<div className="relative group">
						<div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
						<form
							onSubmit={handleSubmit}
							className="relative flex items-center bg-card/80 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl"
						>
							<div className="pl-6 text-muted-foreground">
								<Search className="w-6 h-6" />
							</div>
							<Input
								placeholder={`What are you craving, ${level} chef?`}
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 text-lg h-14 text-foreground placeholder:text-muted-foreground/70"
							/>
							<Button
								type="submit"
								size="lg"
								disabled={!query}
								className="rounded-full h-12 px-8 font-semibold bg-blue-700 hover:bg-primary/90 text-white shadow-lg transition-transform active:scale-95"
							>
								Generate
							</Button>
						</form>
					</div>
				</motion.div>

				{/* Suggestions */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6 }}
					className="flex flex-wrap justify-center gap-3"
				>
					<span className="text-sm text-muted-foreground font-medium mr-2 self-center">
						Try:
					</span>
					{suggestions.map((s) => (
						<button
							key={s}
							onClick={() => setQuery(s)}
							className="group flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent/30 hover:bg-accent/60 border border-white/5 transition-all text-sm font-medium text-accent-foreground"
						>
							<Sparkles className="w-3 h-3 text-purple-400 group-hover:animate-pulse" />
							{s}
						</button>
					))}
				</motion.div>
			</div>
		</div>
	);
}
