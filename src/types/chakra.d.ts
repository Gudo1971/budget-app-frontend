import "react"
import { StackProps } from "@chakra-ui/react"

declare module "@chakra-ui/react" {
  interface VStackProps extends StackProps {
    gap?: StackProps["gap"]
  }
}
