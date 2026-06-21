import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Image,
  VStack,
  SimpleGrid,
  Container,
} from "@chakra-ui/react";
import { apiGet } from "@/lib/api/api";

type FeatureProps = {
  title: string;
  description: string;
};

function Feature({ title, description }: FeatureProps) {
  return (
    <VStack align="start" spacing={2}>
      <Heading size="md">{title}</Heading>
      <Text color="gray.600" _dark={{ color: "gray.300" }}>
        {description}
      </Text>
    </VStack>
  );
}

export default function LandingPage() {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isReady, setIsReady] = useState(false);

  // ⭐ Warm up backend on landing page load (cold start prevention)
  useEffect(() => {
    const warmUpBackend = async () => {
      try {
        await apiGet("/health");
      } catch (err) {
        // Silently fail - just trying to warm up the backend
        console.log("Backend warm-up initiated");
      }
    };

    warmUpBackend();
  }, []);

  // ⭐ Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsReady(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <Box bg="gray.50" _dark={{ bg: "gray.900" }} minH="100vh" py={20}>
      <Container maxW="6xl">
        {/* HERO */}
        <VStack spacing={6} textAlign="center">
          <Heading fontSize={{ base: "3xl", md: "5xl" }}>
            Budget App Under Development
          </Heading>

          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="gray.600"
            _dark={{ color: "gray.300" }}
          >
            Een moderne, snelle en slimme manier om je geld te beheren.
          </Text>

          <Image
            src="https://res.cloudinary.com/dkpp5c90a/image/upload/v1782046414/cwtvubti3qsvxkubmvgn.png"
            alt="Under Development"
            maxW="650px"
            borderRadius="lg"
            boxShadow="xl"
          />
          <Button
            colorScheme="teal"
            size="lg"
            as="a"
            href="/app"
            isDisabled={!isReady}
            opacity={isReady ? 1 : 0.6}
            cursor={isReady ? "pointer" : "not-allowed"}
            pointerEvents={isReady ? "auto" : "none"}
          >
            {isReady ? "Start de app" : `Wacht nog ${timeLeft}s...`}
          </Button>

          <Text fontSize="sm" color="gray.500" _dark={{ color: "gray.400" }}>
            De volledige versie wordt actief ontwikkeld.
          </Text>
        </VStack>

        {/* FEATURES */}
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={10}
          mt={20}
          maxW="800px"
          mx="auto"
          alignItems="start"
        >
          <Feature
            title="Slim overzicht"
            description="Automatische berekeningen, rollover en inzicht in je maandbudget."
          />
          <Feature
            title="Transacties beheren"
            description="Snelle invoer, categorieën en duidelijke filtering."
          />
          <Feature
            title="Maandfilters"
            description="Period filtering met collapsible UI en progress bars."
          />
          <Feature
            title="Privacy-vriendelijk"
            description="Geen tracking. Jouw data blijft van jou."
          />
        </SimpleGrid>

        {/* ROADMAP */}
        <Box mt={20} textAlign="center">
          <Heading size="lg">Development Roadmap</Heading>
          <Text
            mt={4}
            color="gray.600"
            _dark={{ color: "gray.300" }}
            fontSize="md"
          >
            Backend API 80% • UI Components 60% • Database Model 100% •
            Filtering Engine 40%
          </Text>
        </Box>

        {/* FOOTER */}
        <Box
          mt={20}
          textAlign="center"
          color="gray.500"
          _dark={{ color: "gray.400" }}
        >
          <Text>© 2026 Budget App Gemaakt door Gudo</Text>
        </Box>
      </Container>
    </Box>
  );
}
