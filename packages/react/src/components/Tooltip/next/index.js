/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { Popover, PopoverContent } from '../../Popover';
import { keys, match } from '../../../internal/keyboard';
import { useDelayedState } from '../../../internal/useDelayedState';
import { useId } from '../../../internal/useId';
import { useNoInteractiveChildren } from '../../../internal/useNoInteractiveChildren';
import { usePrefix } from '../../../internal/usePrefix';

function Tooltip({
  align = 'top',
  className: customClassName,
  children,
  label,
  description,
  enterDelayMs = 100,
  leaveDelayMs = 300,
  defaultOpen = false,
  ...rest
}) {
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);
  const [open, setOpen] = useDelayedState(defaultOpen);
  const id = useId('tooltip');
  const prefix = usePrefix();
  const child = React.Children.only(children);

  const triggerProps = {
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
  };

  if (label) {
    triggerProps['aria-labelledby'] = id;
  } else {
    triggerProps['aria-describedby'] = id;
  }

  function onKeyDown(event) {
    if (open && match(event, keys.Escape)) {
      event.stopPropagation();
      setOpen(false);
    }
  }

  function onMouseEnter() {
    setOpen(true, enterDelayMs);
  }

  function onMouseLeave() {
    setOpen(false, leaveDelayMs);
  }

  useNoInteractiveChildren(
    tooltipRef,
    'The Tooltip component must have no interactive content rendered by the' +
      '`label` or `description` prop'
  );

  return (
    <Popover
      {...rest}
      align={align}
      className={cx(`${prefix}--tooltip`, customClassName)}
      dropShadow={false}
      highContrast
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      open={open}
      ref={containerRef}>
      {React.cloneElement(child, triggerProps)}
      <PopoverContent
        aria-hidden="true"
        className={`${prefix}--tooltip-content`}
        id={id}
        ref={tooltipRef}
        role="tooltip">
        {label || description}
      </PopoverContent>
    </Popover>
  );
}

Tooltip.propTypes = {
  /**
   * Specify how the trigger should align with the tooltip
   */
  align: PropTypes.oneOf([
    'top',
    'top-left',
    'top-right',

    'bottom',
    'bottom-left',
    'bottom-right',

    'left',
    'left-bottom',
    'left-top',

    'right',
    'right-bottom',
    'right-top',
  ]),

  /**
   * Pass in the child to which the tooltip will be applied
   */
  children: PropTypes.node,

  /**
   * Specify an optional className to be applied to the container node
   */
  className: PropTypes.string,

  /**
   * Specify whether the tooltip should be open when it first renders
   */
  defaultOpen: PropTypes.bool,

  /**
   * Provide the description to be rendered inside of the Tooltip. The
   * description will use `aria-describedby` and will describe the child node
   * in addition to the text rendered inside of the child. This means that if you
   * have text in the child node, that it will be announced alongside the
   * description to the screen reader.
   *
   * Note: if label and description are both provided, label will be used and
   * description will not be used
   */
  description: PropTypes.node,

  /**
   * Specify the duration in milliseconds to delay before displaying the tooltip
   */
  enterDelayMs: PropTypes.number,

  /**
   * Provide the label to be rendered inside of the Tooltip. The label will use
   * `aria-labelledby` and will fully describe the child node that is provided.
   * This means that if you have text in the child node, that it will not be
   * announced to the screen reader.
   *
   * Note: if label and description are both provided, description will not be
   * used
   */
  label: PropTypes.node,

  /**
   * Specify the duration in milliseconds to delay before hiding the tooltip
   */
  leaveDelayMs: PropTypes.number,
};

export { Tooltip };
