import { useQueryClient } from "@tanstack/react-query";
import { Edit3, Package, PackageX } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import { AuthContext } from "~/contexts/AuthContext";
import type { Shipment } from "~/lib/client";


export default function ShipmentView({ shipment }: { shipment: Shipment }) {
    const { user } = useContext(AuthContext)
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const details = [
        {
            "title": "Content",
            "description": shipment.content,
        },
        {
            "title": "Weight",
            "description": `${shipment.weight} kg`,
        },
        {
            "title": "Destination",
            "description": shipment.destination,
        },
        {
            "title": "Estimated Delivery",
            "description": shipment.estimated_delivery.split("T")[0],
        },
    ]

    return (
        <div className="flex flex-col gap-4 w-full max-w-[640px] relative">
            <div className="w-[80px] h-[80px] bg-gray-200 rounded-xl flex items-center justify-center">
                <Package size={40} />
            </div>
            {
                shipment.tags.length !== 0 &&
                <div className="flex gap-2">
                    {shipment.tags.map((tag, index) => (
                        <Badge variant="secondary" key={index}>{tag.name}</Badge>
                    ))}
                </div>
            }
            <div className="grid grid-cols-2 gap-4">
                {details.map((item, index) => (
                    <div key={index} className="flex flex-col gap-1">
                        <h4 className="text-sm text-muted-foreground">{item.title}</h4>
                        <p className="text-l text-foreground font-medium">{item.description}</p>
                    </div>
                ))}
            </div>
            <h4 className="text-sm text-muted-foreground">Order History</h4>
            <Table className="border rounded-l">
                <TableHeader className="bg-gray-100">
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Description</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {shipment.timeline.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                {`${item.created_at.split("T")[0]} ${item.created_at.split("T")[1].slice(0, 5)}`}
                            </TableCell>
                            <TableCell>{item.location}</TableCell>
                            <TableCell>{item.status}</TableCell>
                            <TableCell>{item.description}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex gap-4 justify-end">
                {
                    user === "seller" &&
                    <Button variant="outline">
                        <PackageX />
                        Cancel Shipment
                    </Button>
                }
                {
                    user === "partner" &&

                    <Button onClick={() => {
                        navigate({
                            pathname: "/update-shipment",
                            search: `?id=${shipment.id}`,
                        })
                    }}>
                        <Edit3 />
                        Update Shipment Status
                    </Button>

                }
            </div>
        </div>
    );
}