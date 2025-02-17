import React from 'react';
import classNames from 'classnames';

const Block = ({
  icon,
  title,
  children,
  className,
  onClick,
  href,
  actionIcon,
  tooltip,
  simple,
  ...rest
}) => {
  const Tag = href ? 'a' : 'div';

  return (
    <Tag
      className={classNames('block', { 'block--clickable': onClick || href }, className)}
      onClick={onClick}
      href={href}
      title={tooltip}
      {...rest}
    >
      {simple ? icon : <div className="block-icon">{icon}</div>}
      <div className="block-content">
        {title && <div className="u-firstCap u-text--caption u-mb-xxxs">{title}</div>}
        <div className="block-value">{children}</div>
      </div>
      {actionIcon && <div className="block-action">{actionIcon}</div>}
    </Tag>
  );
};

export default Block;
