import PanelMacros, {
  PANEL_PROPS as propsMacros,
} from '@/components/PanelMacros';
import PanelMultis, {
  PANEL_PROPS as propsMultis,
} from '@/components/PanelMultis';
import PanelOldMacro, {
  PANEL_PROPS as propsOldMacro,
} from '@/components/PanelOldMacro';
import PanelBlank, { PANEL_PROPS as propsBlank } from '@/components/PanelBlank';

const PANELS = {};
PANELS[propsMacros.id] = { component: PanelMacros, props: propsMacros };
PANELS[propsMultis.id] = { component: PanelMultis, props: propsMultis };
PANELS[propsOldMacro.id] = { component: PanelOldMacro, props: propsOldMacro };
PANELS[propsBlank.id] = { component: PanelBlank, props: propsBlank };

const panelLookup = (id) => PANELS[id];

export default PANELS;
export { panelLookup };
