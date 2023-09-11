import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { isRenderElement } from '@/utils';
import { useAppSelector, useAppDispatch } from '@/store';
import { setColorScheme } from '@/store/module/colorScheme';
import { ScreenContext } from './Layout';
import Text from '@/components/Text/Text';
import style from './Navbar.module.css';

interface NavbarProps {
  toggle(payload: boolean): void;
}

/**
 * @description 导航栏
 */
export default function Navbar({ toggle }: Readonly<NavbarProps>) {
  const smallScreen = useContext(ScreenContext);
  const colorScheme = useAppSelector((state) => state.colorScheme.colorScheme);
  const dispatch = useAppDispatch();

  const onclick = () => toggle(true);

  const changeLight = () => dispatch(setColorScheme('light'));
  const changeDark = () => dispatch(setColorScheme('dark'));

  return (
    <nav className={style.navbar}>
      <div className={style['left']}>
        {smallScreen ? (
          <div className={style.menu} onClick={onclick}>
            <i className="iconfont icon-menu"></i>
          </div>
        ) : (
          <Link style={{ height: '100%' }} to={'/'}>
            <h1 className={style['logo-container']} title="yuanyxh">
              <img className={style['logo']} src="/logo.png" alt="logo" />

              <Text className={style['logo-text']} block size="large">
                yuanyxh
              </Text>
            </h1>
          </Link>
        )}
      </div>

      <div className={style['right']}>
        <ul className={style['list']}>
          {isRenderElement(colorScheme === 'light') && (
            <li
              className={style['list-item']}
              title="light"
              onClick={changeDark}
            >
              <i
                className="iconfont icon-light"
                style={{ color: 'var(--color-primary)' }}
              ></i>
            </li>
          )}
          {isRenderElement(colorScheme === 'dark') && (
            <li
              className={style['list-item']}
              title="dark"
              onClick={changeLight}
            >
              <i
                className="iconfont icon-dark"
                style={{ color: 'var(--color-info-dark-2)' }}
              ></i>
            </li>
          )}

          <li className={style['list-item']} title="blog">
            <Link to="https://yuanyxh.com/" target="_blank">
              <i
                className="iconfont icon-blog"
                style={{
                  color: 'var(--color-primary)',
                  fontSize: 'calc(var(--font-size-extra-large) * 1)'
                }}
              ></i>
            </Link>
          </li>
          <li className={style['list-item']} title="github">
            <Link to="https://github.com/yuanyxh/illustrate" target="_blank">
              <i
                className="iconfont icon-github-fill"
                style={{ color: 'var(--color-info-dark-2)' }}
              ></i>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
