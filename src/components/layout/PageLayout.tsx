import { ReactNode } from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";

type PageLayoutProps = {
  title: string;
  rightSection?: ReactNode;
  children: ReactNode;
};

export function PageLayout({ title, rightSection, children }: PageLayoutProps) {
  return (
    <Box w="100%" maxW="900px" mx="auto" px={4} py={6}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">{title}</Heading>
        {rightSection}
      </Flex>

      {/* Content */}
      <Box>{children}</Box>
    </Box>
  );
}
