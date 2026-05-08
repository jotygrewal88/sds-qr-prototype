import Link from "next/link";
import {
  Building2,
  Calendar,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  FileCheck,
  FileSpreadsheet,
  FileText,
  FlaskConical,
  HardHat,
  LayoutDashboard,
  Lock,
  QrCode,
  Settings,
  Shield,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  href?: string;
};

type NavSection = {
  label?: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Safety Management",
    items: [
      {
        label: "Access Points",
        icon: QrCode,
        active: true,
        href: "/admin/access-points",
      },
      {
        label: "Safety Events",
        icon: TriangleAlert,
      },
      {
        label: "CAPAs",
        icon: ClipboardCheck,
      },
      {
        label: "Compliance Calendar",
        icon: Calendar,
      },
    ],
  },
  {
    label: "OSHA",
    items: [
      {
        label: "OSHA Log (Form 300)",
        icon: FileText,
      },
      {
        label: "Summary (Form 300A)",
        icon: FileSpreadsheet,
      },
      {
        label: "Agency Reports",
        icon: Building2,
      },
    ],
  },
  {
    label: "Documentation",
    items: [
      {
        label: "Job Hazard Analyses",
        icon: HardHat,
      },
      {
        label: "Standard Operating Procedures",
        icon: ClipboardList,
      },
      {
        label: "Lockout/Tagout",
        icon: Lock,
      },
      {
        label: "Permit to Work",
        icon: FileCheck,
      },
      {
        label: "Audits & Inspections",
        icon: ClipboardCheck,
      },
      {
        label: "SDS Library",
        icon: FlaskConical,
      },
    ],
  },
  {
    label: "Safety Actions",
    items: [
      {
        label: "Safety Work Orders",
        icon: Wrench,
      },
    ],
  },
];

function NavItem({ item }: { item: NavItem }) {
  const Icon = item.icon;
  const className = cn(
    "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950",
    item.active && "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700",
  );

  const content = (
    <>
      <Icon
        className={cn(
          "size-4 shrink-0 text-slate-500",
          item.active && "text-blue-700",
        )}
      />
      <span>{item.label}</span>
    </>
  );

  if (item.href) {
    return (
      <Link href={item.href} className={className} aria-current="page">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={className}>
      {content}
    </button>
  );
}

export function Sidebar() {
  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-md text-red-600">
            <Shield className="size-5 fill-red-50 stroke-[2.25]" />
          </div>
          <span className="text-base font-semibold tracking-tight text-slate-950">
            UpKeep EHS
          </span>
        </div>
        <div className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-700">
          J
        </div>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        {navSections.map((section, sectionIndex) => (
          <div
            key={section.label ?? "primary"}
            className={cn(sectionIndex > 0 && "mt-5")}
          >
            {section.label ? (
              <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {section.label}
              </div>
            ) : null}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavItem key={item.label} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t border-slate-100 px-3 py-4">
        <div className="space-y-1">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950"
          >
            <span className="flex items-center gap-3">
              <Settings className="size-4 text-slate-500" />
              Settings
            </span>
            <ChevronDown className="size-4 text-slate-400" />
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950"
          >
            Privacy Settings
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
          >
            UpKeep CMMS
          </button>
        </div>
      </div>
    </aside>
  );
}
