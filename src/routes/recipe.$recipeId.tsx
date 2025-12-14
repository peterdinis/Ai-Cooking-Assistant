import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { generateRecipe, generateImage } from '@/lib/ai'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, Play, Clock, Users, Flame, ChevronLeft, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/recipe/$recipeId')({
    component: RecipePage,
})

function RecipePage() {
    const { recipeId } = Route.useParams()

    const [isCookingMode, setIsCookingMode] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)

    const { 
        data: recipe, 
        isLoading: isRecipeLoading, 
        isFetching: isRecipeFetching,
        error 
    } = useQuery({
        queryKey: ['recipe', recipeId],
        queryFn: () => generateRecipe(recipeId),
        retry: false
    })

    const { 
        data: imageUrl, 
        isLoading: isImageLoading,
        isFetching: isImageFetching 
    } = useQuery({
        queryKey: ['image', recipeId],
        queryFn: () => generateImage(recipeId + " gourmet food photography"),
        retry: false,
        staleTime: Infinity
    })

    const isLoading = isRecipeLoading || isRecipeFetching
    const isImageLoadingOrFetching = isImageLoading || isImageFetching

    // Error View
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="text-center space-y-4">
                    <Flame className="w-12 h-12 text-destructive mx-auto" />
                    <h2 className="text-2xl font-bold text-destructive">Cooking Error</h2>
                    <p className="text-muted-foreground max-w-md">{(error as Error).message}</p>
                    <p className="text-xs text-muted-foreground/50">Check your API Key configuration.</p>
                    <Button variant="outline" onClick={() => window.location.href = '/'}>Go Home</Button>
                </div>
            </div>
        )
    }

    // COOKING WIZARD VIEW
    if (isCookingMode && recipe) {
        const totalSteps = recipe.steps.length
        const step = recipe.steps[currentStep]
        const progress = ((currentStep + 1) / totalSteps) * 100

        return (
            <div className="fixed inset-0 bg-background z-50 flex flex-col">
                <div className="h-2 bg-secondary w-full">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 50 }}
                    />
                </div>

                <div className="flex-1 overflow-hidden relative flex flex-col items-center justify-center p-6 md:p-12">
                    <Button
                        variant="ghost"
                        className="absolute top-6 right-6 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsCookingMode(false)}
                    >
                        Exit Mode
                    </Button>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.1, y: -50 }}
                            transition={{ duration: 0.4 }}
                            className="w-full max-w-3xl"
                        >
                            <div className="text-center space-y-8">
                                <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary font-bold text-sm tracking-wide">
                                    STEP {currentStep + 1}
                                </span>
                                <h2 className="text-3xl md:text-5xl font-bold leading-tight text-foreground">
                                    {step.instruction}
                                </h2>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="p-8 border-t border-border bg-card/50 backdrop-blur-md">
                    <div className="max-w-2xl mx-auto flex gap-6">
                        <Button
                            variant="secondary"
                            size="lg"
                            className="flex-1 h-16 text-lg rounded-2xl"
                            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                            disabled={currentStep === 0}
                        >
                            <ArrowLeft className="mr-2" /> Back
                        </Button>
                        <Button
                            size="lg"
                            className="flex-1 h-16 text-lg rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20"
                            onClick={() => {
                                if (currentStep < totalSteps - 1) {
                                    setCurrentStep(prev => prev + 1)
                                } else {
                                    setIsCookingMode(false)
                                }
                            }}
                        >
                            {currentStep === totalSteps - 1 ? "Finish Cooking" : "Next Step"}
                            {currentStep < totalSteps - 1 && <ArrowRight className="ml-2" />}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // FULL PAGE LOADING STATE
    if (isLoading && !recipe) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-6">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <Loader2 className="w-16 h-16 text-primary mx-auto" />
                    </motion.div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">Cooking up your recipe...</h3>
                        <p className="text-sm text-muted-foreground">This might take a moment</p>
                    </div>
                </div>
            </div>
        )
    }

    // MAIN LAYOUT
    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {/* Hero Section */}
            <div className="h-[40vh] md:h-[50vh] relative w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
                
                {isImageLoadingOrFetching && !imageUrl ? (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Loader2 className="w-12 h-12 text-muted-foreground animate-spin" />
                    </div>
                ) : imageUrl ? (
                    <motion.img
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        src={imageUrl}
                        className="w-full h-full object-cover"
                        alt={recipeId}
                    />
                ) : null}

                <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-12 max-w-7xl mx-auto">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="mb-6 backdrop-blur-md bg-black/30 text-black border-white/10 hover:bg-black/50"
                        onClick={() => window.history.back()}
                    >
                        <ChevronLeft className="mr-2 w-4 h-4" /> Back
                    </Button>

                    {isLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-12 w-2/3 bg-white/10" />
                            <Skeleton className="h-6 w-1/3 bg-white/5" />
                        </div>
                    ) : (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                        >
                            <h1 className="text-4xl md:text-6xl font-black text-black mb-4 drop-shadow-xl">
                                {recipe?.title || recipeId}
                            </h1>
                            <p className="text-lg text-black/80 max-w-2xl line-clamp-2">
                                {recipe?.description}
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-8 relative z-30">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* Left Column: Stats & Ingredients */}
                    <div className="space-y-6">
                        {/* Stats Card */}
                        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                            <CardContent className="p-6 flex justify-around">
                                <div className="text-center">
                                    <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                                    <span className="text-sm text-muted-foreground block">Prep Time</span>
                                    <span className="font-bold">45m</span>
                                </div>
                                <div className="w-px bg-border" />
                                <div className="text-center">
                                    <Flame className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                                    <span className="text-sm text-muted-foreground block">Difficulty</span>
                                    <span className="font-bold">Medium</span>
                                </div>
                                <div className="w-px bg-border" />
                                <div className="text-center">
                                    <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                                    <span className="text-sm text-muted-foreground block">Serves</span>
                                    <span className="font-bold">4</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Ingredients */}
                        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl h-fit">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-primary rounded-full" /> Ingredients
                                </h3>
                                {isLoading ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-8 w-full" />)}
                                    </div>
                                ) : (
                                    <ul className="space-y-3">
                                        {recipe?.ingredients?.map((ing: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                                                <div className="mt-1 w-5 h-5 rounded-full border-2 border-muted-foreground/30 group-hover:border-primary transition-colors" />
                                                <span className="text-muted-foreground group-hover:text-foreground transition-colors leading-tight">{ing}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Instructions */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-2xl font-bold">Instructions</h3>
                            {!isLoading && (
                                <Button 
                                    onClick={() => setIsCookingMode(true)} 
                                    className="shadow-lg shadow-primary/20"
                                    disabled={isLoading}
                                >
                                    <Play className="w-4 h-4 mr-2" /> 
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        'Start Cooking'
                                    )}
                                </Button>
                            )}
                        </div>

                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {recipe?.steps?.map((step: any, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="relative pl-8 pb-8 last:pb-0 border-l-2 border-primary/20 last:border-0"
                                    >
                                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary ring-4 ring-background" />
                                        <div className="bg-card border border-border/50 p-6 rounded-2xl hover:border-primary/50 transition-colors shadow-sm">
                                            <span className="text-xs font-bold text-primary mb-2 block uppercase tracking-wider">Step {i + 1}</span>
                                            <p className="text-lg leading-relaxed">{step.instruction}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}