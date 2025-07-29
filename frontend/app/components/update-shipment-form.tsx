
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"

import { ScanQrCode } from "lucide-react"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle
} from "~/components/ui/drawer"
import { Input } from "~/components/ui/input"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "~/components/ui/input-otp"
import { Label } from "~/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"
import api from "~/lib/api"
import { ShipmentStatus, type Shipment, type ShipmentUpdate } from "~/lib/client"
import { cn, getLatestStatus } from "~/lib/utils"
import { Button } from "./ui/button"
import { SubmitButton } from "./ui/submit-button"
import { QrReader } from 'react-qr-reader'


const statusValues = [
    ShipmentStatus.InTransit,
    ShipmentStatus.OutForDelivery,
    ShipmentStatus.Delivered,
]

export function UpdateShipmentForm({
    className,
    onScan,
    shipment,
    ...props
}: { shipment?: Shipment | null, onScan: (id: string) => void } & React.ComponentPropsWithoutRef<"div">) {

    const queryClient = useQueryClient()

    const [status, setStatus] = useState<ShipmentStatus>()

    const shipments = useMutation({
        mutationFn: async ({
            id, update
        }: {
            id: string, update: ShipmentUpdate
        }) => api.shipment.updateShipment({ id }, update),
        onSuccess: () => {
            toast.success("Shipment updated successfully")
            queryClient.invalidateQueries({ queryKey: [shipment!.id] })
        },
        onError: () => {
            if (status === "delivered") {
                toast.error("Invalid verification code")
            } else {
                toast.error("Failed to update shipment")
            }
        }
    })

    const updateShipment = async (shipment: FormData) => {
        const id = shipment.get("id")!.toString()
        const verificationCode = shipment.get("verification-code")?.toString()
        const location = shipment.get("location")?.toString()
        const description = shipment.get("description")?.toString()

        if (!status && !location && !description) {
            toast.warning("Please provide an update")
            return
        }

        if (status === "delivered" && !verificationCode) {
            toast.warning("Please enter the verification code")
            return
        }

        shipments.mutate({
            id: id,
            update: {
                status: status,
                location: location ? parseInt(location) : null,
                description,
                verification_code: verificationCode,
            },
        })
    }

    const latestEvent = shipment?.timeline[shipment?.timeline.length - 1]

    return (
        <div className={cn("flex flex-col gap-6 p-8 max-w-[640px]", className)} {...props}>
            <form action={updateShipment}>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-xl font-bold">Update shipment</h1>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="flex w-full items-center space-x-2">
                            <Input
                                value={shipment?.id ?? undefined}
                                type="text"
                                name="id"
                                required
                                placeholder="Shipment Id"
                            />
                            <QRScanner onScan={onScan}/>
                        </div>
                        <div className="grid gap-2">
                            <Label>Status</Label>
                            <Select name="status" value={status} onValueChange={(value) => {
                                setStatus(value as ShipmentStatus)
                            }}>
                                <SelectTrigger className="w-full">
                                    <SelectValue
                                        placeholder={shipment ? getLatestStatus(shipment) : "Shipment Status"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusValues.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {
                            status === "delivered" && <div className="grid gap-2">
                                <Label htmlFor="verification-code">Verification Code</Label>
                                <InputOTP maxLength={6} name="verification-code">
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                        }
                        <div className="grid gap-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                type="number"
                                placeholder={
                                    latestEvent?.location
                                        ? latestEvent.location.toString()
                                        : "Location"
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                name="description"
                                type="text"
                                placeholder={
                                    latestEvent?.description
                                        ? latestEvent.description
                                        : "scanned at ..."
                                }
                            />
                        </div>
                        <SubmitButton text="Update" />
                    </div>
                </div>
            </form>
        </div>
    )
}
function QRScanner({ onScan }: { onScan: (id: string) => void }) {
    const [open, setOpen] = useState(false)

    return <Drawer open={open} onDrag={() => setOpen(false)}>
    
    <Button variant="outline" onClick={() => setOpen(true)}>
        <ScanQrCode />
    </Button>

    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Scan Shipment Label</DrawerTitle>
      </DrawerHeader>
      {
        open && <>
            <video id="qr-scan-video"></video>
            <QrReader
                videoId="qr-scan-video"
                onResult={(result, error) => {
                    if (result) {
                        onScan(result.getText())
                        setOpen(false)
                    }
                }}
                constraints={{ facingMode: "environment" }}
            />
        </>
      }
    </DrawerContent>
  </Drawer>
  
}

