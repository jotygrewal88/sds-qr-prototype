"use client";

import { useEffect, useState } from "react";
import { Copy, Download, Shield } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockLocations } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import type { AccessPoint, AccessPointType } from "@/lib/types";

type QRDetailModalProps = {
  accessPoint: AccessPoint | null;
  open: boolean;
  onClose: () => void;
};

const locationById = new Map(
  mockLocations.map((location) => [location.id, location]),
);

const subtitleByType: Record<AccessPointType, string> = {
  Event: "Scan this QR code to report a safety event at this location.",
  Documentation:
    "Scan this QR code to view documents attached to this location.",
  Both: "Scan this QR code to report a safety event or view attached documents.",
};

function TypeBadge({ type }: { type: AccessPointType }) {
  return (
    <Badge
      className={cn(
        "h-6 rounded-full border px-2.5 text-xs font-semibold",
        type === "Event" &&
          "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50",
        type === "Documentation" &&
          "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-50",
        type === "Both" &&
          "border-slate-300 bg-slate-900 text-white hover:bg-slate-900",
      )}
    >
      {type}
    </Badge>
  );
}

function getLocationDisplay(accessPoint: AccessPoint) {
  if (!accessPoint.locationId) {
    return null;
  }

  return locationById.get(accessPoint.locationId)?.name ?? null;
}

export function QRDetailModal({
  accessPoint,
  open,
  onClose,
}: QRDetailModalProps) {
  const [copyMessage, setCopyMessage] = useState("");
  const [downloadMessage, setDownloadMessage] = useState("");

  useEffect(() => {
    if (!copyMessage) {
      return;
    }

    const timeout = window.setTimeout(() => setCopyMessage(""), 1600);

    return () => window.clearTimeout(timeout);
  }, [copyMessage]);

  useEffect(() => {
    if (!downloadMessage) {
      return;
    }

    const timeout = window.setTimeout(() => setDownloadMessage(""), 1800);

    return () => window.clearTimeout(timeout);
  }, [downloadMessage]);

  const closeModal = () => {
    setCopyMessage("");
    setDownloadMessage("");
    onClose();
  };

  if (!accessPoint) {
    return <Dialog open={false} />;
  }

  const publicUrl = `${
    typeof window === "undefined" ? "" : window.location.origin
  }/qr/${accessPoint.id}`;
  const locationDisplay = getLocationDisplay(accessPoint);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopyMessage("Copied!");
    } catch {
      setCopyMessage("Copy failed");
    }
  };

  const showDownloadPlaceholder = () => {
    console.log("PDF download coming soon", accessPoint.id);
    setDownloadMessage("PDF download coming soon");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          closeModal();
        }
      }}
    >
      <DialogContent
        className="max-w-[480px] gap-0 rounded-xl bg-white p-0 text-slate-950"
        showCloseButton={false}
      >
        <div className="px-6 pb-4 pt-6">
          <DialogHeader className="gap-2 text-left">
            <DialogTitle className="text-xl font-semibold tracking-tight text-slate-950">
              {accessPoint.name} QR Code
            </DialogTitle>
            <DialogDescription className="text-sm leading-6 text-slate-500">
              {subtitleByType[accessPoint.type]}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex justify-center">
            <div className="relative flex size-[280px] items-center justify-center rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
              <QRCodeSVG
                value={publicUrl}
                size={248}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                marginSize={0}
              />
              <div className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
                <Shield className="size-7 fill-red-50 text-red-600" />
              </div>
            </div>
          </div>

          <div className="mx-auto mt-4 flex max-w-[320px] items-center gap-2">
            <p className="min-w-0 flex-1 truncate font-mono text-xs leading-5 text-slate-500">
              {publicUrl}
            </p>
            <div className="relative">
              <button
                type="button"
                onClick={copyUrl}
                className="flex size-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                aria-label="Copy public QR URL"
              >
                <Copy className="size-4" />
              </button>
              {copyMessage ? (
                <span className="absolute -top-8 right-0 rounded-md bg-slate-950 px-2 py-1 text-xs font-medium text-white shadow-sm">
                  {copyMessage}
                </span>
              ) : null}
            </div>
          </div>

          {locationDisplay ? (
            <p className="mt-3 text-center text-sm text-slate-500">
              Location: {locationDisplay}
            </p>
          ) : null}

          <div className="mt-2 flex items-center justify-center gap-2 text-sm text-slate-500">
            <span>Type:</span>
            <TypeBadge type={accessPoint.type} />
          </div>

          <p className="mx-auto mt-4 max-w-[330px] text-center text-xs italic leading-5 text-blue-600">
            This QR code has been saved to your access points list and will
            remain after refresh.
          </p>
        </div>

        <DialogFooter className="relative -mx-0 -mb-0 rounded-b-xl border-t border-slate-100 bg-white px-6 py-4">
          {downloadMessage ? (
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500">
              {downloadMessage}
            </span>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-md border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={closeModal}
          >
            Close
          </Button>
          <Button
            type="button"
            className="h-9 rounded-md bg-blue-600 px-3 text-sm font-semibold text-white shadow-xs hover:bg-blue-700"
            onClick={showDownloadPlaceholder}
          >
            <Download className="size-4" />
            Print / Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
