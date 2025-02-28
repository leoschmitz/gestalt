// @flow strict
import React, { type Node } from 'react';
import {
  Box,
  Button,
  CompositeZIndex,
  FixedZIndex,
  Flex,
  Layer,
  List,
  OverlayPanel,
  Tabs,
  Text,
} from 'gestalt';

function SheetWithSubheading({ onDismiss }: {| onDismiss: () => void |}) {
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  const enRef = React.useRef();
  const esRef = React.useRef();
  const ptRef = React.useRef();
  const chRef = React.useRef();
  const refs = [enRef, esRef, ptRef, chRef];

  const handleChangeTab = ({ activeTabIndex: activeTabIndexLocal, event }) => {
    event.preventDefault();
    setActiveTabIndex(activeTabIndexLocal);
    refs[activeTabIndexLocal].current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <OverlayPanel
      accessibilityDismissButtonLabel="Close"
      accessibilityLabel="Example overlay panel to demonstrate subHeading"
      heading="OverlayPanel with subHeading"
      onDismiss={onDismiss}
      footer={
        <Flex justifyContent="end">
          <Button color="red" text="Apply changes" />
        </Flex>
      }
      size="md"
      subHeading={
        <Box marginBottom={4} marginStart={8} marginEnd={8}>
          <Tabs
            tabs={[
              {
                text: 'English',
                href: '#',
              },
              {
                text: 'Español',
                href: '#',
              },
              {
                text: 'Português',
                href: '#',
              },
              {
                text: '普通话',
                href: '#',
              },
            ]}
            activeTabIndex={activeTabIndex}
            onChange={handleChangeTab}
          />
        </Box>
      }
    >
      <Flex direction="column" gap={2}>
        <Box ref={enRef}>
          <List label={<Text weight="bold">English</Text>}>
            <List.Item text="One" />
            <List.Item text="Two" />
            <List.Item text="Three" />
            <List.Item text="Four" />
            <List.Item text="Five" />
            <List.Item text="Six" />
            <List.Item text="Seven" />
            <List.Item text="Eight" />
            <List.Item text="Nine" />
            <List.Item text="Ten" />
          </List>
        </Box>
        <Box ref={esRef}>
          <List label={<Text weight="bold">Español</Text>}>
            <List.Item text="Dos" />
            <List.Item text="Tres" />
            <List.Item text="Cuatro" />
            <List.Item text="Cinco" />
            <List.Item text="Seis" />
            <List.Item text="Siete" />
            <List.Item text="Ocho" />
            <List.Item text="Nueve" />
            <List.Item text="Diez" />
          </List>
        </Box>
        <Box ref={ptRef}>
          <List label={<Text weight="bold">Português</Text>}>
            <List.Item text="Um" />
            <List.Item text="Dois" />
            <List.Item text="Três" />
            <List.Item text="Quatro" />
            <List.Item text="Cinco" />
            <List.Item text="Seis" />
            <List.Item text="Sete" />
            <List.Item text="Oito" />
            <List.Item text="Nove" />
            <List.Item text="Dez" />
          </List>
        </Box>
        <Box ref={chRef}>
          <List label={<Text weight="bold">普通话</Text>}>
            <List.Item text="一" />
            <List.Item text="二" />
            <List.Item text="三" />
            <List.Item text="四" />
            <List.Item text="五" />
            <List.Item text="六" />
            <List.Item text="七" />
            <List.Item text="八" />
            <List.Item text="九" />
            <List.Item text="十" />
          </List>
        </Box>
      </Flex>
    </OverlayPanel>
  );
}

export default function SubheadingExample(): Node {
  const [shouldShow, setShouldShow] = React.useState(true);
  const HEADER_ZINDEX = new FixedZIndex(10);
  const sheetZIndex = new CompositeZIndex([HEADER_ZINDEX]);

  return (
    <React.Fragment>
      <Box padding={8}>
        <Button text="View subheading example" onClick={() => setShouldShow(true)} />
      </Box>
      {shouldShow && (
        <Layer zIndex={sheetZIndex}>
          <SheetWithSubheading onDismiss={() => setShouldShow(false)} />
        </Layer>
      )}
    </React.Fragment>
  );
}
