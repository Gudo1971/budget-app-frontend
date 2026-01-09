export const HeadingStyles = {
  baseStyle: ({ colorMode, theme }: any) => ({
    color:
      colorMode === "light" ? theme.colors.light.text : theme.colors.dark.text,
    fontWeight: "600",
    lineHeight: "1.2",
  }),
};
