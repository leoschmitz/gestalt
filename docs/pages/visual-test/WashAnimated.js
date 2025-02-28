// @flow strict
import { type Node } from 'react';
import { ColorSchemeProvider, Flex, Link, Button, Avatar, WashAnimated, Box, Text } from 'gestalt';

export default function Snapshot(): Node {
  return (
    <ColorSchemeProvider colorScheme="light">
      <Box color="default" display="inlineBlock" padding={1}>
        <Flex alignItems="center" height="100%" justifyContent="center" width="100%">
          <Box maxWidth={236} padding={8} column={12}>
            <WashAnimated
              active
              image={<Avatar name="James Jones" src="https://i.ibb.co/2Fc00R3/james.jpg" />}
            >
              <Flex direction="column" justifyContent="center">
                <Text align="center" weight="bold">
                  <Link href="https://pinterest.com">
                    <Box paddingX={3} paddingY={2}>
                      James Jones
                    </Box>
                  </Link>
                </Text>
                <Button accessibilityLabel="Follow James Jones" color="red" text="Follow" />
              </Flex>
            </WashAnimated>
          </Box>
        </Flex>
      </Box>
    </ColorSchemeProvider>
  );
}
