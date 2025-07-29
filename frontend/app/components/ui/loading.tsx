import { RotateCw } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex h-[100vh] items-center justify-center">
            <div className="flex gap-4 items-center">
                <RotateCw className="text-muted-foreground animate-spin" />
                <h1 className="text-2xl font-bold text-muted-foreground">Loading...</h1>
            </div>
        </div>
    )
}
