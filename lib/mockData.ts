import type {
  AccessPoint,
  Asset,
  Document,
  FormTemplate,
  Location,
  User,
} from "@/lib/types";

export const mockUsers: User[] = [
  {
    id: "user-joty-grewal",
    name: "Joty Grewal",
    email: "joty.grewal@upkeep.com",
  },
  {
    id: "user-amelia-chen",
    name: "Amelia Chen",
    email: "amelia.chen@upkeep.com",
  },
  {
    id: "user-marcus-lee",
    name: "Marcus Lee",
    email: "marcus.lee@upkeep.com",
  },
  {
    id: "user-priya-patel",
    name: "Priya Patel",
    email: "priya.patel@upkeep.com",
  },
  {
    id: "user-daniel-roberts",
    name: "Daniel Roberts",
    email: "daniel.roberts@upkeep.com",
  },
];

export const mockLocations: Location[] = [
  {
    id: "loc-toronto",
    name: "Toronto",
  },
  {
    id: "loc-toronto-maintenance",
    name: "Toronto - Maintenance floor",
    parentId: "loc-toronto",
  },
  {
    id: "loc-manufacturing-plant-3",
    name: "Manufacturing Plant 3",
  },
  {
    id: "loc-shipping-yard",
    name: "Shipping Yard",
  },
];

export const mockAssets: Asset[] = [
  {
    id: "asset-hydraulic-press-01",
    name: "Hydraulic Press 01",
  },
  {
    id: "asset-conveyor-belt-a",
    name: "Conveyor Belt A",
  },
  {
    id: "asset-forklift-7",
    name: "Forklift 7",
  },
  {
    id: "asset-mixing-tank-2",
    name: "Mixing Tank 2",
  },
];

export const mockFormTemplates: FormTemplate[] = [
  {
    id: "form-test-template-2",
    name: "Test Template #2",
    description: "Standard safety event intake form for plant floor incidents.",
  },
  {
    id: "form-test-template-4",
    name: "Test Template 4",
    description: "Follow-up safety event form with additional corrective actions.",
  },
];

export const mockDocuments: Document[] = [
  {
    id: "doc-sds-acetone",
    module: "SDS",
    title: "Acetone",
    subtitle: "Safety Data Sheet",
    lastUpdated: "2026-01-15",
    ghsSections: [
      {
        sectionNumber: 1,
        title: "Identification",
        content:
          "Acetone solvent for industrial cleaning and laboratory use. Emergency contact: EHS response desk.",
      },
      {
        sectionNumber: 2,
        title: "Hazard Identification",
        content:
          "Highly flammable liquid and vapor. Causes serious eye irritation and may cause drowsiness or dizziness.",
      },
      {
        sectionNumber: 4,
        title: "First-Aid Measures",
        content:
          "Move exposed person to fresh air. Rinse eyes with water for at least 15 minutes and remove contaminated clothing.",
      },
      {
        sectionNumber: 7,
        title: "Handling and Storage",
        content:
          "Keep away from heat, sparks, and open flame. Use only with adequate ventilation and bond containers when transferring.",
      },
      {
        sectionNumber: 8,
        title: "Exposure Controls and PPE",
        content:
          "Use splash goggles, nitrile gloves, and local exhaust ventilation. Follow posted occupational exposure limits.",
      },
    ],
  },
  {
    id: "doc-sds-sodium-hydroxide",
    module: "SDS",
    title: "Sodium Hydroxide",
    subtitle: "Safety Data Sheet",
    lastUpdated: "2026-01-18",
    ghsSections: [
      {
        sectionNumber: 1,
        title: "Identification",
        content:
          "Sodium hydroxide pellets and solution used for pH adjustment and cleaning operations.",
      },
      {
        sectionNumber: 2,
        title: "Hazard Identification",
        content:
          "Causes severe skin burns and eye damage. Corrosive to metals and harmful if swallowed.",
      },
      {
        sectionNumber: 4,
        title: "First-Aid Measures",
        content:
          "Immediately flush affected skin or eyes with water for at least 15 minutes and seek medical attention.",
      },
      {
        sectionNumber: 7,
        title: "Handling and Storage",
        content:
          "Avoid breathing dust or mist. Store tightly closed in corrosion-resistant containers away from acids.",
      },
      {
        sectionNumber: 8,
        title: "Exposure Controls and PPE",
        content:
          "Wear chemical goggles, face shield, chemical-resistant gloves, apron, and use eyewash access nearby.",
      },
    ],
  },
  {
    id: "doc-sds-isopropyl-alcohol",
    module: "SDS",
    title: "Isopropyl Alcohol",
    subtitle: "Safety Data Sheet",
    lastUpdated: "2026-01-22",
    ghsSections: [
      {
        sectionNumber: 1,
        title: "Identification",
        content:
          "Isopropyl alcohol used for surface disinfection, wipe-downs, and light-duty cleaning.",
      },
      {
        sectionNumber: 2,
        title: "Hazard Identification",
        content:
          "Highly flammable liquid and vapor. Causes serious eye irritation and may cause drowsiness or dizziness.",
      },
      {
        sectionNumber: 4,
        title: "First-Aid Measures",
        content:
          "Remove ignition sources, move to fresh air, and rinse eyes or skin with water after contact.",
      },
      {
        sectionNumber: 7,
        title: "Handling and Storage",
        content:
          "Keep container closed and grounded. Store in a cool, ventilated flammable cabinet away from oxidizers.",
      },
      {
        sectionNumber: 8,
        title: "Exposure Controls and PPE",
        content:
          "Use safety glasses, compatible gloves, and ventilation sufficient to keep vapor below exposure limits.",
      },
    ],
  },
  {
    id: "doc-loto-hydraulic-press",
    module: "LOTO",
    title: "Hydraulic Press LOTO",
    subtitle: "Lockout/tagout procedure",
    lastUpdated: "2026-02-01",
    steps: [
      {
        stepNumber: 1,
        title: "Notify affected employees",
        instruction:
          "Tell operators and nearby personnel the press will be shut down for servicing.",
      },
      {
        stepNumber: 2,
        title: "Shut down equipment",
        instruction:
          "Use the normal stop control and wait for all press motion to stop.",
      },
      {
        stepNumber: 3,
        title: "Isolate electrical energy",
        instruction:
          "Open the main disconnect and apply a personal lock and completed tag.",
      },
      {
        stepNumber: 4,
        title: "Release hydraulic pressure",
        instruction:
          "Bleed pressure at the manifold and lower the ram to its blocked position.",
      },
      {
        stepNumber: 5,
        title: "Verify zero energy",
        instruction:
          "Try the start control and confirm gauges read zero before work begins.",
      },
      {
        stepNumber: 6,
        title: "Restore after inspection",
        instruction:
          "Clear tools, remove locks by owner only, and restart using the standard sequence.",
      },
    ],
  },
  {
    id: "doc-loto-conveyor-belt",
    module: "LOTO",
    title: "Conveyor Belt LOTO",
    subtitle: "Lockout/tagout procedure",
    lastUpdated: "2026-01-28",
    steps: [
      {
        stepNumber: 1,
        title: "Notify line personnel",
        instruction:
          "Inform operators, shipping staff, and maintenance that the conveyor will be locked out.",
      },
      {
        stepNumber: 2,
        title: "Stop conveyor",
        instruction:
          "Press stop, wait for movement to cease, and remove any loose product from the belt.",
      },
      {
        stepNumber: 3,
        title: "Disconnect power",
        instruction:
          "Open the motor disconnect and apply a lock and tag at the isolation point.",
      },
      {
        stepNumber: 4,
        title: "Block stored energy",
        instruction:
          "Secure gravity take-up and block rollers that could rotate unexpectedly.",
      },
      {
        stepNumber: 5,
        title: "Verify isolation",
        instruction:
          "Attempt start from the control station and confirm the conveyor remains stopped.",
      },
    ],
  },
  {
    id: "doc-sop-forklift-operation",
    module: "SOP",
    title: "Forklift Operation",
    subtitle: "Standard operating procedure",
    lastUpdated: "2026-01-12",
    procedureSteps: [
      {
        stepNumber: 1,
        instruction:
          "Complete the pre-use inspection checklist and report defects before operation.",
      },
      {
        stepNumber: 2,
        instruction:
          "Fasten seat belt, check mirrors, sound horn at intersections, and keep forks low while traveling.",
      },
      {
        stepNumber: 3,
        instruction:
          "Verify load weight, center the forks, and tilt the mast back before moving.",
      },
      {
        stepNumber: 4,
        instruction:
          "Park in designated areas with forks lowered, controls neutral, brake set, and key removed.",
      },
    ],
  },
  {
    id: "doc-sop-chemical-spill-response",
    module: "SOP",
    title: "Chemical Spill Response",
    subtitle: "Standard operating procedure",
    lastUpdated: "2026-01-16",
    procedureSteps: [
      {
        stepNumber: 1,
        instruction:
          "Assess the spill from a safe distance and identify the material using labels or SDS information.",
      },
      {
        stepNumber: 2,
        instruction:
          "Isolate the area, warn nearby personnel, and call EHS for unknown or large spills.",
      },
      {
        stepNumber: 3,
        instruction:
          "Put on required PPE and use the correct spill kit for the material involved.",
      },
      {
        stepNumber: 4,
        instruction:
          "Contain, absorb, collect waste in labeled containers, and document the cleanup.",
      },
    ],
  },
  {
    id: "doc-jha-working-at-heights",
    module: "JHA",
    title: "Working at Heights",
    subtitle: "Job hazard analysis",
    lastUpdated: "2026-01-20",
    hazards: [
      {
        hazard: "Falls from ladders or platforms",
        controls: [
          "Use inspected fall protection when required.",
          "Maintain three points of contact on ladders.",
        ],
      },
      {
        hazard: "Dropped tools or materials",
        controls: [
          "Barricade the work zone below.",
          "Use tool lanyards for elevated work.",
        ],
      },
      {
        hazard: "Unstable work surfaces",
        controls: [
          "Verify platform rating before access.",
          "Stop work if guardrails or decking are damaged.",
        ],
      },
      {
        hazard: "Weather or environmental exposure",
        controls: [
          "Suspend outdoor work during high winds or lightning.",
          "Use task lighting in low visibility areas.",
        ],
      },
    ],
  },
  {
    id: "doc-ptw-hot-work",
    module: "PTW",
    title: "Hot Work Permit",
    subtitle: "Permit to work",
    lastUpdated: "2026-02-03",
    approvalRequirements: [
      "Supervisor approval before work begins.",
      "EHS review for occupied or high-risk areas.",
      "Fire watch assignment documented on the permit.",
    ],
    precautions: [
      "Remove combustible material within 35 feet or protect with fire blankets.",
      "Verify extinguishers are charged and accessible.",
      "Monitor the area for at least 30 minutes after work ends.",
    ],
  },
  {
    id: "doc-audit-monthly-safety-walkthrough",
    module: "Audit",
    title: "Monthly Safety Walk-through",
    subtitle: "Audit checklist",
    lastUpdated: "2026-02-05",
    checklistItems: [
      {
        itemNumber: 1,
        instruction: "Emergency exits are clear and unlocked.",
      },
      {
        itemNumber: 2,
        instruction: "Fire extinguishers are mounted, tagged, and accessible.",
      },
      {
        itemNumber: 3,
        instruction: "Eyewash stations have current inspection tags.",
      },
      {
        itemNumber: 4,
        instruction: "Chemical containers are labeled and closed.",
      },
      {
        itemNumber: 5,
        instruction: "Aisles and walking surfaces are free of trip hazards.",
      },
      {
        itemNumber: 6,
        instruction: "Machine guards are in place and functional.",
      },
      {
        itemNumber: 7,
        instruction: "PPE stations are stocked for the work area.",
      },
      {
        itemNumber: 8,
        instruction: "Waste containers are labeled and not overflowing.",
      },
    ],
  },
];

export const mockAccessPoints: AccessPoint[] = [
  {
    id: "ap-manufacturing-plant-3-2026-02-17",
    name: "Manufacturing Plant 3",
    type: "Both",
    locationId: "loc-toronto-maintenance",
    assetId: "asset-hydraulic-press-01",
    formTemplateIds: ["form-test-template-2", "form-test-template-4"],
    documentIds: ["doc-sds-acetone", "doc-loto-hydraulic-press"],
    notifyUserIds: ["user-amelia-chen"],
    createdById: "user-joty-grewal",
    createdAt: "2026-02-17",
    lastScannedAt: "2026-02-18",
    status: "active",
  },
  {
    id: "ap-manufacturing-plant-3-2026-02-11",
    name: "Manufacturing Plant 3",
    type: "Event",
    locationId: "loc-toronto-maintenance",
    formTemplateIds: ["form-test-template-2"],
    notifyUserIds: ["user-marcus-lee"],
    createdById: "user-joty-grewal",
    createdAt: "2026-02-11",
    status: "active",
  },
  {
    id: "ap-manufacturing-plant-3-2026-02-10",
    name: "Manufacturing Plant 3",
    type: "Event",
    locationId: "loc-toronto-maintenance",
    formTemplateIds: ["form-test-template-2", "form-test-template-4"],
    createdById: "user-joty-grewal",
    createdAt: "2026-02-10",
    status: "active",
  },
  {
    id: "ap-manufacturing-plant-3-2026-01-28",
    name: "Manufacturing Plant 3",
    type: "Documentation",
    documentIds: ["doc-sds-sodium-hydroxide", "doc-sop-chemical-spill-response"],
    createdById: "user-joty-grewal",
    createdAt: "2026-01-28",
    status: "active",
  },
  {
    id: "ap-manufacturing-plant-3-2026-01-27",
    name: "Manufacturing Plant 3",
    type: "Event",
    formTemplateIds: ["form-test-template-4"],
    createdById: "user-joty-grewal",
    createdAt: "2026-01-27",
    status: "active",
  },
  {
    id: "ap-test1-2026-01-12",
    name: "Test1",
    type: "Event",
    formTemplateIds: ["form-test-template-2"],
    notifyUserIds: ["user-priya-patel"],
    createdById: "user-joty-grewal",
    createdAt: "2026-01-12",
    status: "active",
  },
  {
    id: "ap-manufacturing-plant-3-2025-12-12",
    name: "Manufacturing Plant 3",
    type: "Documentation",
    documentIds: ["doc-sds-isopropyl-alcohol", "doc-audit-monthly-safety-walkthrough"],
    createdById: "user-joty-grewal",
    createdAt: "2025-12-12",
    status: "active",
  },
  {
    id: "ap-testqr-code-123-2025-12-08",
    name: "TestQR Code 123",
    type: "Both",
    formTemplateIds: ["form-test-template-2"],
    documentIds: ["doc-jha-working-at-heights"],
    notifyUserIds: ["user-daniel-roberts"],
    createdById: "user-joty-grewal",
    createdAt: "2025-12-08",
    status: "active",
  },
  {
    id: "ap-manufacturing-plant-3-2025-12-02",
    name: "Manufacturing Plant 3",
    type: "Event",
    formTemplateIds: ["form-test-template-2"],
    createdById: "user-joty-grewal",
    createdAt: "2025-12-02",
    status: "active",
  },
  {
    id: "ap-manufacturing-plant-2-2025-12-02",
    name: "Manufacturing Plant 2",
    type: "Documentation",
    documentIds: ["doc-loto-conveyor-belt", "doc-sop-forklift-operation"],
    createdById: "user-joty-grewal",
    createdAt: "2025-12-02",
    status: "active",
  },
  {
    id: "ap-access-point-2-2025-11-13",
    name: "Access Point 2",
    type: "Event",
    formTemplateIds: ["form-test-template-4"],
    createdById: "user-joty-grewal",
    createdAt: "2025-11-13",
    status: "active",
  },
  {
    id: "ap-test-point-348-2025-10-20",
    name: "Test Point 348",
    type: "Event",
    formTemplateIds: ["form-test-template-2"],
    createdById: "user-joty-grewal",
    createdAt: "2025-10-20",
    status: "active",
  },
  {
    id: "ap-manufacturing-plant-3-2025-09-25",
    name: "Manufacturing Plant 3",
    type: "Documentation",
    documentIds: ["doc-ptw-hot-work"],
    createdById: "user-joty-grewal",
    createdAt: "2025-09-25",
    status: "active",
  },
  {
    id: "ap-manufacturing-plant-5-2025-09-17",
    name: "Manufacturing Plant 5",
    type: "Event",
    formTemplateIds: ["form-test-template-2"],
    createdById: "user-joty-grewal",
    createdAt: "2025-09-17",
    status: "active",
  },
  {
    id: "ap-shipping-yard-2025-09-16",
    name: "Shipping Yard",
    type: "Event",
    locationId: "loc-shipping-yard",
    formTemplateIds: ["form-test-template-4"],
    createdById: "user-joty-grewal",
    createdAt: "2025-09-16",
    status: "active",
  },
];
