export const BadgeStyles = {
  baseStyle: ({ colorMode, theme }: any) => ({
    borderRadius: "md",
    fontWeight: "500",
    px: 2,
    py: 0.5,
    bg:
      colorMode === "light"
        ? theme.colors.light.surfaceAlt
        : theme.colors.dark.surfaceAlt,
    color:
      colorMode === "light" ? theme.colors.light.text : theme.colors.dark.text,
  }),
};
