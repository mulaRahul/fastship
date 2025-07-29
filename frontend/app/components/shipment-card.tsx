import { ArrowUp, ChevronRight, Package2, PackageCheck, PackageX, SquareArrowOutUpRight, Truck } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

import { type Shipment, type ShipmentEvent } from "~/lib/client";
import ShipmentView from "./shipment-view";

const statusColors = {
    placed: {
        bgColor: "bg-blue-500",
        outlineColor: "outline-blue-500",
    },
    in_transit: {
        bgColor: "bg-orange-500",
        outlineColor: "outline-orange-500",
    },
    out_for_delivery: {
        bgColor: "bg-lime-500",
        outlineColor: "outline-lime-500",
    },
    delivered: {
        bgColor: "bg-green-400",
        outlineColor: "outline-green-400",
    },
    cancelled: {
        bgColor: "bg-grey-600",
        outlineColor: "outline-grey-600",
    },
}
const statusIcons = {
    placed: <ArrowUp className="size-5 text-primary-foreground" />,
    in_transit: <Truck className="size-5 text-primary-foreground" />,
    out_for_delivery: <SquareArrowOutUpRight className="size-5 text-primary-foreground" />,
    delivered: <PackageCheck className="size-5 text-primary-foreground" />,
    cancelled: <PackageX className="size-5 text-primary-foreground" />,
}

export default function ShipmentCard({ shipment }: { shipment: Shipment }) {
    const latestEvent = shipment.timeline[shipment.timeline.length - 1];
    const latestStatus = latestEvent.status;
    const statusColor = statusColors[latestStatus];

    return (
        <Card className="shadow-none" >
            <CardHeader>
                <div className="flex items-center space-x-4">
                    <div className="bg-secondary text-foreground flex size-16 items-center justify-center rounded-xl">
                        <Package2 className="size-8" />
                    </div>
                    <div>
                        <p className="text-gray-500">Shipment Number</p>
                        <p className="font-l font-medium">{shipment.id.slice(-10)}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="flex items-center space-x-4 rounded-xl p-[15px] bg-gray-100 relative">
                    <div className="absolute left-[80px] top-0 bottom-0 w-0.5 bg-gray-300" />
                    <div data-line className={`absolute left-[80px] top-[24px] bottom-0 w-0.5 ${statusColor.bgColor}`} />
                    <div className="flex flex-col space-y-6 relative">
                        <TimelineEvent hasOutline={true} event={latestEvent} bgColor={statusColor.bgColor} outlineColor={statusColor.outlineColor} />
                        {
                            shipment.timeline.length > 1 &&
                            <TimelineEvent
                                event={shipment.timeline[shipment.timeline.length - 2]}
                                bgColor={statusColor.bgColor}
                                outlineColor={statusColor.bgColor} />
                        }
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Dialog>
                    <DialogTrigger className="w-full">
                        <Button className="w-full">
                            View Details <ChevronRight/>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[640px]">
                        <DialogHeader>
                            <DialogTitle>{`Shipment #${shipment.id}`}</DialogTitle>
                            <DialogDescription>
                                <ShipmentView shipment={shipment} />
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    )
}

function TimelineEvent({ event, bgColor, outlineColor, hasOutline = false }: { event: ShipmentEvent, bgColor: string, outlineColor: string, hasOutline?: boolean }) {
    return (
        <div className="flex items-center gap-x-[15px]">
            <p className="text-xs text-muted-foreground w-[30px]">
                {event.created_at.split("T")[1].slice(0, 5)}
            </p>
            <div className={`w-[40px] h-[40px] ${bgColor} text-foreground flex items-center justify-center rounded-full ${hasOutline ? `outline-2 ${outlineColor} outline-offset-2` : ''}`}>
                {statusIcons[event.status]}
            </div>
            <p className="text-sm text-gray-800">{event.description}</p>
        </div>
    );
}