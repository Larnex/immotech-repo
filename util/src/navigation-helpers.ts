import { NavigationState, PartialState, Route } from '@react-navigation/native';

interface RouteParams {
  parentId?: any;
  [key: string]: any;
}

interface CustomRoute extends Route<string, RouteParams> {
  state?: NavigationState | PartialState<NavigationState>;
}

export function getCurrentScreenName(
  navState: NavigationState | PartialState<NavigationState>,
): { name: string; parentId: any } | null {
  if (!navState) return null;

  const route = navState.routes[navState.index!] as CustomRoute;
  const nestedState = route.state;
  if (nestedState) {
    return getCurrentScreenName(nestedState);
  }
  return { name: route.name, parentId: route.params?.parentId };
}
