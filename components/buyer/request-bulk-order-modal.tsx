"use client";

import { useState, type ReactNode } from "react";
import { CheckCircle2, PackageSearch } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import type { Product } from "@/types";

interface RequestBulkOrderModalProps {
  products: Product[];
  defaultProductId?: string;
  trigger: ReactNode;
}

export function RequestBulkOrderModal({ products, defaultProductId, trigger }: RequestBulkOrderModalProps) {
  const addBulkOrderRequest = useAppStore((s) => s.addBulkOrderRequest);
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [productId, setProductId] = useState(defaultProductId ?? products[0]?.id ?? "");
  const [quantity, setQuantity] = useState("50");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit() {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    addBulkOrderRequest({
      buyerId: "buyer_demo",
      buyerName: "Demo Buyer Co.",
      productId,
      quantity: Number(quantity) || 0,
      budget: Number(budget) || 0,
      deliveryLocation: location,
      message,
    });
    setSubmitted(true);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setTimeout(() => {
        setSubmitted(false);
        setQuantity("50");
        setBudget("");
        setLocation("");
        setMessage("");
      }, 200);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <p className="font-display text-lg font-semibold text-foreground">Request sent!</p>
            <p className="text-sm text-foreground-muted">
              The artisan has been notified of your bulk order request and will respond soon.
            </p>
            <Button className="mt-2" onClick={() => handleOpenChange(false)}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <PackageSearch className="h-5 w-5 text-primary" /> Request Bulk Order
              </DialogTitle>
              <DialogDescription>
                Tell the artisan what you need — they&apos;ll follow up with pricing and timelines.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label>Product</Label>
                <Select value={productId} onValueChange={setProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="budget">Expected Budget (₹)</Label>
                  <Input id="budget" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. 25000" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="location">Delivery Location</Label>
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, State" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Any specific requirements, timelines, or customisations…"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!productId}>
                Send Request
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
