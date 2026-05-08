export type DocumentModule = "SDS" | "LOTO" | "SOP" | "JHA" | "PTW" | "Audit";

type BaseDocument = {
  id: string;
  module: DocumentModule;
  title: string;
  subtitle: string;
  lastUpdated: string;
};

export type SDSDocument = BaseDocument & {
  module: "SDS";
  ghsSections: {
    sectionNumber: number;
    title: string;
    content: string;
  }[];
};

export type LOTODocument = BaseDocument & {
  module: "LOTO";
  steps: {
    stepNumber: number;
    title: string;
    instruction: string;
  }[];
};

export type SOPDocument = BaseDocument & {
  module: "SOP";
  procedureSteps: {
    stepNumber: number;
    instruction: string;
  }[];
};

export type JHADocument = BaseDocument & {
  module: "JHA";
  hazards: {
    hazard: string;
    controls: string[];
  }[];
};

export type PTWDocument = BaseDocument & {
  module: "PTW";
  approvalRequirements: string[];
  precautions: string[];
};

export type AuditDocument = BaseDocument & {
  module: "Audit";
  checklistItems: {
    itemNumber: number;
    instruction: string;
  }[];
};

export type Document =
  | SDSDocument
  | LOTODocument
  | SOPDocument
  | JHADocument
  | PTWDocument
  | AuditDocument;

export type AccessPointType = "Event" | "Documentation" | "Both";

export type UpToFiveIds =
  | []
  | [string]
  | [string, string]
  | [string, string, string]
  | [string, string, string, string]
  | [string, string, string, string, string];

export type AccessPoint = {
  id: string;
  name: string;
  type: AccessPointType;
  locationId?: string;
  assetId?: string;
  formTemplateIds?: UpToFiveIds;
  documentIds?: string[];
  notifyUserIds?: string[];
  createdById: string;
  createdAt: string;
  lastScannedAt?: string;
  status: "active" | "archived";
};

export type FormTemplate = {
  id: string;
  name: string;
  description: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Location = {
  id: string;
  name: string;
  parentId?: string;
};

export type Asset = {
  id: string;
  name: string;
};
