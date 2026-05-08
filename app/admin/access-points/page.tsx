"use client";

import { useMemo, useState } from "react";
import type { ComponentType, MouseEvent, SVGProps } from "react";
import {
  Archive,
  ArrowDown,
  ArrowUp,
  Calendar,
  Check,
  ChevronDown,
  ChevronsUpDown,
  Download,
  FileText,
  MapPin,
  MoreHorizontal,
  Search,
  Upload,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  mockAccessPoints,
  mockAssets,
  mockDocuments,
  mockFormTemplates,
  mockLocations,
  mockUsers,
} from "@/lib/mockData";
import { QRDetailModal } from "@/components/admin/QRDetailModal";
import { cn } from "@/lib/utils";
import type { AccessPoint, AccessPointType, Document } from "@/lib/types";

type StatusFilter = AccessPoint["status"];
type SortKey = "name" | "createdAt" | "status";
type SortDirection = "asc" | "desc";
type IconType = ComponentType<SVGProps<SVGSVGElement>>;

const allStatuses: StatusFilter[] = ["active", "archived"];
const allTypes: AccessPointType[] = ["Event", "Documentation", "Both"];

const userById = new Map(mockUsers.map((user) => [user.id, user]));
const locationById = new Map(
  mockLocations.map((location) => [location.id, location]),
);
const assetById = new Map(mockAssets.map((asset) => [asset.id, asset]));
const formTemplateById = new Map(
  mockFormTemplates.map((template) => [template.id, template]),
);
const documentById = new Map(
  mockDocuments.map((document) => [document.id, document]),
);

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

function formatLocation(locationId?: string) {
  if (!locationId) {
    return null;
  }

  const location = locationById.get(locationId);

  if (!location) {
    return null;
  }

  const parent = location.parentId
    ? locationById.get(location.parentId)
    : undefined;

  return parent ? `${parent.name} › ${location.name}` : location.name;
}

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function getDocuments(accessPoint: AccessPoint) {
  return (
    accessPoint.documentIds
      ?.map((documentId) => documentById.get(documentId))
      .filter((document): document is Document => Boolean(document)) ?? []
  );
}

function getTemplateCount(accessPoint: AccessPoint) {
  return accessPoint.formTemplateIds?.length ?? 0;
}

function getDocumentCount(accessPoint: AccessPoint) {
  return accessPoint.documentIds?.length ?? 0;
}

function getNotifyCount(accessPoint: AccessPoint) {
  return accessPoint.notifyUserIds?.length ?? 0;
}

function getSortValue(accessPoint: AccessPoint, sortKey: SortKey) {
  if (sortKey === "name") {
    return accessPoint.name.toLowerCase();
  }

  if (sortKey === "status") {
    return accessPoint.status;
  }

  return accessPoint.createdAt;
}

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

function StatusBadge({ status }: { status: StatusFilter }) {
  return (
    <Badge className="h-6 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">
      {status === "active" ? "Active" : "Archived"}
    </Badge>
  );
}

function SortButton({
  label,
  sortKey,
  activeSortKey,
  sortDirection,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  activeSortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (sortKey: SortKey) => void;
}) {
  const active = sortKey === activeSortKey;
  const SortIcon = active
    ? sortDirection === "asc"
      ? ArrowUp
      : ArrowDown
    : ChevronsUpDown;

  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className="inline-flex items-center gap-1 font-semibold text-slate-700"
    >
      {label}
      <SortIcon className="size-3.5 text-slate-400" />
    </button>
  );
}

function FilterPill({
  label,
  value,
  count,
  icon: Icon,
  active,
  children,
}: {
  label: string;
  value?: string;
  count?: number;
  icon?: IconType;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-50",
            active && "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50",
          )}
        >
          {Icon ? <Icon className="size-3.5" /> : null}
          <span>{label}</span>
          {count ? (
            <span className="ml-0.5 flex size-4 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
              {count}
            </span>
          ) : null}
          {value ? <span className="text-slate-500">{value}</span> : null}
          <ChevronDown className="size-3.5 text-slate-400" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64">
        {children}
      </PopoverContent>
    </Popover>
  );
}

function SelectOption({
  selected,
  label,
  onSelect,
}: {
  selected: boolean;
  label: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
    >
      <span>{label}</span>
      {selected ? <Check className="size-4 text-blue-600" /> : null}
    </button>
  );
}

export default function AccessPointsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<StatusFilter[]>([
    "active",
  ]);
  const [selectedLocationId, setSelectedLocationId] = useState("all");
  const [selectedCreatedById, setSelectedCreatedById] = useState("all");
  const [selectedFormTemplateId, setSelectedFormTemplateId] = useState("all");
  const [selectedType, setSelectedType] = useState<AccessPointType | "all">(
    "all",
  );
  const [includeArchived, setIncludeArchived] = useState(false);
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedAccessPoint, setSelectedAccessPoint] =
    useState<AccessPoint | null>(null);

  const createdByOptions = useMemo(() => {
    const createdByIds = new Set(
      mockAccessPoints.map((accessPoint) => accessPoint.createdById),
    );

    return mockUsers.filter((user) => createdByIds.has(user.id));
  }, []);

  const formTemplateOptions = useMemo(() => {
    const templateIds = new Set(
      mockAccessPoints.flatMap(
        (accessPoint) => accessPoint.formTemplateIds ?? [],
      ),
    );

    return mockFormTemplates.filter((template) => templateIds.has(template.id));
  }, []);

  const locationOptions = useMemo(() => {
    const locationIds = new Set(
      mockAccessPoints
        .map((accessPoint) => accessPoint.locationId)
        .filter((locationId): locationId is string => Boolean(locationId)),
    );

    return mockLocations.filter((location) => locationIds.has(location.id));
  }, []);

  const filteredAccessPoints = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return mockAccessPoints
      .filter((accessPoint) => {
        const accessPointTemplateIds: readonly string[] =
          accessPoint.formTemplateIds ?? [];

        if (query && !accessPoint.name.toLowerCase().includes(query)) {
          return false;
        }

        if (!includeArchived && accessPoint.status === "archived") {
          return false;
        }

        if (
          selectedStatuses.length > 0 &&
          !selectedStatuses.includes(accessPoint.status)
        ) {
          return false;
        }

        if (
          selectedLocationId !== "all" &&
          accessPoint.locationId !== selectedLocationId
        ) {
          return false;
        }

        if (
          selectedCreatedById !== "all" &&
          accessPoint.createdById !== selectedCreatedById
        ) {
          return false;
        }

        if (
          selectedFormTemplateId !== "all" &&
          !accessPointTemplateIds.includes(selectedFormTemplateId)
        ) {
          return false;
        }

        if (selectedType !== "all" && accessPoint.type !== selectedType) {
          return false;
        }

        if (createdFrom && accessPoint.createdAt < createdFrom) {
          return false;
        }

        if (createdTo && accessPoint.createdAt > createdTo) {
          return false;
        }

        return true;
      })
      .sort((first, second) => {
        const firstValue = getSortValue(first, sortKey);
        const secondValue = getSortValue(second, sortKey);
        const comparison = firstValue.localeCompare(secondValue);

        return sortDirection === "asc" ? comparison : -comparison;
      });
  }, [
    createdFrom,
    createdTo,
    includeArchived,
    searchQuery,
    selectedCreatedById,
    selectedFormTemplateId,
    selectedLocationId,
    selectedStatuses,
    selectedType,
    sortDirection,
    sortKey,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStatuses(["active"]);
    setSelectedLocationId("all");
    setSelectedCreatedById("all");
    setSelectedFormTemplateId("all");
    setSelectedType("all");
    setIncludeArchived(false);
    setCreatedFrom("");
    setCreatedTo("");
    setSortKey("createdAt");
    setSortDirection("desc");
  };

  const toggleStatus = (status: StatusFilter, checked: boolean) => {
    setSelectedStatuses((current) =>
      checked
        ? Array.from(new Set([...current, status]))
        : current.filter((currentStatus) => currentStatus !== status),
    );
  };

  const toggleIncludeArchived = (checked: boolean) => {
    setIncludeArchived(checked);
    setSelectedStatuses(checked ? ["active", "archived"] : ["active"]);
  };

  const handleSort = (nextSortKey: SortKey) => {
    if (nextSortKey === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextSortKey);
    setSortDirection(nextSortKey === "createdAt" ? "desc" : "asc");
  };

  const stopRowClick = (event: MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <section className="space-y-5">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            Access Points
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track and manage all access points
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-[280px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search access points..."
              className="h-9 rounded-md border-slate-200 bg-white pl-9 text-sm shadow-xs"
            />
          </div>
          <Button className="h-9 rounded-md bg-blue-600 px-3 text-sm font-semibold text-white shadow-xs hover:bg-blue-700">
            + Create Access Point
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 rounded-md border-slate-200 bg-white text-slate-500 shadow-xs hover:bg-slate-50"
            aria-label="Import access points"
          >
            <Upload className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 rounded-md border-slate-200 bg-white text-slate-500 shadow-xs hover:bg-slate-50"
            aria-label="Export access points"
          >
            <Download className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <FilterPill
            label="Status"
            count={selectedStatuses.length}
            active={selectedStatuses.length !== 1 || selectedStatuses[0] !== "active"}
          >
            <div className="space-y-2">
              <p className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Status
              </p>
              {allStatuses.map((status) => (
                <label
                  key={status}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Checkbox
                    checked={selectedStatuses.includes(status)}
                    onCheckedChange={(checked) =>
                      toggleStatus(status, checked === true)
                    }
                  />
                  <span className="capitalize">{status}</span>
                </label>
              ))}
            </div>
          </FilterPill>

          <FilterPill
            label="Location"
            value={
              selectedLocationId === "all"
                ? "All"
                : formatLocation(selectedLocationId) ?? "All"
            }
            active={selectedLocationId !== "all"}
          >
            <div>
              <SelectOption
                label="All"
                selected={selectedLocationId === "all"}
                onSelect={() => setSelectedLocationId("all")}
              />
              {locationOptions.map((location) => (
                <SelectOption
                  key={location.id}
                  label={formatLocation(location.id) ?? location.name}
                  selected={selectedLocationId === location.id}
                  onSelect={() => setSelectedLocationId(location.id)}
                />
              ))}
            </div>
          </FilterPill>

          <FilterPill
            label="Created By"
            value={
              selectedCreatedById === "all"
                ? "All"
                : userById.get(selectedCreatedById)?.name ?? "All"
            }
            active={selectedCreatedById !== "all"}
          >
            <div>
              <SelectOption
                label="All"
                selected={selectedCreatedById === "all"}
                onSelect={() => setSelectedCreatedById("all")}
              />
              {createdByOptions.map((user) => (
                <SelectOption
                  key={user.id}
                  label={user.name}
                  selected={selectedCreatedById === user.id}
                  onSelect={() => setSelectedCreatedById(user.id)}
                />
              ))}
            </div>
          </FilterPill>

          <FilterPill
            label="Form Template"
            value={
              selectedFormTemplateId === "all"
                ? "All"
                : formTemplateById.get(selectedFormTemplateId)?.name ?? "All"
            }
            active={selectedFormTemplateId !== "all"}
          >
            <div>
              <SelectOption
                label="All"
                selected={selectedFormTemplateId === "all"}
                onSelect={() => setSelectedFormTemplateId("all")}
              />
              {formTemplateOptions.map((template) => (
                <SelectOption
                  key={template.id}
                  label={template.name}
                  selected={selectedFormTemplateId === template.id}
                  onSelect={() => setSelectedFormTemplateId(template.id)}
                />
              ))}
            </div>
          </FilterPill>

          <FilterPill
            label="Type"
            value={selectedType === "all" ? "All" : selectedType}
            active={selectedType !== "all"}
          >
            <div>
              <SelectOption
                label="All"
                selected={selectedType === "all"}
                onSelect={() => setSelectedType("all")}
              />
              {allTypes.map((type) => (
                <SelectOption
                  key={type}
                  label={type}
                  selected={selectedType === type}
                  onSelect={() => setSelectedType(type)}
                />
              ))}
            </div>
          </FilterPill>

          <FilterPill
            label="Created Date"
            icon={Calendar}
            active={Boolean(createdFrom || createdTo)}
          >
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500">
                  From
                </label>
                <Input
                  type="date"
                  value={createdFrom}
                  onChange={(event) => setCreatedFrom(event.target.value)}
                  className="mt-1 h-9"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">
                  To
                </label>
                <Input
                  type="date"
                  value={createdTo}
                  onChange={(event) => setCreatedTo(event.target.value)}
                  className="mt-1 h-9"
                />
              </div>
              <p className="text-xs text-slate-400">
                Select a date range to narrow created dates.
              </p>
            </div>
          </FilterPill>

          <FilterPill
            label="Include Archived"
            icon={Archive}
            active={includeArchived}
          >
            <label className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <Checkbox
                checked={includeArchived}
                onCheckedChange={(checked) =>
                  toggleIncludeArchived(checked === true)
                }
              />
              <span>
                <span className="block font-medium">Include Archived</span>
                <span className="block text-xs text-slate-500">
                  Show archived access points in the table.
                </span>
              </span>
            </label>
          </FilterPill>
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <X className="size-3.5" />
          Clear Filters
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="border-b border-slate-100 hover:bg-slate-50">
              <TableHead className="h-11 px-4 text-xs font-semibold text-slate-600">
                <SortButton
                  label="Access Point Name"
                  sortKey="name"
                  activeSortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              </TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold text-slate-600">
                Type
              </TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold text-slate-600">
                Location
              </TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold text-slate-600">
                Asset
              </TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold text-slate-600">
                Form Template
              </TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold text-slate-600">
                Documents
              </TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold text-slate-600">
                Notify
              </TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold text-slate-600">
                Created By
              </TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold text-slate-600">
                <SortButton
                  label="Created Date"
                  sortKey="createdAt"
                  activeSortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              </TableHead>
              <TableHead className="h-11 px-4 text-xs font-semibold text-slate-600">
                <SortButton
                  label="Status"
                  sortKey="status"
                  activeSortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              </TableHead>
              <TableHead className="h-11 w-10 px-2" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccessPoints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="h-40 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm font-medium text-slate-700">
                      No access points match your filters
                    </p>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Clear filters
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAccessPoints.map((accessPoint) => {
                const user = userById.get(accessPoint.createdById);
                const asset = accessPoint.assetId
                  ? assetById.get(accessPoint.assetId)
                  : undefined;
                const location = formatLocation(accessPoint.locationId);
                const templateCount = getTemplateCount(accessPoint);
                const documentCount = getDocumentCount(accessPoint);
                const notifyCount = getNotifyCount(accessPoint);
                const documents = getDocuments(accessPoint);

                return (
                  <TableRow
                    key={accessPoint.id}
                    onClick={() => setSelectedAccessPoint(accessPoint)}
                    className="h-16 cursor-pointer border-b border-slate-100 hover:bg-slate-50"
                  >
                    <TableCell className="px-4 py-3 font-semibold text-slate-800">
                      {accessPoint.name}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <TypeBadge type={accessPoint.type} />
                    </TableCell>
                    <TableCell className="px-4 py-3 text-slate-600">
                      {location ? (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="size-3.5 text-slate-300" />
                          {location}
                        </span>
                      ) : (
                        <span className="text-slate-400">📍 No location</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-slate-600">
                      {asset?.name ?? "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-slate-600">
                      {templateCount > 0
                        ? pluralize(templateCount, "template")
                        : "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-slate-600">
                      {documentCount > 0 ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              onClick={stopRowClick}
                              className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-blue-700"
                            >
                              <FileText className="size-3.5 text-slate-400" />
                              {pluralize(documentCount, "document")}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            className="w-72"
                            onClick={stopRowClick}
                          >
                            <div className="space-y-2">
                              <p className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Attached Documents
                              </p>
                              {documents.map((document) => (
                                <div
                                  key={document.id}
                                  className="rounded-md border border-slate-100 px-2 py-2"
                                >
                                  <div className="flex items-center gap-2">
                                    <Badge className="h-5 rounded-full bg-slate-100 px-2 text-[10px] font-semibold text-slate-600 hover:bg-slate-100">
                                      {document.module}
                                    </Badge>
                                    <span className="text-sm font-medium text-slate-800">
                                      {document.title}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-xs text-slate-500">
                                    {document.subtitle}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-slate-600">
                      {notifyCount > 0 ? pluralize(notifyCount, "user") : "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="font-semibold text-slate-800">
                        {user?.name ?? "Unknown User"}
                      </div>
                      <div className="text-xs text-slate-400">
                        {user?.email ?? "—"}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-slate-700">
                      {formatDate(accessPoint.createdAt)}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <StatusBadge status={accessPoint.status} />
                    </TableCell>
                    <TableCell className="px-2 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            onClick={stopRowClick}
                            className="flex size-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            aria-label={`Open actions for ${accessPoint.name}`}
                          >
                            <MoreHorizontal className="size-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={stopRowClick}>
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit access point</DropdownMenuItem>
                          <DropdownMenuItem>Archive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      <QRDetailModal
        accessPoint={selectedAccessPoint}
        open={Boolean(selectedAccessPoint)}
        onClose={() => setSelectedAccessPoint(null)}
      />
    </section>
  );
}
