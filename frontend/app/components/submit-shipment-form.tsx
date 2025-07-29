import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import api from "~/lib/api"
import { SubmitButton } from "./ui/submit-button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { AxiosError } from "axios"

export function SubmitShipmentForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {

  const queryClient = useQueryClient()

  const shipments = useMutation({
    mutationFn: api.shipment.submitShipment,
    onSuccess: (response) => {
      toast(`Shipment is submitted successfully (#${response.data.id})`)
      queryClient.invalidateQueries({ queryKey: ["shipments"] })
    },
    onError: (error) => {
      const apiError = error as AxiosError
      toast.error(
        apiError.status === 406 
          ? "No delivery parterns are available" 
          : "Failed to submit shipment"
      )
    }
  })

  async function submitShipment(data: FormData) {
    const content = data.get("content")?.toString()
    const weight = data.get("weight")?.toString()
    const destination = data.get("destination")?.toString()
    const clientContactEmail = data.get("client-contact-email")?.toString()

    if (!content || !weight || !destination || !clientContactEmail) {
      return
    }

    const shipment = {
      content: content,
      weight: parseFloat(weight),
      destination: parseInt(destination),
      client_contact_email: clientContactEmail,
      client_contact_phone: data.get("client-contact-phone")?.toString(),
    }
    shipments.mutate(shipment)
  }

  return (
    <form {...props} action={submitShipment}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold">Submit a new shipment</h1>
        </div>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="content">Contents</Label>
            <Input
              id="content"
              name="content"
              type="text"
              placeholder="Shipment contents"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="weight">Weight</Label>
            <Input
              id="weight"
              name="weight"
              step={0.1}
              type="number"
              max={25}
              placeholder="Weight in kg"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              name="destination"
              type="destination"
              placeholder="11001"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="client-contact-email">Client Email</Label>
            <Input
              id="client-contact-email"
              name="client-contact-email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="client-contact-phone">Client Phone</Label>
            <Input
              id="client-contact-phone"
              name="client-contact-phone"
              type="phone"
              placeholder="+1 234 567 890"
            />
          </div>
          <SubmitButton text="Submit" />
        </div>
      </div>
    </form>
  )
}
