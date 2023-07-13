export interface IMAGESTypes {
  [key: string]: any;
}

const IMAGES: IMAGESTypes = {
  unit: require('../../assets/icons/unit.png') as string,
  todo: require('../../assets/icons/todo.png') as string,
  map: require('../../assets/icons/map.png') as string,
  maintenance: require('../../assets/icons/maintenance.png') as string,
  maintenanceNavbar: require('../../assets/icons/tool.png') as string,
  todoNavbar: require('../../assets/icons/to-do-list.png') as string,
  unitListIcon: require('../../assets/icons/blueprint.png') as string,
  images: require('../../assets/icons/images.png') as string,
  'units-list': require('../../assets/icons/swipe-list/units.png') as string,
  'maintenance-list': require('../../assets/icons/swipe-list/maintenance.png') as string,
  'todos-list': require('../../assets/icons/swipe-list/report.png') as string,
  'check-list': require('../../assets/icons/swipe-list/check-list.png') as string,
  overview: require('../../assets/icons/header-list/overview.png') as string,
  '3d-model': require('../../assets/icons/header-list/3d-model.png') as string,
  info: require('../../assets/icons/info.png') as string,
};

export default IMAGES;
