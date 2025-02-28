// @flow strict
import { type Node, useRef, useEffect, useState } from 'react';
import { IconButton, Flex, PopoverEducational } from 'gestalt';

export default function Example(): Node {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef();

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <Flex alignItems="center" justifyContent="center" height="100%" width="100%">
      <IconButton
        accessibilityLabel="This IconButton represents a new feature"
        iconColor="darkGray"
        icon="pin"
        onClick={() => {}}
        ref={anchorRef}
        size="lg"
      />
      {open && (
        <PopoverEducational
          accessibilityLabel="Popover visible on initial page load"
          anchor={anchorRef.current}
          idealDirection="right"
          onDismiss={() => {}}
          message="This PopoverEducational is visible on initial page load"
        />
      )}
    </Flex>
  );
}
