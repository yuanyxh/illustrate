import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
  useMemo
} from 'react';
import { isRenderElement } from '@/utils';
import { useModel, useTransition } from '@/hooks';
import InputNumber from '@/components/InputNumber/InputNumber';
import Select from '@/components/Select/Select';
import Switch from '@/components/Switch/Switch';
import TimePicker from './TimePicker';
import type {
  Transparency,
  UserInput,
  DisposalMethod,
  ColorObject,
  BulidColor
} from '../types';
import style from './Configuration.module.css';

interface List {
  width: number;
  height: number;
  time: number;
  delay: number;
  disposalMethod: DisposalMethod;
  userInput: UserInput;
  transparency: Transparency;
  transparencyIndex: number;
  cycles: number;
  background: string;
  scaling: number;
}

export interface Options {
  getOptions(): List & { colorTable: BulidColor };
  setColorTable(colorTable: BulidColor): void;
}

type ListKeys = keyof List;

interface ConfigurationProps extends Props {
  perfix?: string;
  showList: ListKeys[];
}

const instructOptions = [
  { label: '不处理', value: 0 },
  { label: '下一帧覆盖当前帧', value: 4 },
  { label: '恢复到背景颜色', value: 8 },
  { label: '恢复到渲染当前帧之前', value: 12 }
];

export default forwardRef(function Configuration(
  props: ConfigurationProps,
  ref: React.ForwardedRef<Options>
) {
  const { showList, perfix = '' } = props;

  const colorRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const showTable = useModel(false);

  const timeModel = useModel('00 : 00 : 05');

  const widthModel = useModel(0);

  const heightModel = useModel(0);

  const delay = useModel(40);

  const disposalMethod = useModel<DisposalMethod>(4);

  const userInputModel = useModel<UserInput>(0);

  const transparencyModel = useModel<Transparency>(0);

  const transparencyIndexModel = useModel(0);

  const cyclesModel = useModel(0);

  const backgroundModel = useModel('#000000');

  const scalingModel = useModel(3);

  const colorTableModel = useModel<BulidColor>({
    colorList: [],
    octree: null
  } as BulidColor);

  useEffect(() => {
    window.addEventListener('click', cacelabled);

    return () => {
      window.removeEventListener('click', cacelabled);
    };
  }, []);

  useImperativeHandle(
    ref,
    () => {
      return { getOptions, setColorTable };
    },
    [
      timeModel.value,
      widthModel.value,
      heightModel.value,
      delay.value,
      disposalMethod.value,
      cyclesModel.value,
      backgroundModel.value,
      transparencyModel.value,
      transparencyIndexModel.value,
      userInputModel.value,
      scalingModel.value,
      colorTableModel.value
    ]
  );

  const colorVar = useMemo(() => {
    colorRef.current?.setAttribute('data-color', backgroundModel.value);

    return { '--color': backgroundModel.value } as React.CSSProperties;
  }, [backgroundModel.value]);

  useTransition(
    showTable.value,
    tableRef,
    { active: 'zoom-in-active' },
    { active: 'zoom-out-active' }
  );

  const cacelabled = () => showTable.change(false);

  function getOptions() {
    const time = +timeModel.value.split(':')[2].trim();

    return {
      time,
      width: widthModel.value,
      height: heightModel.value,
      scaling: scalingModel.value,
      delay: delay.value,
      background: backgroundModel.value,
      disposalMethod: disposalMethod.value,
      cycles: cyclesModel.value,
      userInput: userInputModel.value,
      transparency: transparencyModel.value,
      transparencyIndex: transparencyIndexModel.value,
      colorTable: colorTableModel.value
    };
  }

  function setColorTable(colors: BulidColor) {
    colorTableModel.change({ ...colors });
  }

  const parseColor = ({ r, g, b }: ColorObject) => `rgb(${r}, ${g}, ${b})`;

  const handleFocus = () => {
    if (colorTableModel.value.colorList.length) {
      showTable.change(true);
    }
  };

  const handleSelect = (i: number) => {
    transparencyIndexModel.change(i);

    showTable.change(false);
  };

  return (
    <div className={style['gif-transfer-form']}>
      {isRenderElement(showList.includes('time')) && (
        <div className={style['gif-transfer-form-item']}>
          <label htmlFor={perfix + 'duration'}>视频截取时长：</label>
          <TimePicker id={perfix + 'duration'} {...timeModel}></TimePicker>
        </div>
      )}

      {isRenderElement(showList.includes('width')) && (
        <div className={style['gif-transfer-form-item']}>
          <label htmlFor={perfix + 'width'}>宽度：</label>
          <InputNumber
            id={perfix + 'width'}
            min={0}
            max={400}
            {...transparencyIndexModel}
          ></InputNumber>
        </div>
      )}

      {isRenderElement(showList.includes('height')) && (
        <div className={style['gif-transfer-form-item']}>
          <label htmlFor={perfix + 'height'}>高度：</label>
          <InputNumber
            id={perfix + 'height'}
            min={0}
            max={400}
            {...transparencyIndexModel}
          ></InputNumber>
        </div>
      )}

      {isRenderElement(showList.includes('scaling')) && (
        <div className={style['gif-transfer-form-item']}>
          <label htmlFor={perfix + 'scaling'}>缩放倍数：</label>
          <InputNumber
            id={perfix + 'scaling'}
            min={1}
            {...scalingModel}
          ></InputNumber>
        </div>
      )}

      {isRenderElement(showList.includes('delay')) && (
        <div className={style['gif-transfer-form-item']}>
          <label htmlFor={perfix + 'delay'}>帧间隔(ms)：</label>
          <InputNumber
            id={perfix + 'delay'}
            min={0}
            max={0xffff * 10}
            step={10}
            {...delay}
          ></InputNumber>
        </div>
      )}

      {isRenderElement(showList.includes('userInput')) && (
        <div className={style['gif-transfer-form-item']}>
          <label htmlFor={perfix + 'user-input'}>允许用户操作：</label>
          <Switch
            id={perfix + 'user-input'}
            activeValue={2}
            inactiveValue={0}
            {...userInputModel}
          ></Switch>
        </div>
      )}

      {isRenderElement(showList.includes('cycles')) && (
        <div className={style['gif-transfer-form-item']}>
          <label htmlFor={perfix + 'cycles'}>循环次数(0:无限)：</label>
          <InputNumber
            id={perfix + 'cycles'}
            {...cyclesModel}
            min={0}
            max={0xffff}
          ></InputNumber>
        </div>
      )}

      {isRenderElement(showList.includes('disposalMethod')) && (
        <div className={style['gif-transfer-form-item']}>
          <label htmlFor={perfix + 'dispoal'}>帧替换时当前帧：</label>
          <Select
            id={perfix + 'dispoal'}
            options={instructOptions}
            {...disposalMethod}
          ></Select>
        </div>
      )}

      {isRenderElement(showList.includes('background')) && (
        <div className={style['gif-transfer-form-item']}>
          <label htmlFor={perfix + 'background'}>全局背景色：</label>
          <input
            ref={colorRef}
            className={style['gif-transfer-form-item-background']}
            style={colorVar}
            id={perfix + 'background'}
            type="color"
            data-color={backgroundModel.value}
            value={backgroundModel.value}
            onChange={(e) => backgroundModel.change(e.target.value)}
          />
        </div>
      )}

      {isRenderElement(showList.includes('transparency')) && (
        <div className={style['gif-transfer-form-item']}>
          <label htmlFor={perfix + 'transparency'}>透明(背景色)：</label>
          <Switch
            id={perfix + 'transparency'}
            activeValue={1}
            inactiveValue={0}
            {...transparencyModel}
          ></Switch>
        </div>
      )}

      {isRenderElement(showList.includes('transparencyIndex')) && (
        <div className={style['gif-transfer-form-item']}>
          <label htmlFor={perfix + 'transparency-index'}>透明颜色索引：</label>
          <div className={style['gif-transfer-form-item-index']}>
            <InputNumber
              id={perfix + 'transparency-index'}
              min={0}
              max={colorTableModel.value.colorList.length - 1}
              {...transparencyIndexModel}
              onFocus={handleFocus}
            ></InputNumber>

            <div
              ref={tableRef}
              className={style['gif-transfer-form-itme-color-table']}
            >
              <div
                className={style['gif-transfer-form-itme-inner-color-table']}
              >
                {colorTableModel.value.colorList.map((color, i) => (
                  <span
                    key={JSON.stringify(color) + i}
                    className={style['color']}
                    style={{ backgroundColor: parseColor(color) }}
                    title={JSON.stringify(color)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(i);
                    }}
                  ></span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
