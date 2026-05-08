"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  ClipboardList,
  FileCheck,
  FileText,
  FlaskConical,
  HardHat,
  Layers,
  Lock,
  QrCode,
  Search,
  TriangleAlert,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  mockAssets,
  mockDocuments,
  mockFormTemplates,
  mockLocations,
  mockUsers,
} from "@/lib/mockData";
import { cn } from "@/lib/utils";
import type {
  AccessPoint,
  AccessPointType,
  Document,
  DocumentModule,
  UpToFiveIds,
} from "@/lib/types";

type AccessPointFormModalProps = {
  accessPoint: AccessPoint | null;
  open: boolean;
  onClose: () => void;
  onSave: (accessPoint: AccessPoint) => void;
};

type FormErrors = {
  name?: string;
  templates?: string;
  documents?: string;
};

const documentModules: DocumentModule[] = [
  "SDS",
  "LOTO",
  "SOP",
  "JHA",
  "PTW",
  "Audit",
];

const subtitleByType: Record<AccessPointType, string> = {
  Event: "Create a QR code access point for safety event reporting.",
  Documentation: "Create a QR code access point to share documents.",
  Both: "Create a QR code access point for events and documents.",
};

const notifyHelperByType: Record<AccessPointType, string> = {
  Event:
    "These team members will be notified when events are reported via this access point.",
  Documentation:
    "These team members will be notified when documents are accessed via this access point.",
  Both:
    "These team members will be notified when events are reported or documents are accessed.",
};

const moduleIcons: Record<DocumentModule, typeof FileText> = {
  SDS: FlaskConical,
  LOTO: Lock,
  SOP: ClipboardList,
  JHA: HardHat,
  PTW: FileCheck,
  Audit: FileText,
};

function formatLocation(locationId: string) {
  const location = mockLocations.find((candidate) => candidate.id === locationId);

  if (!location) {
    return "";
  }

  const parent = location.parentId
    ? mockLocations.find((candidate) => candidate.id === location.parentId)
    : undefined;

  return parent ? `${parent.name} › ${location.name}` : location.name;
}

function toUpToFiveIds(ids: string[]): UpToFiveIds {
  return ids.slice(0, 5) as UpToFiveIds;
}

function compactAccessPoint(accessPoint: AccessPoint): AccessPoint {
  return {
    id: accessPoint.id,
    name: accessPoint.name,
    type: accessPoint.type,
    ...(accessPoint.locationId ? { locationId: accessPoint.locationId } : {}),
    ...(accessPoint.assetId ? { assetId: accessPoint.assetId } : {}),
    ...(accessPoint.formTemplateIds?.length
      ? { formTemplateIds: accessPoint.formTemplateIds }
      : {}),
    ...(accessPoint.documentIds?.length
      ? { documentIds: accessPoint.documentIds }
      : {}),
    ...(accessPoint.notifyUserIds?.length
      ? { notifyUserIds: accessPoint.notifyUserIds }
      : {}),
    createdById: accessPoint.createdById,
    createdAt: accessPoint.createdAt,
    ...(accessPoint.lastScannedAt
      ? { lastScannedAt: accessPoint.lastScannedAt }
      : {}),
    status: accessPoint.status,
  };
}

function Chip({
  label,
  prefix,
  icon: Icon,
  onRemove,
}: {
  label: string;
  prefix?: string;
  icon?: LucideIcon;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
      {Icon ? <Icon className="size-3.5 text-slate-500" /> : null}
      {prefix ? (
        <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
          {prefix}
        </span>
      ) : null}
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 text-slate-400 hover:text-slate-700"
        aria-label={`Remove ${label}`}
      >
        <X className="size-3" />
      </button>
    </span>
  );
}

function MultiSelectButton({
  placeholder,
  selectedCount,
  children,
}: {
  placeholder: string;
  selectedCount: number;
  children: React.ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-left text-sm text-slate-500 shadow-xs hover:bg-slate-50"
        >
          <span>
            {selectedCount > 0
              ? `${selectedCount} selected`
              : placeholder}
          </span>
          <span className="text-slate-400">⌄</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)]">
        {children}
      </PopoverContent>
    </Popover>
  );
}

function FormInner({
  accessPoint,
  onClose,
  onSave,
}: {
  accessPoint: AccessPoint | null;
  onClose: () => void;
  onSave: (accessPoint: AccessPoint) => void;
}) {
  const [name, setName] = useState(accessPoint?.name ?? "");
  const [type, setType] = useState<AccessPointType>(
    accessPoint?.type ?? "Event",
  );
  const [locationId, setLocationId] = useState(accessPoint?.locationId ?? "none");
  const [assetId, setAssetId] = useState(accessPoint?.assetId ?? "none");
  const [templateIds, setTemplateIds] = useState<string[]>(
    accessPoint?.formTemplateIds ?? [],
  );
  const [documentIds, setDocumentIds] = useState<string[]>(
    accessPoint?.documentIds ?? [],
  );
  const [notifyUserIds, setNotifyUserIds] = useState<string[]>(
    accessPoint?.notifyUserIds ?? [],
  );
  const [activeModule, setActiveModule] = useState<DocumentModule>("SDS");
  const [documentSearch, setDocumentSearch] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const showTemplates = type === "Event" || type === "Both";
  const showDocuments = type === "Documentation" || type === "Both";

  const selectedDocuments = useMemo(
    () =>
      documentIds
        .map((documentId) =>
          mockDocuments.find((document) => document.id === documentId),
        )
        .filter((document): document is Document => Boolean(document)),
    [documentIds],
  );

  const selectedModuleCount = useMemo(
    () => new Set(selectedDocuments.map((document) => document.module)).size,
    [selectedDocuments],
  );

  const filteredDocuments = useMemo(() => {
    const query = documentSearch.trim().toLowerCase();

    return mockDocuments.filter((document) => {
      if (document.module !== activeModule) {
        return false;
      }

      return (
        !query ||
        document.title.toLowerCase().includes(query) ||
        document.subtitle.toLowerCase().includes(query)
      );
    });
  }, [activeModule, documentSearch]);

  const errors: FormErrors = {
    ...(name.trim().length === 0 ? { name: "Name is required." } : {}),
    ...(name.trim().length > 100
      ? { name: "Name must be 100 characters or fewer." }
      : {}),
    ...(showTemplates && templateIds.length === 0
      ? { templates: "Select at least one form template." }
      : {}),
    ...(showDocuments && documentIds.length === 0
      ? { documents: "Select at least one document." }
      : {}),
  };

  const isValid = Object.keys(errors).length === 0;

  const toggleTemplate = (templateId: string, checked: boolean) => {
    setTemplateIds((current) => {
      if (!checked) {
        return current.filter((id) => id !== templateId);
      }

      if (current.includes(templateId) || current.length >= 5) {
        return current;
      }

      return [...current, templateId];
    });
  };

  const toggleDocument = (documentId: string, checked: boolean) => {
    setDocumentIds((current) =>
      checked
        ? Array.from(new Set([...current, documentId]))
        : current.filter((id) => id !== documentId),
    );
  };

  const toggleNotifyUser = (userId: string, checked: boolean) => {
    setNotifyUserIds((current) =>
      checked
        ? Array.from(new Set([...current, userId]))
        : current.filter((id) => id !== userId),
    );
  };

  const handleSubmit = () => {
    setSubmitted(true);

    if (!isValid) {
      return;
    }

    onSave(
      compactAccessPoint({
        id: accessPoint?.id ?? "",
        name: name.trim(),
        type,
        locationId: locationId === "none" ? undefined : locationId,
        assetId: assetId === "none" ? undefined : assetId,
        formTemplateIds:
          showTemplates && templateIds.length > 0
            ? toUpToFiveIds(templateIds)
            : undefined,
        documentIds:
          showDocuments && documentIds.length > 0 ? documentIds : undefined,
        notifyUserIds: notifyUserIds.length > 0 ? notifyUserIds : undefined,
        createdById: accessPoint?.createdById ?? "user-joty-grewal",
        createdAt:
          accessPoint?.createdAt ?? new Date().toISOString().slice(0, 10),
        lastScannedAt: accessPoint?.lastScannedAt,
        status: accessPoint?.status ?? "active",
      }),
    );
  };

  return (
    <>
      <div className="max-h-[calc(100vh-10rem)] overflow-y-auto px-6 py-6">
        <DialogHeader className="gap-2 text-left">
          <DialogTitle className="text-xl font-semibold tracking-tight text-slate-950">
            {accessPoint ? "Edit Access Point" : "Create New Access Point"}
          </DialogTitle>
          <DialogDescription className="text-sm leading-6 text-slate-500">
            {subtitleByType[type]}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="access-point-name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="access-point-name"
              value={name}
              maxLength={100}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter access point name"
              className="h-10 border-slate-200 bg-white"
            />
            {submitted && errors.name ? (
              <p className="text-xs font-medium text-red-600">{errors.name}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Type</Label>
            <RadioGroup
              value={type}
              onValueChange={(value) => setType(value as AccessPointType)}
              className="grid grid-cols-3 gap-3"
            >
              {[
                {
                  value: "Event",
                  icon: TriangleAlert,
                  title: "Event",
                  description: "Scan to report a safety event",
                },
                {
                  value: "Documentation",
                  icon: FileText,
                  title: "Documentation",
                  description: "Scan to view attached documents",
                },
                {
                  value: "Both",
                  icon: Layers,
                  title: "Both",
                  description: "Scan to report an event or view documents",
                },
              ].map((option) => {
                const Icon = option.icon;
                const selected = type === option.value;

                return (
                  <label
                    key={option.value}
                    className={cn(
                      "relative flex cursor-pointer flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 text-left shadow-xs transition-colors hover:bg-slate-50",
                      selected && "border-blue-300 bg-blue-50 hover:bg-blue-50",
                    )}
                  >
                    <RadioGroupItem
                      value={option.value}
                      className="sr-only"
                    />
                    <Icon
                      className={cn(
                        "size-5 text-slate-500",
                        selected && "text-blue-700",
                      )}
                    />
                    <span className="text-sm font-semibold text-slate-900">
                      {option.title}
                    </span>
                    <span className="text-xs leading-5 text-slate-500">
                      {option.description}
                    </span>
                  </label>
                );
              })}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Location</Label>
            <Select value={locationId} onValueChange={setLocationId}>
              <SelectTrigger className="h-10 w-full border-slate-200 bg-white">
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select a location</SelectItem>
                {mockLocations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {formatLocation(location.id)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Asset (Optional)</Label>
            <Select value={assetId} onValueChange={setAssetId}>
              <SelectTrigger className="h-10 w-full border-slate-200 bg-white">
                <SelectValue placeholder="Select an asset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select an asset</SelectItem>
                {mockAssets.map((asset) => (
                  <SelectItem key={asset.id} value={asset.id}>
                    {asset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showTemplates ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Event Form Templates (Optional)
              </Label>
              <MultiSelectButton
                placeholder="Select templates..."
                selectedCount={templateIds.length}
              >
                <div className="space-y-1">
                  {mockFormTemplates.map((template) => (
                    <label
                      key={template.id}
                      className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Checkbox
                        checked={templateIds.includes(template.id)}
                        disabled={
                          !templateIds.includes(template.id) &&
                          templateIds.length >= 5
                        }
                        onCheckedChange={(checked) =>
                          toggleTemplate(template.id, checked === true)
                        }
                      />
                      <span>
                        <span className="block font-medium">
                          {template.name}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {template.description}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </MultiSelectButton>
              <p className="text-xs text-slate-500">
                Choose up to 5 templates ({5 - templateIds.length} remaining)
              </p>
              {templateIds.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {templateIds.map((templateId) => {
                    const template = mockFormTemplates.find(
                      (candidate) => candidate.id === templateId,
                    );

                    if (!template) {
                      return null;
                    }

                    return (
                      <Chip
                        key={template.id}
                        label={template.name}
                        onRemove={() =>
                          setTemplateIds((current) =>
                            current.filter((id) => id !== template.id),
                          )
                        }
                      />
                    );
                  })}
                </div>
              ) : null}
              {submitted && errors.templates ? (
                <p className="text-xs font-medium text-red-600">
                  {errors.templates}
                </p>
              ) : null}
            </div>
          ) : null}

          {showDocuments ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Documents (Optional)</Label>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <Tabs
                  value={activeModule}
                  onValueChange={(value) =>
                    setActiveModule(value as DocumentModule)
                  }
                >
                  <TabsList className="grid h-auto w-full grid-cols-6">
                    {documentModules.map((module) => {
                      const count = selectedDocuments.filter(
                        (document) => document.module === module,
                      ).length;

                      return (
                        <TabsTrigger
                          key={module}
                          value={module}
                          className="text-xs"
                        >
                          {module} ({count})
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                  {documentModules.map((module) => (
                    <TabsContent key={module} value={module} className="mt-3">
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          value={documentSearch}
                          onChange={(event) =>
                            setDocumentSearch(event.target.value)
                          }
                          placeholder={`Search ${module} documents...`}
                          className="h-9 border-slate-200 bg-white pl-9"
                        />
                      </div>
                      <div className="mt-3 max-h-44 space-y-1 overflow-y-auto">
                        {filteredDocuments.length > 0 ? (
                          filteredDocuments.map((document) => (
                            <label
                              key={document.id}
                              className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <Checkbox
                                checked={documentIds.includes(document.id)}
                                onCheckedChange={(checked) =>
                                  toggleDocument(document.id, checked === true)
                                }
                              />
                              <span>
                                <span className="block font-medium">
                                  {document.title}
                                </span>
                                <span className="block text-xs text-slate-500">
                                  {document.subtitle}
                                </span>
                              </span>
                            </label>
                          ))
                        ) : (
                          <p className="py-4 text-center text-sm text-slate-500">
                            No documents found.
                          </p>
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
              {selectedDocuments.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedDocuments.map((document) => {
                    const Icon = moduleIcons[document.module];

                    return (
                      <Chip
                        key={document.id}
                        label={document.title}
                        prefix={document.module}
                        icon={Icon}
                        onRemove={() =>
                          setDocumentIds((current) =>
                            current.filter((id) => id !== document.id),
                          )
                        }
                      />
                    );
                  })}
                </div>
              ) : null}
              <p className="text-xs text-slate-500">
                Selected: {selectedDocuments.length} document(s) across{" "}
                {selectedModuleCount} module(s)
              </p>
              {submitted && errors.documents ? (
                <p className="text-xs font-medium text-red-600">
                  {errors.documents}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Team Members to Notify (Optional)
            </Label>
            <MultiSelectButton
              placeholder="Select team members to notify"
              selectedCount={notifyUserIds.length}
            >
              <div className="space-y-1">
                {mockUsers.map((user) => (
                  <label
                    key={user.id}
                    className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <Checkbox
                      checked={notifyUserIds.includes(user.id)}
                      onCheckedChange={(checked) =>
                        toggleNotifyUser(user.id, checked === true)
                      }
                    />
                    <span>
                      <span className="block font-medium">{user.name}</span>
                      <span className="block text-xs text-slate-500">
                        {user.email}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </MultiSelectButton>
            {notifyUserIds.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {notifyUserIds.map((userId) => {
                  const user = mockUsers.find(
                    (candidate) => candidate.id === userId,
                  );

                  if (!user) {
                    return null;
                  }

                  return (
                    <Chip
                      key={user.id}
                      label={user.name}
                      onRemove={() =>
                        setNotifyUserIds((current) =>
                          current.filter((id) => id !== user.id),
                        )
                      }
                    />
                  );
                })}
              </div>
            ) : null}
            <p className="flex items-start gap-1.5 text-xs leading-5 text-slate-500">
              <Bell className="mt-0.5 size-3.5 shrink-0" />
              {notifyHelperByType[type]}
            </p>
          </div>
        </div>
      </div>

      <DialogFooter className="-mx-0 -mb-0 rounded-b-xl border-t border-slate-100 bg-white px-6 py-4">
        <Button
          type="button"
          variant="ghost"
          className="h-9 rounded-md px-3 text-sm font-medium"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="button"
          disabled={!isValid}
          onClick={handleSubmit}
          className="h-9 rounded-md bg-blue-600 px-3 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 disabled:bg-blue-300"
        >
          <QrCode className="size-4" />
          {accessPoint ? "Save Changes" : "Generate QR Code"}
        </Button>
      </DialogFooter>
    </>
  );
}

export function AccessPointFormModal({
  accessPoint,
  open,
  onClose,
  onSave,
}: AccessPointFormModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="max-w-[600px] gap-0 rounded-xl bg-white p-0 text-slate-950"
        showCloseButton={false}
      >
        {open ? (
          <FormInner
            key={accessPoint?.id ?? "create"}
            accessPoint={accessPoint}
            onClose={onClose}
            onSave={onSave}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
