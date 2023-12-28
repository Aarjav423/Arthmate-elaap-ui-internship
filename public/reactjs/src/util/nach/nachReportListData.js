import { storedList } from "../localstorage";
import { checkAccessTags } from "../uam";
const user = storedList("user");
const isTagged =
  process.env.REACT_APP_BUILD_VERSION > 1
    ? user?.access_metrix_tags?.length
    : false;

export const nachReportListData = [
  {
    id: 1,
    report_category: "Bank Mandate Migration File",
    report_type: "enach_migration_report",
    report_name: "Bank_Mandate_Migration_File",
    description: "Reports of bank mandate migration file",
      disabled: isTagged
      ? !checkAccessTags([
          "tag_nach_reports_bank_migration_r",
        ])
      : false
  },
];