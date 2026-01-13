export const CardStyles = {
  baseStyle: ({ colorMode, theme }: any) => ({
    container: {
      bg:
        colorMode === "light"
          ? theme.colors.light.surface
          : theme.colors.dark.surface,
      borderRadius: "lg",
      borderWidth: "1px",
      borderColor:
        colorMode === "light"
          ? theme.colors.light.border
          : theme.colors.dark.border,
      boxShadow: colorMode === "light" ? "sm" : "md",
      padding: 4,
      transitionProperty: "all",
      transitionDuration: "0.2s",
      transitionTimingFunction: "ease",
    },
  }),
};
