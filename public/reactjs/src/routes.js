import { lazy } from "react";

import Dashboard from "views/admin/Dashboards/Dashboard.js";
import CreateUser from "views/User.js";
import RoleMetrix from "views/roleMetrix/roleMetrix.js";
import Onboard from "./views/partner/addPartner.js";
import PartnerList from "./views/partner/partnerList.js";
import PartnerDetails from "views/partner/partnerDetails.js";
import OnboardAnchor from "./views/anchor/addAnchor.js";
import AnchorList from "./views/anchor/anchorList.js";
import AnchorDetails from "./views/anchor/anchorDetails.js";
import DefaultLoanType from "views/loanType/defaultLoanType.js";
import LoanTemplate from "views/loanSchema/loanTemplate.js";
import LoanSchema from "views/loanSchema/loanSchema.js";
import CustomerProfile from "views/customers/customerProfile.js";
import ListLoanSchema from "views/loanSchema/list_loan_schema_page.js";
import DefaultTemplateUpdate from "./views/loanSchema/updateDefaultTemplate.js";
import ProductList from "views/product/productList.js";
import CreateProduct from "views/product/product.js";
import EditProduct from "./views/product/editProduct.js";
import DisbursementChannel from "views/disbursementChannel/disbursementChannelConfig.js";
import DisbursementChannelList from "views/disbursementChannel/disbursementChannelConfigList.js";
import AddServices from "views/services/addServices.js";
import ManageServices from "views/services/manageServices.js";
import LoanRequest from "views/lending/loanRequest.js";
import Leads from "views/lending/leads.js";
import LoanInfo from "./views/lending/loanDetails";
import LoanQueue from "./views/lending/loanQueue";
import CustomerQueue from "./views/customers/customerQueue.js";
import LineQueue from "./views/lending/lineQueue";
import ServiceInvoice from "views/services/serviceInvoice.js";
import HouseIcon from "@mui/icons-material/House";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import GroupsIcon from "@mui/icons-material/Groups";
import SettingsIcon from "@mui/icons-material/Settings";
import LibraryBooksRoundedIcon from "@mui/icons-material/LibraryBooksRounded";
import EditService from "./views/services/editServices";
import LoanDocTemplate from "./views/product/loanDocTemplate";
import LoanDocList from "./views/lending/loanDocuments";
import LeadDetails from "./views/lending/leadsDetails";
import LeadEdit from "./views/lending/leadsEdit";
import LoanDemographicsDetails from "./views/lending/loanDemographicsDetails";
import LoanRepaymentSchedule from "./views/lending/repaymentScheduleDemographics";
import LoanTransaction from "./views/loanTransaction/transaction";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import FactCheckSharpIcon from "@mui/icons-material/FactCheckSharp";
import ProductDetails from "./views/product/productDetails.js";
import BroadCastEvent from "./views/pubsub/broadcast_event.js";
import ProductType from "./views/colenders/productType";
import SubscribeEvent from "./views/pubsub/subscribe_event.js";
import TopupDisbursement from "./views/Compositedisbursement/TopupDisbursement";
import DisbursementMaster from "./views/Compositedisbursement/DisbursementMaster";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Reports from "./views/lending/Reports/reports";
import GenerateReport from "./views/lending/Reports/generateReport";
import GenerateCoLendingReport from "./views/colendingReports/Reports/generateCoLendingReport";
import ReportIcon from "@mui/icons-material/Report";
import CollateralForm from "./views/collateral/collateralForm";
import CollateralList from "./views/collateral/CollateralList";
import EmojiTransportationIcon from "@mui/icons-material/EmojiTransportation";
import DisbursementApprove from "./views/Operations/DisbursementApprove";
import BulkUpload from "views/colendingLoans/bulkUpload.js";
import TdsRefund from "views/lending/TdsRefund.js"
import bulkUploadApproval from "./views/colendingLoans/bulkUploadApproval";
import ColendingLoans from "./views/colendingLoans/loans";
import { Disbursement } from "./views/Operations/Disbursement";
import DisbursementRequest from "./views/Operations/disbursementRequest";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CurrencyRupeeSharpIcon from "@mui/icons-material/CurrencyRupeeSharp";
import LOCDrawdown from "./views/lending/LOCDrawdown";
import LOCDrawdownRequestUi from "./views/lending/drawDownRequestUi";
import EnachList from "./views/enach/EnachList";
import RepaymentApproval from "./views/repaymentApproval/RepaymentApproval";
import colenders from "./views/colenders/colenders.js";
import AddColender from "./views/colenders/addColenders";
import EditColenders from "./views/colenders/editColenders";
import InfoColenders from "./views/colenders/infoColenders";
import ProductTokens from "./components/Product/tokens";
import Tokens from "./components/Product/tokens";
import Recon from "./views/recon/Recon";
import ServiceRequest from "./views/ServiceRequest/ServiceRequest";
import ColendingReports from "./views/colendingReports/Reports/reports";
import Statistics from "./views/company/statistics";
import { storedList } from "util/localstorage";
import { AddAccessMetrix } from "./views/roleMetrix/addAccessMetrix";
import CreateRole from "./views/roleMetrix/role";
import { CamsForm } from "./views/lending/CamsForm";
import { AScore } from "./views/lending/AScoreData";
import { SelectorForm } from "./views/lending/SelectorForm";
import DownloadZipFile from "views/colendingReports/Reports/downloadZipFile.js";
import { Collateral } from "./views/collateral/Collateral";
import colendingApproval from "views/colendingLoans/colendingApproval.js";
import ckycBulkUpload from "views/ckycBulkUpload/ckycBulkUpload.js";
import colenderRepayment from "./views/Operations/colenderRepayment.js";
import bankDetails from "./views/Operations/bankDetails.js";
import FeesAndCharges from "./views/lending/chargesDemographic";
import WaiverRequest from "./views/lending/WaiverRequestForm";
import ForeclosureDetails from "./views/ServiceRequest/ForeclosureDetails";
import ForceCloseRequest from "./views/ServiceRequest/ForceCloseRequest";
import ForceCancel from "./views/ServiceRequest/ForceCancel.js";
import ForeclosureRequestDetails from "./views/ServiceRequest/ForeclosureRequestDetails";
import WaiverRequestChecker from "./views/lending/WaiverRequestForm";
import WaiverRequestDetails from "./views/ServiceRequest/WaiverRequestDetails.js";
import AddNewWaiverRequest from "./views/lending/AddNewWaiverRequest.js";
import KycIncompleteScreen from "./views/lending/kycIncomplete.js";
import viewColendingApproval from "./views/colendingLoans/viewColendingApproval.js";
import ForeclosureOfferRequest from "./views/ServiceRequest/ForeclosureOfferRequest.js";
import DownloadCoLendingRepaymentFile from "views/colendingReports/Reports/downloadCoLendingRepaymentFile.js";
import LOCDrawdownRequests from "./views/lending/LocDrawDownRequests.js";
import LOCDrawdownRequestDetails from "./views/lending/LocDrawDownRequestDetails.js";
import settlementRequest from "./views/ServiceRequest/SettlementRequest.js";
import InterestRateScheme from "./views/scheme/InterestRateScheme.js";
import ProductSchemeMapping from "./views/productSchemeMapping/ProductSchemeMapping.js";
import cashCollateralDisbursal from "./views/Operations/cashCollateralDisbursal.js";
import OpBulkUpload from "./views/Operations/OpBulkUpload.js";
import subscription from "views/nach/subscription.js";
import subscriptionDetail from "views/nach/subscriptionDetail.js";
import moneyIcon from "./views/lending/images/money-3.svg";
import ReportRequests from "./views/lending/Reports/reportRequests.js";
import Refund from "./views/lending/Refund.js";
import InterestRefund from "./views/interestRefund/InterestRefund.js"
// collection routes
import FosUsers from "./views/collection/user/user.view";
import CollectionAgency from "./views/collection/agency/agency.view.js";
import CollectionCaseList from "views/collection/case/cases.view.js";
import CaseDetails from "views/collection/case/caseDetails.view.js";
import DashboardView from "views/collection/dashboard/dashboard.view.js";
import TransactionDetails from "./views/nach/TransactionDetails.js";
import Admin from "./views/nach/Admin.js";
import Transactions from "./views/nach/Transactions.js";
import NachBulkUpload from "./views/nach/NachBulkUpload.js";
import NachReportList from "./views/nach/NachReportList.js";
import NachReport from "./views/nach/nachReport.js";
import MsmeRoutes from "./msme/msme.route"
import sidebarIconsSVG from "./SidebarIcons.js"
const user = storedList("user");

const allRoutes = [
  {
    collapse: true,
    name: "Dashboards",
    icon: sidebarIconsSVG?.dashboard,
    iconColor: "Primary",
    state: "dashboardsCollapse",
    type: ["admin", "company", "co-lender"],
    invisible: false,
    tags: ["tag_dashboard_read"],
    views: [
      {
        path: "/dashboard",
        name: "Dashboard",
        miniName: "D",
        component: Dashboard,
        layout: "/admin",
        accessBy: ["admin", "company", "co-lender"],
        tags: ["tag_dashboard_read"],
      },
    ],
  },
  {
    collapse: true,
    name: "User management",
    icon: sidebarIconsSVG?.UserManagement,
    iconColor: "Primary",
    state: "authenticationCollapse",
    type: ["admin"],
    invisible: false,
    tags: [
      "add_role",
      "tag_partner_read_write",
      "tag_user_read",
      "tag_user_read_write",
      "tag_access_matrix_read",
      "tag_access_matrix_read_write",
      "tag_role_matrix_read",
      "tag_role_matrix_read_write",
    ],
    views: [
      {
        path: "/User",
        name: "User",
        miniName: "U",
        component: CreateUser,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["tag_user_read", "tag_user_read_write"],
        invisible: false,
      },
      {
        path: "/access-matrix",
        name: "Access matrix",
        miniName: "AM",
        component: AddAccessMetrix,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["tag_access_matrix_read", "tag_access_matrix_read_write"],
        invisible: false,
      },
      {
        path: "/RoleMatrix",
        name: "Role matrix",
        miniName: "R",
        component: CreateRole,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["tag_role_matrix_read", "tag_role_matrix_read_write"],
        invisible: false,
      },
      {
        path: "/partner_list",
        name: "Partners",
        miniName: "P",
        component: PartnerList,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["tag_partner_read_write"],
        invisible: false,
      },
      {
        path: "/partner",
        name: "Partner",
        miniName: "P",
        component: Onboard,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["tag_partner_read_write"],
        invisible: true,
      },
      {
        path: "/partner_details/:pid",
        name: "Partner Details",
        miniName: "PD",
        component: PartnerDetails,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["tag_partner_read_write"],
        invisible: true,
      },
      {
        path: "/anchor_list",
        name: "Anchors",
        miniName: "AL",
        component: AnchorList,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["tag_partner_read_write"],
        invisible: false,
      },
      {
        path: "/anchor",
        name: "Anchor",
        miniName: "A",
        component: OnboardAnchor,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["tag_partner_read_write"],
        invisible: true,
      },
      {
        path: "/anchor_details/:pid",
        name: "Anchor Details",
        miniName: "AD",
        component: AnchorDetails,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["tag_partner_read_write"],
        invisible: true,
      },
    ],
  },
  {
    collapse: true,
    name: "Settings",
    icon: sidebarIconsSVG?.Settings,
    iconColor: "Primary",
    state: "configuationCollapse",
    type: ["admin"],
    invisible: false,
    tags: [
      "tag_broadcast_event_read_write",
      "tag_broadcast_event_read",
      "tag_subscribe_event_read_write",
      "tag_loan_type_read_write",
      "tag_loan_template_read_write",
      "tag_loan_schema_read",
      "tag_loan_schema_read_write",
      "tag_product_type_read",
      "tag_colenders_read",
      "tag_colenders_read_write",
      "tag_products_read_write",
      "tag_products_read",
      "tokens",
      "tag_settings_interest_scheme_mapping_read_write",
    ],
    views: [
      {
        path: "/broadcast_event_list",
        name: "Broadcast event ",
        miniName: "T",
        component: BroadCastEvent,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["tag_broadcast_event_read_write", "tag_broadcast_event_read"],
      },
      {
        path: "/subscribe_event_list",
        name: "Subscribe event",
        miniName: "T",
        component: SubscribeEvent,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["tag_subscribe_event_read_write"],
      },
      {
        path: "/product_scheme_mapping",
        name: "Product Scheme Mapping",
        miniName: "PM",
        component: ProductSchemeMapping,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["tag_settings_product_scheme_mapping_read_write"],
      },
      {
        path: "/loan_type",
        name: "Template config",
        miniName: "T",
        component: DefaultLoanType,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["tag_loan_type_read_write"],
      },
      {
        path: "/loan_template",
        name: "Loan template upload",
        miniName: "LT",
        component: LoanTemplate,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["tag_loan_template_read_write"],
      },
      {
        path: "/loan_schema",
        name: "Create Loan Schema",
        miniName: "LS",
        component: LoanSchema,
        layout: "/admin",
        invisible: true,
        accessBy: ["admin"],
        tags: ["tag_loan_schema_read_write"],
      },
      {
        path: "/update_default_template",
        name: "Update Default Template",
        miniName: "UDT",
        component: DefaultTemplateUpdate,
        layout: "/admin",
        invisible: true,
        accessBy: ["admin"],
        tags: ["tag_loan_schema_read_write"],
      },
      {
        path: "/list_loan_schema",
        name: "Loan schema",
        miniName: "LS",
        component: ListLoanSchema,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["tag_loan_schema_read", "tag_loan_schema_read_write"],
      },
      {
        path: "/product_type",
        name: "Product Type",
        miniName: "PT",
        component: ProductType,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: false,
        tags: ["tag_product_type_read"],
      },
      {
        path: "/co_lender",
        name: "Colenders",
        miniName: "CL",
        component: colenders,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: false,
        tags: ["tag_colenders_read", "tag_colenders_read_write"],
      },
      {
        path: "/add_colenders",
        name: "Add Colenders",
        miniName: "AC",
        component: AddColender,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: true,
        tags: ["tag_colenders_read_write"],
      },
      {
        path: "/edit_colenders/:id",
        name: "Edit colenders",
        miniName: "EC",
        component: EditColenders,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: true,
        tags: ["tag_colenders_read_write"],
      },
      {
        path: "/info_colenders/:co_lender_id/:co_lender_name/:is_rps_by_co_lender/:co_lender_shortcode/:co_lending_share/:co_lending_mode/:escrow_account_number/:escrow_account_beneficiary_name/:escrow_account_ifsc_code/:escrow_repayment_account_number/:escrow_repayment_account_ifsc_code",
        name: "info colenders",
        miniName: "IC",
        component: InfoColenders,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: true,
        tags: ["tag_colenders_read", "tag_colenders_read_write"],
      },
      {
        path: "/product_list",
        name: "Products",
        miniName: "P",
        component: ProductList,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["tag_products_read_write", "tag_products_read"],
      },
      {
        path: "/tokens",
        name: "Tokens",
        miniName: "T",
        component: Tokens,
        layout: "/admin",
        invisible: true,
        accessBy: ["admin"],
        tags: ["tokens"],
      },
      {
        path: "/edit_product",
        name: "Edit Product",
        miniName: "EP",
        component: EditProduct,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: true,
        tags: ["tag_products_read_write"],
      },
      {
        path: "/product/",
        name: "Create product",
        miniName: "CP",
        component: CreateProduct,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: true,
        tags: ["tag_loan_schema_read_write", "tag_products_read_write"],
      },
      {
        path: "/product_details/:company_id/:loan_schema_id/:product_id",
        name: "Product Details",
        miniName: "PD",
        component: ProductDetails,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: true,
        tags: ["tag_products_read_write", "tag_products_read"],
      },
      {
        path: "/template/loandoc/:company_id/:product_id",
        name: "Loan Document",
        miniName: "LD",
        component: LoanDocTemplate,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: true,
        tags: ["tag_products_read_write"],
      },
      {
        path: "/schemes",
        name: "Interest Rate Scheme",
        miniName: "IS",
        component: InterestRateScheme,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: false,
        tags: ["tag_settings_interest_scheme_mapping_read_write"],
      },
    ],
  },
  {
    collapse: true,
    name: "Services",
    icon: sidebarIconsSVG?.Services,
    iconColor: "Primary",
    state: "serviceCollapse",
    type: ["admin"],
    invisible: false,
    tags: [
      "tag_service_read_write",
      "tag_manage_service_read",
      "tag_manage_service_read_write",
      "tag_service_usage_read",
    ],
    views: [
      {
        path: "/add_service",
        name: "Add services",
        miniName: "AS",
        component: AddServices,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["tag_service_read_write"],
      },
      {
        path: "/manage_service",
        name: "Manage services",
        miniName: "MS",
        component: ManageServices,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["tag_manage_service_read", "tag_manage_service_read_write"],
      },
      {
        path: "/edit_service/:service_id",
        name: "Edit Service",
        miniName: "ES",
        component: EditService,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: true,
        tags: ["tag_manage_service_read", "tag_manage_service_read_write"],
      },
      {
        path: "/service_usage",
        name: "Service usage",
        miniName: "SU",
        component: ServiceInvoice,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["tag_service_usage_read"],
      },
    ],
  },
  {
    collapse: true,
    name: "LOS",
    icon: sidebarIconsSVG?.LOS,
    iconColor: "Primary",
    state: "lendingCollapse",
    invisible: false,
    type: ["admin", "company"],
    tags: [
      "tag_lead_loan_read_write",
      "tag_lead_list_read",
      "tag_lead_list_read_write",
      "tag_loan_info_read",
      "tag_loan_info_read_write",
      "tag_cams_details_read",
      "tag_cams_details_read_write",
      "tag_loan_queue_read",
      "tag_loan_queue_read_write",
      "tag_loan_queue_export",
      "tag_loan_queue_manual_edit_read",
      "tag_loan_queue_manual_edit_read_write",
    ],
    views: [
      {
        path: "/lending/leads/cams/:company_id/:product_id/:loan_app_id",
        name: "Cams",
        miniName: "CP",
        component: CamsForm,
        layout: "/admin",
        accessBy: ["admin", "company", "co-lender"],
        invisible: true,
        tags: [
          "tag_cams_details_read",
          "tag_cams_details_read_write",
          "tag_lead_list_read_write",
        ],
      },
      //
      {
        path: "/lending/leads/ascore/:company_id/:product_id/:loan_app_id",
        name: "Cams",
        miniName: "CP",
        component: AScore,
        layout: "/admin",
        accessBy: ["admin", "company", "co-lender"],
        invisible: true,
        tags: [
          "tag_leads_ascore_read",
          "tag_leads_ascore_read_write",
          "tag_lead_list_read_write",
        ],
      },
      //
      {
        path: "/lending/leads/selector/:company_id/:product_id/:loan_app_id",
        name: "Selector",
        miniName: "CP",
        component: SelectorForm,
        layout: "/admin",
        accessBy: ["admin", "company", "co-lender"],
        invisible: true,
        tags: [
          "tag_selector_details_read",
          "tag_selector_details_read_write",
          "tag_lead_list_read_write",
        ],
      },
      {
        path: "/lending/lead",
        name: "Book loan",
        miniName: "N",
        component: LoanRequest,
        layout: "/admin",
        accessBy: ["admin", "company"],
        tags: ["tag_lead_loan_read_write"],
      },
      {
        path: "/lending/leads",
        name: "Lead",
        miniName: "L",
        component: Leads,
        layout: "/admin",
        accessBy: ["admin", "company"],
        tags: ["tag_lead_list_read", "tag_lead_list_read_write"],
      },
      {
        path: "/lending/loan_queue",
        name: "Loans",
        miniName: "L",
        component: LoanQueue,
        layout: "/admin",
        accessBy: ["admin", "company"],
        tags: [
          "tag_loan_queue_read",
          "tag_loan_queue_read_write",
          "tag_loan_queue_export",
        ],
      },
      {
        path: "/lending/line_queue",
        name: "Line",
        miniName: "L",
        component: LineQueue,
        layout: "/admin",
        accessBy: ["admin", "company"],
        tags: [
          "tag_loan_queue_read",
          "tag_loan_queue_read_write",
          "tag_loan_queue_export",
        ],
      },
      {
        path: "/lending/loan-recon-details/:company_id/:product_id/:loan_id",
        name: "Loan Recon",
        miniName: "LR",
        component: Recon,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: true,
        tags: ["tag_loan_recon_details_read", "tag_loan_queue_read_write"],
      },
      {
        path: "/foreclosure-request/:company_id/:product_id/:loan_id",
        name: "Foreclosure details",
        miniName: "FD",
        component: ForeclosureDetails,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: true,
        tags: ["tag_foreclosure_read_write"],
      },
      {
        path: "/force-close/:company_id/:product_id/:loan_id",
        name: "Force Close",
        miniName: "FC",
        component: ForceCloseRequest,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: true,
        tags: ["tag_loan_queue_force_closure_read", "tag_loan_queue_force_closure_write"],
      },
      {
        path: "/force-cancellation/:company_id/:product_id/:loan_id",
        name: "Force Cancel",
        miniName: "FCR",
        component: ForceCancel,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: true,
        tags: ["tag_loan_queue_force_cancel_r", "tag_loan_queue_force_cancel_w"],
      },
      {
        path: "/settlement-request/:loan_id/:company_id/:product_id",
        name: "Settlement Request",
        miniName: "SR",
        component: settlementRequest,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: true,
        tags: [
          "tag_loan_queue_settlement_read",
          "tag_loan_queue_settlement_read_write",
        ],
      },
      {
        path: "/foreclosure-offers-requests/:loan_id/:company_id/:product_id",
        name: "Foreclosure offers requests",
        miniName: "FOR",
        component: ForeclosureOfferRequest,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: true,
        tags: [
          "tag_foreclosure_read_write",
          "tag_service_request_foreclosure_read_write",
          "tag_service_request_foreclosure_read",
        ],
      },
      {
        path: "/loan/waiver_request/:company_id/:product_id/:loan_id",
        name: "Waiver request",
        miniName: "WR",

        component: WaiverRequest,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: true,
        tags: ["tag_loan_queue_read_write", "tag_loan_queue_request_waiver"],
      },
    ],
  },
  {
    collapse: true,
    name: "MSME",
    icon: sidebarIconsSVG?.LOS,
    iconColor: "Primary",
    state: "MsmeCollapse",
    type: ["admin","company"],
    invisible: false,
    tags: [
      "tag_msme_read",
      "tag_msme_write",
    ],
    views: MsmeRoutes
  },
  {
    collapse: true,
    name: "Reports",
    icon: sidebarIconsSVG?.Report,
    iconColor: "Primary",
    state: "",
    invisible: false,
    type: ["admin", "company"],
    tags: ["tag_reports_read", "tag_reports_read_write"],
    views: [
      {
        path: "/lending/reports",
        name: "Reports",
        miniName: "R",
        component: Reports,
        layout: "/admin",
        accessBy: ["admin", "company"],
        tags: ["tag_reports_read", "tag_reports_read_write"],
      },
    ],
  },
  {
    collapse: true,
    invisible: true,
    name: "Additional Component",
    icon: LibraryBooksRoundedIcon,
    iconColor: "Primary",
    state: "additionalCollapse",
    type: ["admin", "company"],
    tags: [
      "tag_transaction_ledger_read",
      "tag_lead_loan_read_write",
      "loan_doc_template",
      "loan_doc_list",
      "tag_upload_repayment_schedule_read_write",
      "generate_report",
      "tag_collateral_read_write",
      "tag_documents_read",
      "tag_documents_read_write",
      "tag_loan_details_read",
      "tag_loan_details_read_write",
      "tag_reports_read_write",
      "tag_reports_read",
      "tag_loan_queue_read_write",
    ],
    views: [
      {
        path: "/lending/loan/drawdown_ledger/:company_id/:product_id/:loan_id",
        name: "Drawdown ledger",
        miniName: "DL",
        component: LOCDrawdown,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: true,
        tags: ["tag_transaction_ledger_read", "tag_loan_queue_read_write"],
      },
      {
        path: "/lending/loan/loc_drawdown_request/:company_id/:product_id/:loan_id/:request_id/:loan_app_id/:status/:line_pf",
        name: "Drawdown Requests",
        miniName: "DRD",
        component: LOCDrawdownRequestDetails,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: true,
        tags: ["tag_drawdown_request_read", "tag_drawdown_request_read_write"],
      },
      {
        path: "/lending/loan/drawdown_request/:company_id/:product_id/:loan_id",
        name: "Drawdown Request",
        miniName: "DR",
        component: LOCDrawdownRequestUi,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: true,
        tags: ["tag_drawdown_request_read", "tag_drawdown_request_read_write"],
      },
      {
        path: "/lending/loan/loc_drawdown_request/:company_id/:product_id/:loan_id",
        name: "Drawdown Requests",
        miniName: "DRs",
        component: LOCDrawdownRequests,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: true,
        tags: ["tag_drawdown_request_read", "tag_drawdown_request_read_write"],
      },
      {
        path: "/loan/refund/:company_id/:product_id/:loan_id",
        name: "Refund",
        miniName: "RF",
        component: Refund,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: true,
        tags: ["tag_refund_request_read", "tag_refund_request_read_write", "tag_loan_queue_read_write"],
      },
      {
        path: "/lending/additionalinfo/:company_id/:product_id/:loan_id",
        name: "Loan Info",
        miniName: "AI",
        component: LoanInfo,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: true,
        tags: [
          "tag_lead_loan_read_write",
          "tag_lead_list_read_write",
          "tag_loan_info_read",
          "tag_loan_info_read_write",
          "tag_lead_list_read",
        ],
      },
      {
        path: "/loan/details/:lms_version/:loan_id/:product_id/:company_id/:loan_app_id/:co_lender_shortcode",
        name: "Loan Demographic Details",
        miniName: "LDD",
        component: LoanDemographicsDetails,
        layout: "/admin",
        accessBy: ["admin", "company", "co-lender"],
        invisible: true,
        tags: [
          "tag_collateral_read_write",
          "tag_loan_details_read",
          "tag_loan_details_read_write",
          "tag_loan_queue_read_write",
        ],
      },
      {
        path: "/template/loandoclist/:company_id/:product_id/:loan_app_id",
        name: "Loan Document List",
        miniName: "LDL",
        component: LoanDocList,
        layout: "/admin",
        accessBy: ["admin", "company", "co-lender"],
        invisible: true,
        tags: [
          "loan_doc_list",
          "tag_collateral_read_write",
          "tag_documents_read_write",
          "tag_documents_read",
          "tag_lead_list_read_write",
          "tag_lead_details_read",
          "tag_lead_details_read_write",
          "tag_loan_documents_read_write",
          "tag_loan_documents_read",
          "tag_loan_queue_read_write",
        ],
      },
      {
        path: "/lead/details/:loan_app_id/:company_id/:product_id/:loan_schema_id",
        name: "Lead details",
        miniName: "LD",
        component: LeadDetails,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: true,
        tags: [
          "tag_lead_details_read",
          "tag_lead_details_read_write",
          "tag_lead_list_read",
          "tag_lead_list_read_write",
        ],
      },
      {
        path: "/lead/edit/:loan_app_id/:company_id/:product_id/:loan_schema_id",
        name: "Lead edit",
        miniName: "LE",
        component: LeadEdit,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: true,
        tags: ["tag_lead_list_read_write", "tag_lead_edit_read_write"],
      },
      {
        path: "/loan/repaymentSchedule",
        name: "Loan Repayment Schedule",
        miniName: "LRS",
        component: LoanRepaymentSchedule,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: true,
        tags: [
          "tag_upload_repayment_schedule_read_write",
          "tag_loan_queue_read_write",
        ],
      },
      {
        path: "/loan/charges/:company_id/:product_id/:loan_id",
        name: "Fees And Charges",
        miniName: "FAS",
        component: FeesAndCharges,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: false,
        tags: ["tag_fees_charges_history_read"],
      },
      {
        path: "/lending/generate-reports",
        name: "Generate reports",
        miniName: "R",
        component: GenerateReport,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: true,
        tags: ["tag_reports_read_write", "tag_reports_read"],
      },

      {
        path: "/lending/report-requests",
        name: "Report requests",
        miniName: "RR",
        component: ReportRequests,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: true,
        tags: ["tag_reports_read_write", "tag_reports_read"],
      },
      {
        path: "/collateral_edit/:id",
        name: "Collateral edit",
        miniName: "CE",
        component: CollateralForm,
        layout: "/admin",
        accessBy: ["admin", "company"],
        tags: ["tag_collateral_read_write"],
      },
    ],
  },
  {
    collapse: true,
    name: "Loan Transactions",
    icon: MoneyOffIcon,
    iconColor: "Primary",
    state: "",
    type: ["admin"],
    invisible: true,
    tags: ["loan_transactions"],
    views: [
      {
        path: "/loan/transaction",
        name: "Transaction",
        miniName: "N",
        component: LoanTransaction,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["loan_transactions"],
      },
    ],
  },
  {
    collapse: true,
    name: "Composite disbursement",
    icon: sidebarIconsSVG?.Disbursement,
    iconColor: "Primary",
    state: "compositeCollapse",
    type: ["admin"],
    invisible: false,
    tags: [
      "tag_disbursement_channel_master_read",
      "tag_disbursement_channel_master_read_write",
      "tag_disbursement_channel_config_read_write",
      "tag_disbursement_channel_list_read",
      "tag_disbursement_channel_list_read_write",
      "tag_topup_disbursement_channel_read_write",
    ],
    views: [
      {
        path: "/disbursement/channels/master",
        name: "Channel master",
        miniName: "DM",
        component: DisbursementMaster,
        layout: "/admin",
        accessBy: ["admin"],
        tags: [
          "tag_disbursement_channel_master_read",
          "tag_disbursement_channel_master_read_write",
        ],
      },
      {
        path: "/disbursement_channel_config",
        name: "Channel config",
        miniName: "DC",
        component: DisbursementChannel,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["tag_disbursement_channel_config_read_write"],
      },
      {
        path: "/disbursement_channel_list",
        name: "Channel config list",
        miniName: "DCL",
        component: DisbursementChannelList,
        layout: "/admin",
        accessBy: ["admin"],
        tags: [
          "tag_disbursement_channel_list_read",
          "tag_disbursement_channel_list_read_write",
        ],
      },
      {
        path: "/topup/disbursement/channels",
        name: "Topup channel",
        miniName: "TD",
        component: TopupDisbursement,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["tag_topup_disbursement_channel_read_write"],
      },
    ],
  },
  {
    collapse: true,
    name: "Collateral",
    icon: sidebarIconsSVG?.collateral,
    iconColor: "Primary",
    state: "collateralCollapse",
    type: ["admin", "company"],
    invisible: false,
    tags: [
      "tag_collateral_read",
      "tag_collateral_read_write",
      "tag_collateral_export",
    ],
    views: [
      {
        path: "/collateral/list",
        name: "Auto",
        miniName: "CL",
        component: CollateralList,
        layout: "/admin",
        accessBy: ["admin", "company"],
        tags: ["tag_collateral_read", "tag_collateral_read_write"],
      },
      {
        path: "/collateral/:company_id/:product_id",
        name: "Auto",
        miniName: "C",
        component: Collateral,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: true,
        tags: ["tag_collateral_read_write"],
      },
    ],
  },
  {
    collapse: true,
    name: "Company",
    icon: EmojiTransportationIcon,
    iconColor: "Primary",
    state: "companyCollapse",
    type: ["admin"],
    invisible: true,
    tags: ["company_statistics"],
    views: [
      {
        path: "/companies/stats",
        name: "Company Statistics",
        miniName: "CS",
        component: Statistics,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["company_statistics"],
      },
    ],
  },
  {
    collapse: true,
    name: "Refund",
    icon: sidebarIconsSVG?.tdsrefund,
    iconColor: "Primary",
    state: "RefundCollapse",
    type: ["admin", "company"],
    invisible: false,
    tags: [
      "tag_tds_refund_r",
      "tag_tds_refund_w",
      "tag_refunds_int_refund_r",
      "tag_refunds_int_refund_w",
    ],
    views: [
      {
        path: "/Refund",
        name: "TDS Refund",
        miniName: "CL",
        component: TdsRefund,
        layout: "/admin",
        accessBy: ["admin", "company"],
        tags: ["tag_tds_refund_r", "tag_tds_refund_w"],
      },
      {
        path: "/Refund/api",
        name: "Auto",
        miniName: "C",
        // component: Collateral,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: true,
        //  tags: ["tag_collateral_read_write"],
      },
      {
        path: "/interest-refund",
        name: "Interest Refund",
        miniName: "IR",
        component: InterestRefund,
        layout: "/admin",
        accessBy: ["admin", "company"],
        tags: ["tag_refunds_int_refund_r","tag_refunds_int_refund_w"],
      },
    ],
  },
  {
    collapse: true,
    name: "Operations",
    icon: sidebarIconsSVG?.Operations,
    iconColor: "Primary",
    state: "OperationsCollapse",
    type: ["admin"],
    invisible: false,
    tags: [
      "tag_disbursement_approval_read_write",
      "tag_disbursement_approval_read",
      "tag_disbursement_read",
      "tag_disbursement_read_write",
      "tag_enach_presentation_read",
      "tag_enach_presentation_read_write",
      "tag_repayment_approval_read_write",
      "tag_repayment_approval_read",
      "tag_service_requests_read",
      "tag_service_requests_read_write",
      "tag_upload_read",
      "tag_upload_read_write",
      "tag_foreclosure_read_write",
    ],
    views: [
      {
        path: "/disbursement/approve",
        name: "Disbursement approval",
        miniName: "DA",
        component: DisbursementApprove,
        layout: "/admin",
        accessBy: ["admin"],
        tags: [
          "tag_disbursement_approval_read_write",
          "tag_disbursement_approval_read",
        ],
      },
      {
        path: "/disbursement-requests",
        name: "Disbursement",
        miniName: "D",
        component: DisbursementRequest,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["tag_disbursement_read", "tag_disbursement_read_write"],
      },
      {
        path: "/enach",
        name: "eNACH presentation ",
        miniName: "EP",
        component: EnachList,
        layout: "/admin",
        accessBy: ["admin"],
        tags: [
          "tag_enach_presentation_read_write",
          "tag_enach_presentation_read",
        ],
      },
      {
        path: "/repayment-approval",
        name: "Repayment approval ",
        miniName: "RA",
        component: RepaymentApproval,
        layout: "/admin",
        accessBy: ["admin"],
        tags: [
          "tag_repayment_approval_read_write",
          "tag_repayment_approval_read",
        ],
      },
      {
        path: "/service-request",
        name: "Service request ",
        miniName: "SR",
        component: ServiceRequest,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["tag_service_requests_read"],
      },
      {
        path: "/waiver-request-checker/:company_id/:product_id/:loan_id",
        name: "Waiver request checker ",
        miniName: "WRC",
        component: WaiverRequestChecker,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: true,
        tags: ["tag_service_requests_read", "tag_service_requests_read_write"],
      },
      {
        path: "/ckyc-bulk-upload",
        name: "Ckyc Bulk Upload ",
        miniName: "CU",
        component: ckycBulkUpload,
        layout: "/admin",
        accessBy: ["admin"],
        tags: ["tag_upload_read", "tag_upload_read_write"],
      },
      {
        path: "/colender-repayment",
        name: "Co-Lender Repayment",
        miniName: "CLR",
        component: colenderRepayment,
        layout: "/admin",
        accessBy: ["admin"],
        tags: [
          "tag_colender_repayment_read",
          "tag_colender_repayment_read_write",
        ],
      },
      {
        path: "/waiver-request-details/:company_id/:product_id/:loan_id/:request_id",
        name: "Waiver request details",
        miniName: "WR",
        component: WaiverRequestDetails,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: true,
        tags: ["tag_service_requests_read", "tag_service_requests_read_write"],
      },
      {
        path: "/waiver-request-list/:company_id/:product_id/:loan_id",
        name: "Waiver request list ",
        miniName: "WRL",
        component: AddNewWaiverRequest,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: true,
        tags: [
          "tag_loan_queue_request_waiver_read",
          "tag_loan_queue_request_waiver_read_write",
        ],
      },
      {
        path: "/foreclosure-request-details/:company_id/:product_id/:loan_id/:request_id",
        name: "Foreclosure request details",
        miniName: "FD",
        component: ForeclosureRequestDetails,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: true,
        tags: [
          "tag_service_request_foreclosure_read_write",
          "tag_service_request_foreclosure_read",
        ],
      },
      {
        path: "/bank-details",
        name: "Bank Details",
        miniName: "BD",
        component: bankDetails,
        layout: "/admin",
        accessBy: ["admin"],
        tags: [
          "tag_master_bank_details_read",
          "tag_master_bank_details_read_write",
        ],
      },
      {
        path: "/cash-collateral-disbursal",
        name: "Cash Collateral Disbursal",
        miniName: "CD",
        component: cashCollateralDisbursal,
        layout: "/admin",
        accessBy: ["admin"],
        tags: [
          "tag_cash_collateral_disbursement_read",
          "tag_cash_collateral_disbursement_read_write",
        ],
      },
      {
        path: "/bulk-upload",
        name: "Bulk Upload",
        miniName: "BU",
        component: OpBulkUpload,
        layout: "/admin",
        accessBy: ["admin"],
        tags: [
          "tag_operations_bulk_upload_read",
          "tag_operations_bulk_upload_read_write",
        ],
      },
    ],
  },
  {
    collapse: true,
    name: "Co-Lending",
    icon: sidebarIconsSVG?.colending,
    iconColor: "Primary",
    state: "CoLendingCollapse",
    type: ["admin", "co-lender"],
    invisible: false,
    tags: [
      "tag_colending_loans_read",
      "tag_colending_loans_export",
      "tag_colending_bulk_upload_read",
      "tag_colending_bulk_upload_read_write",
      "tag_colending_reports_read",
      "tag_colending_reports_read_write",
      "tag_colend_cases_read",
      "tag_loan_details_btn_colend_action",
    ],
    views: [
      {
        path: "/co_lending/loans",
        name: "Loans",
        miniName: "L",
        component: ColendingLoans,
        layout: "/admin",
        accessBy: ["admin", "co-lender"],
        invisible: false,
        tags: ["tag_colending_loans_read", "tag_colending_loans_export"],
      },
      {
        path: "/co_lending/bulk_upload",
        name: "Bulk Upload",
        miniName: "BU",
        component: BulkUpload,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: user?.type === "co-lender" ? true : false,
        tags: [
          "tag_colending_bulk_upload_read",
          "tag_colending_bulk_upload_read_write",
        ],
      },
      {
        path: "/co_lending/file_upload_approval",
        name: "File Upload Approval",
        miniName: "FUA",
        component: bulkUploadApproval,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: user?.type === "co-lender" ? true : false,
        tags: ["tag_checker_read", "tag_checker_read_write"],
      },
      {
        path: "/co_lending/reports",
        name: "Co-Lender Reports",
        miniName: "CR",
        component: ColendingReports,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: user?.type === "co-lender" ? true : false,
        tags: [
          "tag_colending_reports_read",
          "tag_colending_reports_read_write",
        ],
      },
      {
        path: "/colending/download_zip_file",
        name: "Zip File Download",
        miniName: "ZD",
        component: DownloadZipFile,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: true,
        tags: ["tag_colend_casedump_report_read_write"],
      },
      {
        path: "/co_lending/generate_reports",
        name: "Generate reports",
        miniName: "R",
        component: GenerateCoLendingReport,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: true,
        tags: [
          "tag_colending_reports_read",
          "tag_colending_reports_read_write",
        ],
      },
      {
        path: "/co_lending/co_lender_cases",
        name: "Co-lender Cases",
        miniName: "CC",
        component: colendingApproval,
        layout: "/admin",
        accessBy: ["admin", "co-lender"],
        invisible: false,
        tags: ["tag_colend_cases_read", "tag_loan_details_btn_colend_action"],
      },
      {
        path: "/co_lending/download_repayment_file",
        name: "CoLending Repayment File Download",
        miniName: "CRFD",
        component: DownloadCoLendingRepaymentFile,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: true,
        tags: ["tag_co_lending_repayment_file_read_write"],
      },
      {
        path: "/co_lending/view_co_lender_cases/:loan_id/:product/:loan_schema_id/:company_id/:product_id/:loan_app_id/pdf",
        name: "View Co-lender Cases",
        miniName: "CC",
        component: viewColendingApproval,
        layout: "/admin",
        accessBy: ["admin", "co-lender"],
        invisible: true,
        tags: ["tag_colend_cases_read", "tag_loan_details_btn_colend_action"],
      },
    ],
  },
  {
    collapse: true,
    name: "Collection",
    icon: sidebarIconsSVG?.CollectionIcon,
    iconColor: "Primary",
    state: "CollectionCollapse",
    type: ["admin", "company"],
    invisible: false,
    tags: ["tag_collection"],
    views: [
      {
        path: "/collection/dashboard",
        name: "Dashboard",
        miniName: "D",
        component: DashboardView,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: false,
        tags: ["tag_collection"],
      },
      {
        path: "/collection/User Management",
        name: "User Management",
        miniName: "UM",
        component: FosUsers,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: false,
        tags: ["tag_collection"],
      },
      {
        path: "/collection/cases/Borrower_Info",
        name: "Collection Case Details",
        miniName: "CC",
        component: CaseDetails,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: true,
        tags: ["tag_collection"],
      },
      {
        path: "/collection/cases",
        name: "Collection Cases",
        miniName: "CS",
        component: CollectionCaseList,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: false,
        tags: ["tag_collection"],
      },
      {
        path: "/collection/Agency Management",
        name: "Agency Management",
        miniName: "AM",
        component: CollectionAgency,
        layout: "/admin",
        accessBy: ["admin"],
        invisible: false,
        tags: ["tag_collection"],
      },
    ],
  },

  {
    collapse: true,
    name: "NACH Portal",
    icon: sidebarIconsSVG?.NachPortal,
    iconColor: "Primary",
    state: "NACHPortalCollapse",
    type: ["admin", "company"],
    invisible: false,
    tags: [
      "tag_nach_portal_admin_read_write",
      "tag_nach_portal_subscriptions_r",
      "tag_nach_portal_subscriptions_rw",
      "tag_nach_portal_transactions_all_transactions_r",
      "tag_nach_portal_transactions_all_transactions_rw",
      "tag_nach_portal_bulk_upload_r",
      "tag_nach_portal_bulk_upload_w",
      "tag_nach_reports_r",
      "tag_nach_reports_bank_migration_r",
    ],
    views: [
      {
        path: "/NACH-Admin/Admin",
        name: "Admin",
        miniName: "NA",
        component: Admin,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: false,
        tags: [
          "tag_nach_portal_admin_read_write",
        ],
      },
      {
        path: "/registration",
        name: "Registration",
        miniName: "SC",
        component: subscription,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: false,
        tags: [
          "tag_nach_portal_subscriptions_r",
          "tag_nach_portal_subscriptions_rw",
        ],
      },
      {
        path: "/registration-details/:request_id",
        name: "Registration Details",
        miniName: "SC",
        component: subscriptionDetail,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: true,
        tags: [
          "tag_nach_portal_subscriptions_r",
          "tag_nach_portal_subscriptions_rw",
        ],
      },
      {
        path: "/Transactions",
        name: "Transactions",
        miniName: "T",
        component: Transactions,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: false,
        tags: [
          "tag_nach_portal_transactions_all_transactions_r",
          "tag_nach_portal_transactions_all_transactions_rw",
        ],
      },
      {
        path: "/transactions-details/:transaction_id",
        name: "transactions-details",
        miniName: "TD",
        component: TransactionDetails,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: true,
        tags: [
          "tag_nach_portal_transactions_all_transactions_r",
          "tag_nach_portal_transactions_all_transactions_rw",
        ],
      },
      {
        path: "/nach-bulk-upload",
        name: "Bulk Upload",
        miniName: "NBU",
        component: NachBulkUpload,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: false,
        tags: [
          "tag_nach_portal_bulk_upload_r",
          "tag_nach_portal_bulk_upload_w",
          "tag_nach_portal_bulk_upload_transaction_confirmation_w",
          "tag_nach_portal_bulk_upload_bank_mandate_acknowledgement_w"
        ],
      },
      {
        path: "/nach-report-list",
        name: "Reports",
        miniName: "NRL",
        component: NachReportList,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: false,
        tags: [
          "tag_nach_reports_r",
        ],
      },
      {
        path: "/nach-report/:report_type",
        name: "NachReports",
        miniName: "NR",
        component: NachReport,
        layout: "/admin",
        accessBy: ["admin", "company"],
        invisible: true,
        tags: [
          "tag_nach_reports_bank_migration_r",
        ],
      },
    ],
  },
  {
    collapse: true,
    name: "Customers",
    icon: sidebarIconsSVG?.customer,
    iconColor: "Primary",
    state: "",
    invisible: false,
    type: ["admin", "company"],
    tags: ["tag_customers_read"],
    views: [
      {
        path: "/customers",
        name: "Customers",
        miniName: "CU",
        component: CustomerQueue,
        layout: "/admin",
        accessBy: ["admin", "company"],
        tags: ["tag_customers_read"],
      },
    ],
  },
  {
    collapse: true,
    name: "Customers Profile",
    icon: GroupsIcon,
    iconColor: "Primary",
    state: "",
    invisible: true,
    type: ["admin", "company"],
    tags: ["tag_customers_read"],
    views: [
      {
        path: "/customer/customerProfile/:customer_id",
        name: "Customer Profile",
        miniName: "CP",
        component: CustomerProfile,
        layout: "/admin",
        accessBy: ["admin", "company"],
        tags: ["tag_customers_read"],
      },
    ],
  },
];

const envRoutes = () => {
  let temp = [];
  let envVar = parseInt(process.env.REACT_APP_ONLY_REPORT_URL);
  if (envVar === 1) {
    allRoutes.forEach((route) => {
      if (route.name === "Reports") {
        route.invisible = false;
      } else {
        route.invisible = true;
      }
      temp.push(route);
    });
  } else if (envVar === 0) {
    allRoutes.forEach((route) => {
      if (route.name === "Reports") {
        route.invisible = true;
      }
      temp.push(route);
    });
  } else if (envVar !== 0 && envVar !== 1) {
    temp = allRoutes;
  }

  return temp;
};

var routes = envRoutes();
export default routes;
