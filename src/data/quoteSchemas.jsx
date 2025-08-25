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
];

// Coverage → schema (array of field objects)
// Each field can optionally have:
// - showIf(values) => boolean
// - toPayload(value) => transformed value
// - inputMode, placeholder, required, options (for select)
export const COVERAGE_SCHEMAS = {
  Homeowners: [
    { id: "ownerName", type: "text", label: "Name of the owner / 房主的姓名" },
    { id: "address", type: "text", label: "Address of the insured house / 投保房屋的地址" },
    {
      id: "squareFt",
      type: "text",
      inputMode: "numeric",
      label: "Square footage / 房屋的面积 (sq ft)",
      toPayload: toInt,
    },
    { id: "yearBuilt", type: "text", inputMode: "numeric", label: "Year built / 建造年份", toPayload: toInt },
    { id: "construction", type: "text", label: "Building materials / 房屋建筑材料" },
    { id: "hasMortgage", type: "checkbox", label: "Any mortgage? / 是否有房屋贷款？" },
    {
      id: "bankReq",
      type: "text",
      label: "Bank requirements (if any) / 贷款银行是否有要求",
      showIf: (v) => !!v.hasMortgage,
    },
    {
      id: "mortgageeName",
      type: "text",
      label: "Mortgagee name / 贷款银行名字",
      showIf: (v) => !!v.hasMortgage,
    },
    {
      id: "mortgageeAddress",
      type: "text",
      label: "Mortgagee address / 贷款银行地址",
      showIf: (v) => !!v.hasMortgage,
    },
    {
      id: "loanNumber",
      type: "text",
      label: "Loan number / 贷款号码",
      showIf: (v) => !!v.hasMortgage,
    },
    { id: "effectiveDate", type: "date", label: "Effective date / 生效日期" },
    { id: "notes", type: "textarea", label: "Other notes / 其他补充" },
  ],

  Auto: [
    { id: "driverName", type: "text", label: "Primary driver name" },
    { id: "vin", type: "text", label: "VIN" },
    { id: "garagingAddress", type: "text", label: "Garaging address" },
    { id: "notes", type: "textarea", label: "Notes (drivers, tickets, coverage limits)" },
  ],

  "Business (BOP)": [
    { id: "companyName", type: "text", label: "Company's name / 公司名称", required: true },
    {
      id: "ein",
      type: "text",
      label: "Company's EIN / 公司EIN (XX-XXXXXXX)",
      inputMode: "numeric",
      mask: einMask,     // UI mask
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
    if (f.toPayload) details[f.id] = f.toPayload(raw);
    else details[f.id] = raw ?? null;
  }
  // Special nesting example for homeowners mortgagee:
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