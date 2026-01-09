import { extendTheme, type StyleFunctionProps } from "@chakra-ui/react";
import config from "./config";
import { colors } from "./colors";

// component overrides
import { SelectStyles } from "./components/Select";
import { LinkStyles } from "./components/Link";
import { HeadingStyles } from "./components/Heading";
import { ButtonStyles } from "./components/Button";
import { InputStyles } from "./components/Input";
import { CardStyles } from "./components/Card";
import { BadgeStyles } from "./components/Badge";
import { TooltipStyles } from "./components/Tooltip";
import { DividerStyles } from "./components/Divider";

const theme = extendTheme({
  config,

  colors: {
    brand: colors.brand,
    categories: colors.categories,
    light: colors.light,
    dark: colors.dark,
  },

  components: {
    Select: SelectStyles,
    Link: LinkStyles,
    Heading: HeadingStyles,
    Button: ButtonStyles,
    Input: InputStyles,
    Card: CardStyles,
    Badge: BadgeStyles,
    Tooltip: TooltipStyles,
    Divider: DividerStyles,
  },

  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg:
          props.colorMode === "light"
            ? colors.light.surfaceAlt
            : colors.dark.surfaceAlt,
        color:
          props.colorMode === "light" ? colors.light.text : colors.dark.text,
      },
    }),
  },
});

export default theme;
