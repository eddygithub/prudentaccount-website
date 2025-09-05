// Helpers for cleaning values
const onlyDigits = (v = "") => String(v).replace(/\D/g, "");
const toInt = (v) => (v === "" || v == null ? null : parseInt(String(v), 10));
const toNumber = (v) => (v === "" || v == null ? null : Number(v));
const einMask = (v = "") => {
  const d = onlyDigits(v).slice(0, 9);
  return d.length <= 2 ? d : `${d.slice(0, 2)}-${d.slice(2)}`;
};

// Shared contact fields (top of form)
export const CONTACT_FIELDS = [
  { id: "fullName", type: "text", label: "Full name", required: true },
  { id: "email", type: "email", label: "Email", required: true },
  { id: "phone", type: "tel", label: "Phone" },
  {
    id: "preferredDays",
    type: "select",
    label: "Best days to contact / 方便联系的日子",
    multiple: true,
    options: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
  },
  { id: "preferredStart", type: "time", label: "Earliest time / 最早联系时间" },
  { id: "preferredEnd",   type: "time", label: "Latest time / 最晚联系时间" },
];

// Coverage → schema
export const COVERAGE_SCHEMAS = {
  Homeowners: [
    { id: "ownerName", type: "text", label: "Name of the owner / 房主的姓名" },
    { id: "address", type: "text", label: "Address of the insured house / 投保房屋的地址" },
    { id: "squareFt", type: "text", inputMode: "numeric", label: "Square footage / 房屋的面积 (sq ft)", toPayload: toInt },
    { id: "yearBuilt", type: "text", inputMode: "numeric", label: "Year built / 建造年份", toPayload: toInt },
    { id: "construction", type: "text", label: "Building materials / 房屋建筑材料" },
    { id: "hasMortgage", type: "checkbox", label: "Any mortgage? / 是否有房屋贷款？" },
    { id: "bankReq", type: "text", label: "Bank requirements (if any) / 贷款银行是否有要求", showIf: (v) => !!v.hasMortgage },
    { id: "mortgageeName", type: "text", label: "Mortgagee name / 贷款银行名字", showIf: (v) => !!v.hasMortgage },
    { id: "mortgageeAddress", type: "text", label: "Mortgagee address / 贷款银行地址", showIf: (v) => !!v.hasMortgage },
    { id: "loanNumber", type: "text", label: "Loan number / 贷款号码", showIf: (v) => !!v.hasMortgage },
    { id: "effectiveDate", type: "date", label: "Effective date / 生效日期" },
    { id: "notes", type: "textarea", label: "Other notes / 其他补充" },
  ],

  // Commercial Property
  "Commercial Property": [
    { id: "companyName", type: "text", label: "Company's name / 业主公司名字", required: true },
    {
      id: "ein",
      type: "text",
      label: "Company's EIN / 业主公司税号 (XX-XXXXXXX)",
      inputMode: "numeric",
      mask: einMask,
      toPayload: (v) => onlyDigits(v),
    },
    { id: "mailingAddress", type: "text", label: "Mailing address / 业主联系地址" },

    // These two are technically captured in the shared CONTACT_FIELDS already,
    // but included here since you asked for them in this section.
    { id: "contactPerson", type: "text", label: "Owner name / 业主名字" },
    { id: "contactPhone", type: "tel", label: "Owner phone number / 业主电话号码" },

    { id: "propertyAddress", type: "text", label: "Property address / 物业地址" },
    { id: "occupancyType", type: "select", label: "Occupancy Type"
      , options: ["Rental", "Owner-Ocuppied", "Vacant"]
     },
    { id: "yearBuilt", type: "text", inputMode: "numeric", label: "Year built / 建筑年份", toPayload: toInt },

    { id: "commercialUnits", type: "text", inputMode: "numeric", label: "How many commercial units? / 商业单位有几个？", toPayload: toInt },
    { id: "commercialSqFt", type: "text", inputMode: "numeric", label: "Commercial sq ft / 商业单位的面积", toPayload: toInt },
    {
      id: "tenantTypes",
      type: "textarea",
      label: "Type of tenants (each unit) / 每个商业单位租户类型",
      placeholder: "e.g., Unit 1: restaurant; Unit 2: retail clothing; Unit 3: office…",
    },

    { id: "residentialUnits", type: "text", inputMode: "numeric", label: "How many residential units? / 居家单位有几个？", toPayload: toInt },
    { id: "residentialSqFt", type: "text", inputMode: "numeric", label: "Residential sq ft / 居家面积", toPayload: toInt },

    { id: "stories", type: "text", inputMode: "numeric", label: "How many stories? / 大楼有几层？", toPayload: toInt },

    { id: "effectiveDate", type: "date", label: "Insurance effective date / 生效日期" },
    { id: "notes", type: "textarea", label: "Other notes / 其他补充" },
  ],

  "Workers' Compensation": [
    { id: "companyName", type: "text", label: "Company's name / 公司名称", required: true },
    {
      id: "ein",
      type: "text",
      label: "Company's EIN / 公司EIN (XX-XXXXXXX)",
      inputMode: "numeric",
      mask: einMask,
      toPayload: (v) => onlyDigits(v),
    },
    { id: "mailingAddress", type: "text", label: "Mailing address / 联系地址" },
    { id: "businessAddress", type: "text", label: "Business address / 营业地址" },

    { id: "contactName", type: "text", label: "Contact name / 联系人姓名" },
    { id: "contactNumber", type: "tel", label: "Contact number / 联系号码" },

    { id: "shareholderCount", type: "text", inputMode: "numeric", label: "Number of shareholders / 股东数量", toPayload: toInt },

    {
      id: "shareholdersDetails",
      type: "textarea",
      label: "Shareholders (name, % ownership, remuneration) / 股东姓名、持股比例、薪酬",
      placeholder: "e.g.\nAlice Wang, 60%, $120,000\nBob Chen, 40%, $80,000",
    },

    {
      id: "employeesDetails",
      type: "textarea",
      label: "Employees: count, duties, est. annual remuneration / 员工数量、职位、预计年薪",
      placeholder: "e.g.\n2 — Warehouse staff — $45,000 each\n1 — Office admin — $50,000",
    },
    { id: "effectiveDate", type: "date", label: "Insurance effective date / 保险生效时间" },
    { id: "notes", type: "textarea", label: "Other notes / 其他补充" },
  ],

"Builder Risk": [
  { id: "companyName", type: "text", label: "Company's name / 公司名字", required: true },
  {
    id: "ein",
    type: "text",
    label: "Company's EIN / 公司税号 (XX-XXXXXXX)",
    inputMode: "numeric",
    mask: einMask,
    toPayload: (v) => onlyDigits(v),
  },
  { id: "projectAddress", type: "text", label: "Project Address / 工程地址", required: true },
  { id: "mailingAddress", type: "text", label: "Mailing address / 联系地址" },

  { id: "projectType", type: "text", label: "Project Type / 工程类型" },
  {
    id: "projectMode",
    type: "select",
    label: "New or Remodel/Renovation / 新建还是改建/翻新",
    options: ["NEW", "REMODEL"],
  },
  {
    id: "scopeOfWork",
    type: "textarea",
    label: "Scope of work / 该工程的工作范围",
    placeholder: "Briefly describe materials, trades, structural changes, etc.",
  },

  { id: "startDate", type: "date", label: "Anticipated start date / 工程预计开始日期" },
  { id: "finishDate", type: "date", label: "Anticipated finish date / 工程预计结束日期" },

  {
    id: "totalConstructionValue",
    type: "text",
    inputMode: "numeric",
    label: "Total Construction Value (USD) / 工程建设总价值",
    toPayload: toNumber,
    placeholder: "e.g., 500000",
  },

  {
    id: "coverageRequirements",
    type: "textarea",
    label: "Insurance coverage requirements / 保额要求",
    placeholder: "Limits, endorsements, lender requirements, etc.",
  },
  {
    id: "claimsHistory",
    type: "textarea",
    label: "Insurance claims history / 保险索赔历史",
    placeholder: "Dates, type, amounts (if any)",
  },

  { id: "effectiveDate", type: "date", label: "Insurance effective date / 保险生效时间" },
  { id: "notes", type: "textarea", label: "Other notes / 其他补充" },
],
"(GC) - General Contractor": [
  { id: "companyName", type: "text", label: "Company's name / 公司名字", required: true },
  {
    id: "ein",
    type: "text",
    label: "Company's EIN / 公司税号 (XX-XXXXXXX)",
    inputMode: "numeric",
    mask: einMask,
    toPayload: (v) => onlyDigits(v),
  },
  { id: "propertyAddress", type: "text", label: "Property address / 物业地址" },
  { id: "mailingAddress", type: "text", label: "Mailing address / 联系地址" },

  {
    id: "yearsInBusiness",
    type: "text",
    inputMode: "numeric",
    label: "Years in business / 经营年限",
    toPayload: toInt,
  },
  {
    id: "yearsExperience",
    type: "text",
    inputMode: "numeric",
    label: "Years of experience in this field / 在该领域有多少年经验",
    toPayload: toInt,
  },
  {
    id: "constructionOpsPct",
    type: "text",
    inputMode: "numeric",
    label: "Percentage of construction operations (%) / 施工作业占比",
    placeholder: "0–100",
    toPayload: toNumber,
  },
  {
    id: "anticipatedSales",
    type: "text",
    inputMode: "numeric",
    label: "Anticipated sales for upcoming year (USD) / 预计明年销售额",
    toPayload: toNumber,
  },
  {
    id: "employeePayroll",
    type: "textarea",
    label: "Employee payroll by class / 不同类别的员工工资",
    placeholder: "List classes (e.g., clerical, field) and annual payroll for each",
  },

  {
    id: "coverageRequirements",
    type: "textarea",
    label: "Insurance coverage requirements / 保额要求",
  },
  {
    id: "claimsHistory",
    type: "textarea",
    label: "Insurance claims history / 保险索赔历史",
  },

  { id: "effectiveDate", type: "date", label: "Insurance effective date / 保险生效时间" },
  { id: "notes", type: "textarea", label: "Other notes / 其他补充" },
],


  "Business (BOP)": [
    { id: "companyName", type: "text", label: "Company's name / 公司名称", required: true },
    {
      id: "ein",
      type: "text",
      label: "Company's EIN / 公司EIN (XX-XXXXXXX)",
      inputMode: "numeric",
      mask: einMask,
      toPayload: (v) => onlyDigits(v),
    },
    { id: "mailingAddress", type: "text", label: "Mailing address" },
    { id: "businessAddress", type: "text", label: "Business address" },
    { id: "natureOfBusiness", type: "text", label: "Nature of business / 公司的主营业务" },
    { id: "businessArea", type: "text", label: "Operating area / 业务覆盖区域" },
    { id: "employees", type: "text", inputMode: "numeric", label: "Number of employees / 员工人数", toPayload: toInt },
    { id: "annualRevenue", type: "text", inputMode: "numeric", label: "Annual revenue (USD) / 年营业额", toPayload: toNumber },
    { id: "buildingYear", type: "text", inputMode: "numeric", label: "Year of building / 建筑年份", toPayload: toInt },
    { id: "landlordLimitReq", type: "textarea", label: "Insurance limit requirements (landlord) / 房东要求的保险限额" },
    { id: "hasClaims", type: "checkbox", label: "Any prior insurance claims? / 是否有过保险理赔？" },
    {
      id: "claimDetails",
      type: "textarea",
      label: "Describe claims (date, type, amount) / 理赔情况说明",
      showIf: (v) => !!v.hasClaims,
    },
    { id: "effectiveDate", type: "date", label: "Insurance effective date / 生效日期" },
    { id: "notes", type: "textarea", label: "Other notes / 其他补充" },
  ],
};

// Utility to build a payload object for the chosen coverage from current values
export function buildPayload(coverage, contactValues, coverageValues) {
  const schema = COVERAGE_SCHEMAS[coverage] || [];
  const details = {};
  for (const f of schema) {
    const raw = coverageValues[f.id];
    details[f.id] = f.toPayload ? f.toPayload(raw) : (raw ?? null);
  }

  // Special nesting for homeowners mortgagee
  if (coverage === "Homeowners" && details.hasMortgage) {
    details.mortgagee = {
      name: details.mortgageeName || null,
      address: details.mortgageeAddress || null,
      loanNumber: details.loanNumber || null,
    };
  }

  return {
    coverage,
    contact: { ...contactValues },
    details,
  };
}
