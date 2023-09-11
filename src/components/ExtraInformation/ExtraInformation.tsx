import React from 'react';
import { Link } from 'react-router-dom';
import { Platform } from '@/enum';
import Tip from '@/components/Tip/Tip';
import Text from '@/components/Text/Text';
import style from './ExtraInformation.module.css';

interface ExtraInformationProps {
  platform: {
    [key in keyof typeof Platform]?: key extends 'blog'
      ? { title: string; url: string }
      : { url: string };
  };
}

export default function ExtraInformation(props: ExtraInformationProps) {
  const { platform } = props;

  return (
    <Tip type="primary">
      {{
        header() {
          return <span>案例相关链接：</span>;
        },
        body() {
          return (
            <div className={style['wrapper']}>
              <div className={style['foremost']}>
                <span className={style['platform']}>{Platform['blog']}：</span>

                <Link to={platform['blog']?.url || ''} target="_blank">
                  <Text type="primary">{platform['blog']?.title}</Text>
                </Link>
              </div>

              <div className={style['other']}>
                <span className={style['platform']}>发布平台：</span>

                <p className={style['platform-item']}>
                  {Object.keys(platform).map((key) => (
                    <Link
                      key={key}
                      to={platform[key as keyof typeof Platform]?.url || ''}
                      target="_blank"
                    >
                      <Text type="primary">
                        {Platform[key as keyof typeof Platform]}
                      </Text>
                    </Link>
                  ))}
                </p>
              </div>
            </div>
          );
        }
      }}
    </Tip>

    // <div className={style['extra-information']}>
    //   <h1 className={style['title']}>案例相关链接：</h1>

    //   {/* <div className={style['wrapper']}>
    //     {Object.keys(platform).map((key) => (
    //       <div key={key} className={style['group']}>
    //         <span className={style['platform']}>
    //           {Platform[key as keyof typeof Platform]}：
    //         </span>

    //         {platform[key as keyof typeof Platform]?.map(({ title, url }) => (
    //           <Link key={url} to={url} target="_blank">
    //             <Text type="primary">{title}</Text>
    //           </Link>
    //         ))}
    //       </div>
    //     ))}
    //   </div> */}
    // </div>
  );
}
