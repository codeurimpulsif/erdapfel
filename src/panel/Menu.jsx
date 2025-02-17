import React, { Fragment, useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import AppMenu from './menu/AppMenu';
import ProductsDrawer from './menu/ProductsDrawer';
import Telemetry from 'src/libs/telemetry';
import { CloseButton } from 'src/components/ui';
import { Flex, IconMenu, IconApps, IconArrowLeftLine } from '@qwant/qwant-ponents';
import { useConfig, useDevice, useI18n } from 'src/hooks';
import { listen, unListen } from 'src/libs/customEvents';
import {
  getQueryString,
  parseQueryString,
  updateQueryString,
  getAppRelativePathname,
} from 'src/libs/url_utils';

const Menu = () => {
  const [openedMenu, setOpenedMenu] = useState(null);
  const menuContainer = useRef(document.createElement('div'));
  const { isMobile } = useDevice();
  const displayProducts = useConfig('burgerMenu').products;
  const { _ } = useI18n();

  const openMenuFromUrl = url => {
    const activeMenuDrawer = parseQueryString(getQueryString(url))['drawer'];
    setOpenedMenu(activeMenuDrawer);
  };

  useEffect(() => {
    openMenuFromUrl(window.location.href);
    const routeChangeHandler = listen('routeChange', openMenuFromUrl);
    return () => {
      unListen(routeChangeHandler);
    };
  }, []);

  useEffect(() => {
    const current = menuContainer.current;
    document.body.appendChild(current);
    return () => {
      document.body.removeChild(current);
    };
  }, []);

  useEffect(() => {
    if (openedMenu === 'app') {
      Telemetry.add(Telemetry.MENU_CLICK);
    }
  }, [openedMenu]);

  const drawerUrl = drawer => getAppRelativePathname() + updateQueryString({ drawer });

  const close = () => {
    window.app.navigateTo(drawerUrl(null), window.history.state || {});
  };

  const openDrawer = menu => {
    window.app.navigateTo(drawerUrl(menu), window.history.state || {});
  };

  const toggleOpen = menu => {
    if (openedMenu === menu) {
      close();
    } else {
      openDrawer(menu);
    }
  };

  return (
    <Fragment>
      <Flex className="menu__button-container">
        <button
          type="button"
          className={cx('menu__button', {
            'menu__button--active': openedMenu === 'app',
            'menu__button--noShadow': openedMenu && openedMenu !== 'app',
          })}
          onClick={() => {
            toggleOpen('app');
          }}
          title={_('Menu')}
        >
          <IconMenu size={isMobile ? 24 : 16} />
        </button>

        {!isMobile && displayProducts && (
          <button
            type="button"
            className={cx('u-mr-xs', 'menu__button', {
              'menu__button--active': openedMenu === 'products',
              'menu__button--noShadow': openedMenu && openedMenu !== 'products',
            })}
            onClick={() => {
              toggleOpen('products');
            }}
          >
            <IconApps className="u-mr-xxs" />
            {_('Products', 'menu')}
          </button>
        )}
      </Flex>

      {openedMenu &&
        ReactDOM.createPortal(
          <div className={cx('menu', { productsDrawer: openedMenu === 'products' })}>
            <div className="menu__overlay" onClick={close} />

            <div className="menu__panel">
              <Flex alignCenter className="menu-top">
                {isMobile && openedMenu === 'products' && (
                  <>
                    <Flex
                      as="button"
                      center
                      alignCenter
                      type="button"
                      className="u-mr-s"
                      onClick={() => openDrawer('app')}
                      aria-label={_('Go back')}
                    >
                      <IconArrowLeftLine size={24} />
                    </Flex>
                    <div className="u-text--heading5">{_('Products', 'menu')}</div>
                  </>
                )}
                <CloseButton circle onClick={close} />
              </Flex>
              <div className="menu-content">
                {openedMenu === 'app' ? (
                  <AppMenu
                    close={close}
                    openProducts={isMobile && displayProducts ? () => openDrawer('products') : null}
                  />
                ) : (
                  <ProductsDrawer />
                )}
              </div>
            </div>
          </div>,
          menuContainer.current
        )}
    </Fragment>
  );
};

export default Menu;
