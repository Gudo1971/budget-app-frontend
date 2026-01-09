export const ButtonStyles = {
  baseStyle: ({ colorMode, theme }: any) => ({
    borderRadius: "md",
    fontWeight: "500",
    _focus: {
      boxShadow: `0 0 0 1px ${theme.colors.brand[400]}`,
    },
  }),

  variants: {
    solid: ({ colorMode, theme }: any) => ({
      bg:
        colorMode === "light"
          ? theme.colors.brand[500]
          : theme.colors.brand[300],
      color: colorMode === "light" ? "white" : "gray.900",
      _hover: {
        bg:
          colorMode === "light"
            ? theme.colors.brand[600]
            : theme.colors.brand[400],
      },
    }),

    ghost: ({ colorMode, theme }: any) => ({
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
    }),
  },

  defaultProps: {
    variant: "solid",
  },
};
