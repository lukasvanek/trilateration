import React from "react";
import { Heading, Flex, Text, Link as RebassLink, Box } from "rebass";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { colors } from "./theme";

const StyledLink = (props: any) => {
  const { pathname } = useLocation();
  return (
    <RebassLink
      {...props}
      as={RouterLink}
      fontSize={1}
      flex={1}
      sx={{
        color:
          pathname === props.to ? colors.primary : "rgba(178, 202, 255, 0.4)",
        textDecoration: "none",
        letterSpacing: "0.3rem",
        paddingX: "0.5rem",
        fontWeight: 300,
        textTransform: "uppercase",
      }}
    />
  );
};

const Header = () => {
  return (
    <Heading
      fontSize={[2, 3, 4]}
      sx={{
        borderTop: "5px solid",
      }}
      color="primary"
      py={[20, 30, 50]}
      px={[20, 50, 100]}
    >
      <Flex justifyContent="space-between">
        <Box flex={8}>
          <Text
            sx={{
              letterSpacing: "0.84rem",
              fontWeight: 300,
            }}
          >
            <span>Brno</span>

            <span
              style={{
                letterSpacing: "0.66rem",
                color: colors.gray,
              }}
            >
              |
            </span>

            <span
              style={{
                letterSpacing: "0.42rem",
                color: colors.gray,
              }}
            >
              analytica
            </span>
          </Text>
        </Box>

        <StyledLink to="/map">Map</StyledLink>
      </Flex>
    </Heading>
  );
};

export default Header;
