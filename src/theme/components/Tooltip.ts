export const TooltipStyles = {
  baseStyle: {
    px: 3,
    py: 2,
    borderRadius: "md",
    border: "1px solid",
    borderColor: "whiteAlpha.300",
    backdropFilter: "blur(6px)",
    boxShadow: "none",

    _content: {
      bg: "dark.surfaceAlt", // ← exact dezelfde kleur als je kaarten
      color: "dark.text",
    },

    _arrow: {
      bg: "dark.surfaceAlt",
      borderColor: "whiteAlpha.300",
    },

    _dark: {
      _content: {
        bg: "dark.surfaceAlt",
        color: "dark.text",
      },
      _arrow: {
        bg: "dark.surfaceAlt",
        borderColor: "whiteAlpha.300",
      },
    },
  },
};
