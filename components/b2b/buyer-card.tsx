"use client";

import { useState } from "react";
import { CheckCircle2, MapPin, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Buyer } from "@/types";

export function BuyerCard({ buyer }: { buyer: Buyer }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`flex h-11 w-11 items-center justify-center rounded-lg font-display text-sm font-semibold text-white ${buyer.logoColor}`}>
            {buyer.logoInitials}
          </span>
          <div>
            <p className="font-display text-sm font-semibold text-foreground">{buyer.companyName}</p>
            <p className="text-xs text-foreground-muted">{buyer.category}</p>
          </div>
        </div>
        <Badge variant="success" className="shrink-0">
          {buyer.matchScore}% Match
        </Badge>
      </div>

      <div className="mt-4 flex flex-col gap-2 text-xs text-foreground-muted">
        <p>
          <span className="font-medium text-foreground">Interested In:</span> {buyer.interestedIn}
        </p>
        <p>
          <span className="font-medium text-foreground">Potential Order:</span> {buyer.potentialOrderMin}–{buyer.potentialOrderMax} Units
        </p>
        <p className="flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {buyer.location}
        </p>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg bg-info-soft px-3 py-2 text-[11px] text-info">
        <Sparkles className="mt-0.5 h-3 w-3 shrink-0" />
        {buyer.matchReason}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="mt-4">
            View Opportunity
          </Button>
        </DialogTrigger>
        <DialogContent>
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success">
                <CheckCircle2 className="h-7 w-7" />
              </span>
              <p className="font-display text-lg font-semibold text-foreground">Interest sent!</p>
              <p className="text-sm text-foreground-muted">
                {buyer.companyName} has been notified. They typically respond within 2-3 business days.
              </p>
              <Button className="mt-2" onClick={() => setOpen(false)}>
                Done
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-lg font-display text-xs font-semibold text-white ${buyer.logoColor}`}>
                    {buyer.logoInitials}
                  </span>
                  {buyer.companyName}
                </DialogTitle>
                <DialogDescription>{buyer.category} · {buyer.location}</DialogDescription>
              </DialogHeader>
              <p className="text-sm leading-relaxed text-foreground-muted">{buyer.about}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-foreground-muted">Interested In</p>
                  <p className="font-medium text-foreground">{buyer.interestedIn}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-foreground-muted">Potential Order</p>
                  <p className="font-medium text-foreground">
                    {buyer.potentialOrderMin}–{buyer.potentialOrderMax} units
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-info-soft px-3 py-2.5 text-xs text-info">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <div>
                  <p className="font-medium">{buyer.matchScore}% AI Match</p>
                  <p className="mt-0.5">{buyer.matchReason}</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => setSent(true)}>Express Interest</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
