export const LinkStyles = {
  baseStyle: ({ colorMode, theme }: any) => ({
    color:
      colorMode === "light" ? theme.colors.light.text : theme.colors.dark.text,
    fontWeight: "500",
    _hover: {
      color:
        colorMode === "light"
          ? theme.colors.brand[600]
          : theme.colors.brand[300],
      textDecoration: "none",
    },
    transition: "color 0.2s ease",
  }),
};
