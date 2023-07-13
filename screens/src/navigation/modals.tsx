import { ById } from "@immotech/util";
import { ScanLoginModal } from "../code-scanner/scan-login-modal";
import { CreateEntryModal } from "./create-entry-modal";
import { DamageReportModal } from "../damage-report/damage-report-modal";
import { AddEntityModal } from "../entities/add-entity-modal";
import { EditEntityModal } from "../entities/edit-entity-modal";
import { FiltersModal } from "../filters/filters-modal";
import { AddMaintenanceModal } from "../maintenance/add-maintenance-modal";
import { EditMaintenanceModal } from "../maintenance/edit-maintenance-modal";
import { MarkerDetailsModal } from "../marker-details/marker-details-modal";
import { AddPropertyModal } from "../properties/add-property-modal";
import { EditPropertyModal } from "../properties/edit-property-modal";
import { SearchResultModal } from "../search-result/search-result-modal";
import { SearchModal } from "../search/search-modal";
import { SortModal } from "../sort/sort-modal";
import { EditToDoModal } from "../todos/edit-todo-modal";
import { AddUnitModal } from "../unit/add-unit-modal";
import { EditUnitModal } from "../unit/edit-unit-modal";
import { ChooseTypeModal } from "../choose-type/choose-type-modal";

export enum Modals {
  ScanLogin = "SCAN_LOGIN",
  // CreateEntry = "CREATE_ENTRY",
  AddEntity = "ADD_ENTITY",
  EditEntity = "EDIT_ENTITY",
  AddProperty = "ADD_PROPERTY",
  EditProperty = "EDIT_PROPERTY",
  AddUnit = "ADD_UNIT",
  EditUnit = "EDIT_UNIT",
  DamageReport = "DAMAGE_REPORT",
  EditDamageReport = "EDIT_DAMAGE_REPORT",
  Search = "SEARCH",
  Filters = "FILTERS",
  AddMaintenance = "ADD_MAINTENANCE",
  EditMaintenance = "EDIT_MAINTENANCE",
  Sort = "SORT",
  SearchResult = "SEARCH_RESULT",
  MarkerDetails = "MARKER_DETAILS",
  ChooseType = "CHOOSE_TYPE"
}

export type ModalParamList = {
  [Modals.ScanLogin]: undefined;
  // [Modals.CreateEntry]: { currentScreen: undefined },

};

type ModalConfigType = {
  screen: (props?: any) => JSX.Element;
  path?: string;
  animated?: boolean;
};

export const modals: ById<ModalConfigType> = {
  // [Modals.CreateEntry]: { screen: CreateEntryModal },
  [Modals.ScanLogin]: { screen: ScanLoginModal },
  [Modals.AddEntity]: { screen: AddEntityModal },
  [Modals.EditEntity]: { screen: EditEntityModal },
  [Modals.AddProperty]: { screen: AddPropertyModal },
  [Modals.EditProperty]: { screen: EditPropertyModal },
  [Modals.AddUnit]: { screen: AddUnitModal },
  [Modals.EditUnit]: { screen: EditUnitModal },
  [Modals.DamageReport]: { screen: DamageReportModal },
  [Modals.EditDamageReport]: { screen: EditToDoModal },
  [Modals.Search]: { screen: SearchModal },
  [Modals.Filters]: { screen: FiltersModal },
  [Modals.AddMaintenance]: { screen: AddMaintenanceModal },
  [Modals.EditMaintenance]: { screen: EditMaintenanceModal },
  [Modals.Sort]: { screen: SortModal },
  [Modals.SearchResult]: { screen: SearchResultModal },
  [Modals.MarkerDetails]: { screen: MarkerDetailsModal },
  [Modals.ChooseType]: { screen: ChooseTypeModal }
};
