// @flow strict
import { type Node } from 'react';
import AvatarFoundation from '../AvatarFoundation.js';
import { type BaseStackType } from './constants.js';
import PositioningWrapper from './PositioningWrapper.js';
import HoverOverlay from './HoverOverlay.js';

export default function AvatarGroupAddCollaboratorsButton({
  hovered,
  pileCount,
  size,
}: BaseStackType): Node {
  return (
    <PositioningWrapper index={pileCount - 1} pileCount={pileCount} size={size}>
      <HoverOverlay hovered={hovered} size={size}>
        <AvatarFoundation outline content="icon" />
      </HoverOverlay>
    </PositioningWrapper>
  );
}
