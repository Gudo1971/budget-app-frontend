import {
  Box,
  HStack,
  IconButton,
  useDisclosure,
  VStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  useColorMode,
  useTheme,
  Show,
  Hide,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link, useLocation } from "react-router-dom";
import { LanguageToggle } from "../components/i18n/LanguageToggle";
import { ColorModeToggle } from "../components/ui/ColorModeToggle";

export function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const location = useLocation();

  const isDashboard = location.pathname === "/";
  const isTransactions = location.pathname === "/transactions";
  const isReceipts = location.pathname === "/receipts";

  const text =
    colorMode === "light" ? theme.colors.light.text : theme.colors.dark.text;

  const border =
    colorMode === "light"
      ? theme.colors.light.border
      : theme.colors.dark.border;

  const surface =
    colorMode === "light"
      ? theme.colors.light.surface
      : theme.colors.dark.surface;

  return (
    <Box
      w="full"
      px={4}
      py={3}
      borderBottom="1px solid"
      borderColor={border}
      bg={surface}
    >
      <HStack justify="space-between" align="center">
        {/* Logo */}
        <Box fontWeight="bold" fontSize="lg" color={text}>
          BudgetApp
        </Box>

        {/* Desktop Navigation */}
        <Show above="md">
          <HStack spacing={6} align="center">
            {/* Dashboard */}
            <Link
              to="/"
              style={{
                pointerEvents: isDashboard ? "none" : "auto",
                opacity: isDashboard ? 0.5 : 1,
                fontWeight: isDashboard ? "bold" : "normal",
                cursor: isDashboard ? "default" : "pointer",
              }}
            >
              Dashboard
            </Link>

            {/* Transactions */}
            <Link
              to="/transactions"
              style={{
                pointerEvents: isTransactions ? "none" : "auto",
                opacity: isTransactions ? 0.5 : 1,
                fontWeight: isTransactions ? "bold" : "normal",
                cursor: isTransactions ? "default" : "pointer",
              }}
            >
              Transacties
            </Link>
            {/* Receipts */}
            <Link
              to="/receipts"
              style={{
                pointerEvents: isReceipts ? "none" : "auto",
                opacity: isReceipts ? 0.5 : 1,
                fontWeight: isReceipts ? "bold" : "normal",
                cursor: isReceipts ? "default" : "pointer",
              }}
            >
              Bonnen
            </Link>

            <ColorModeToggle />
            <LanguageToggle />
          </HStack>
        </Show>

        {/* Mobile Hamburger */}
        <Hide above="md">
          <IconButton
            aria-label="Open menu"
            icon={<HamburgerIcon />}
            variant="ghost"
            onClick={onOpen}
          />
        </Hide>
      </HStack>

      {/* Mobile Drawer */}
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>

          <DrawerBody>
            <VStack align="start" spacing={4} mt={4}>
              {/* Dashboard */}
              <Link
                to="/"
                onClick={isDashboard ? undefined : onClose}
                style={{
                  pointerEvents: isDashboard ? "none" : "auto",
                  opacity: isDashboard ? 0.5 : 1,
                  fontWeight: isDashboard ? "bold" : "normal",
                  cursor: isDashboard ? "default" : "pointer",
                }}
              >
                Dashboard
              </Link>

              {/* Transactions */}
              <Link
                to="/transactions"
                onClick={isTransactions ? undefined : onClose}
                style={{
                  pointerEvents: isTransactions ? "none" : "auto",
                  opacity: isTransactions ? 0.5 : 1,
                  fontWeight: isTransactions ? "bold" : "normal",
                  cursor: isTransactions ? "default" : "pointer",
                }}
              >
                Transacties
              </Link>

              <ColorModeToggle />
              <LanguageToggle />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
