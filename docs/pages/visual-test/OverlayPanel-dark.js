// @flow strict
import { type Node } from 'react';
import { ColorSchemeProvider, OverlayPanel, Flex, Button, Box, Text } from 'gestalt';

export default function Snapshot(): Node {
  return (
    <ColorSchemeProvider colorScheme="dark">
      <Box color="default" display="inlineBlock" width={360} height={360} padding={1}>
        <OverlayPanel
          accessibilityDismissButtonLabel="Test"
          accessibilityLabel="Test"
          footer={
            <Flex justifyContent="end">
              <Button text="Submit" color="red" />
            </Flex>
          }
          heading="Heading"
          onDismiss={() => {}}
          size="sm"
        >
          <Text>Children</Text>
        </OverlayPanel>
      </Box>
    </ColorSchemeProvider>
  );
}
