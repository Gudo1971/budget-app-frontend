export const InputStyles = {
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
        borderColor: theme.colors.brand[400],
      },
      _focus: {
        borderColor: theme.colors.brand[400],
        boxShadow: `0 0 0 1px ${theme.colors.brand[400]}`,
      },
      borderRadius: "md",
      transition: "all 0.2s ease",
    },
  }),
};
