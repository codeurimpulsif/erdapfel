import React, { Fragment, useState } from 'react';
import { Panel, Chevron } from 'src/components/ui';
import CategoryList from 'src/components/CategoryList';
import { useI18n } from 'src/hooks';
import { Flex, Button } from '@qwant/qwant-ponents';

const ServicePanelDesktop = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { _ } = useI18n();

  return (
    <Fragment>
      <Panel className="service_panel u-mb-xs">
        <h3 className="u-text--smallTitle u-mb-s">
          {_('Search around this place', 'service panel')}
        </h3>
        <CategoryList className="service_panel__categories" limit={collapsed ? 4 : undefined} />
      </Panel>
      <Flex center>
        <div className="service_panel__category_toggle">
          <Button variant="tertiary" onMouseDown={() => setCollapsed(!collapsed)}>
            {collapsed ? (
              <>
                <Chevron size={16} fill="currentColor" up /> {_('See more nearby services')}
              </>
            ) : (
              <>
                <Chevron size={16} fill="currentColor" />
                {_('Reduce')}
              </>
            )}
          </Button>
        </div>
      </Flex>
    </Fragment>
  );
};

export default ServicePanelDesktop;
