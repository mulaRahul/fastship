import { RotateCw } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "./button";

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      className="w-full" 
      disabled={pending}
    >
      {pending ? (
        <>
          <RotateCw className="mr-2 h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : text}
    </Button>
  )
}

export { SubmitButton }