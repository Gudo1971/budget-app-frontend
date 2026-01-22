import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

// ⭐ Swipe beweging met ease-out en glow
const swipe = keyframes`
  0% {
    transform: translate(-50%, -50%) translateX(45px);
    filter: drop-shadow(0 0 0px rgba(255,255,255,0));
  }
  30% {
    transform: translate(-50%, -50%) translateX(-45px);
    filter: drop-shadow(0 0 6px rgba(255,255,255,0.6)); /* glow peak */
  }
  60% {
    transform: translate(-50%, -50%) translateX(-45px);
    filter: drop-shadow(0 0 4px rgba(255,255,255,0.4));
  }
  100% {
    transform: translate(-50%, -50%) translateX(45px);
    filter: drop-shadow(0 0 0px rgba(255,255,255,0)); /* fade glow */
  }
`;

export function SwipeHint() {
  return (
    <Box
      position="absolute"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
    >
      {/* Ghost 1 */}
      <Box
        position="absolute"
        fontSize="32px"
        opacity={0.15}
        pointerEvents="none"
        animation={`${swipe} 3.2s cubic-bezier(0.25, 1, 0.5, 1) infinite`} // ⭐ ease-out
        style={{ animationDelay: "0.12s" }}
      >
        👆
      </Box>

      {/* Ghost 2 */}
      <Box
        position="absolute"
        fontSize="32px"
        opacity={0.08}
        pointerEvents="none"
        animation={`${swipe} 3.2s cubic-bezier(0.25, 1, 0.5, 1) infinite`} // ⭐ ease-out
        style={{ animationDelay: "0.22s" }}
      >
        👆
      </Box>

      {/* Main hand */}
      <Box
        fontSize="32px"
        pointerEvents="none"
        opacity={0.95}
        animation={`${swipe} 3.2s cubic-bezier(0.25, 1, 0.5, 1) infinite`} // ⭐ ease-out
      >
        👆
      </Box>
    </Box>
  );
}
