import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from '@/components/Card/Card';
import Text from '@/components/Text/Text';
import Button from '@/components/Button/Button';
import { ScreenContext } from '@/layout/Layout';
import style from './ScreenBoundary.module.css';

interface ScreenBoundaryProps extends ChildProps {
  children: React.ReactElement;
  displayInMobile?: boolean;
}

export default function ScreenBoundary(props: ScreenBoundaryProps) {
  const { children, displayInMobile = false } = props;

  const isSmallScreen = useContext(ScreenContext);

  if (isSmallScreen && displayInMobile === false) {
    return (
      <Card className={style['screen-boundary']}>
        {{
          header() {
            return <h1 className={style['title']}>温馨提示</h1>;
          },
          body() {
            return (
              <>
                <Text block type="info">
                  此页不建议在移动端或小屏设备上渲染
                </Text>

                <p className={style['desc']}>
                  基于技术或用户体验考虑，当前页面暂不支持在此环境中展示，建议使用大屏设备体验，如电脑、平板等。
                </p>

                <footer className={style['footer']}>
                  <Link to={'/'}>
                    <Button type="primary">返回首页</Button>
                  </Link>
                </footer>
              </>
            );
          }
        }}
      </Card>
    );
  }

  return children;
}
