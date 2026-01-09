export const DividerStyles = {
  baseStyle: ({ colorMode, theme }: any) => ({
    borderColor:
      colorMode === "light"
        ? theme.colors.light.border
        : theme.colors.dark.border,
  }),
};
