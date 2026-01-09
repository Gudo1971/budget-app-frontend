import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Tooltip,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { JSX } from "react";

type GearAction = {
  label: string;
  onClick: () => void;
  icon?: JSX.Element; // correcte typing
  tooltip?: string;
  isDanger?: boolean;
};

type Props = {
  actions: GearAction[];
};

export function GearMenu({ actions }: Props) {
  return (
    <Menu>
      <Tooltip label="Instellingen">
        <MenuButton
          as={IconButton}
          icon={<SettingsIcon />}
          aria-label="Instellingen"
          variant="ghost"
        />
      </Tooltip>

      <MenuList>
        {actions.map((action, i) => (
          <div key={i}>
            {i > 0 && <MenuDivider />}
            <MenuItem
              icon={action.icon}
              onClick={action.onClick}
              color={action.isDanger ? "red.500" : undefined}
            >
              {action.label}
            </MenuItem>
          </div>
        ))}
      </MenuList>
    </Menu>
  );
}
