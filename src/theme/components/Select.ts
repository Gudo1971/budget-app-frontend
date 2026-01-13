export const SelectStyles = {
  baseStyle: ({ colorMode, theme }: any) => ({
    field: {
      bg:
        colorMode === "light"
          ? theme.colors.light.surface
          : theme.colors.dark.surface,

      borderColor:
        colorMode === "light"
          ? theme.colors.light.border
          : theme.colors.dark.border,

      color:
        colorMode === "light"
          ? theme.colors.light.text
          : theme.colors.dark.text,

      _hover: {
        bg:
          colorMode === "light"
            ? theme.colors.light.surfaceAlt
            : theme.colors.dark.surfaceAlt,
      },

      _focus: {
        borderColor: theme.colors.brand[400],
        boxShadow: `0 0 0 1px ${theme.colors.brand[400]}`,
      },

      borderRadius: "md",
      transitionProperty: "all",
      transitionDuration: "0.2s",
      transitionTimingFunction: "ease",
    },
  }),
};
