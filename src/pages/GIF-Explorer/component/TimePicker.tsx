import React, { useRef, useState } from 'react';
import Input from '@/components/Input/Input';

interface TimePickerProps {
  id?: string;
  value: string;
  change: React.Dispatch<React.SetStateAction<string>>;
}

export default function TimePicker(props: TimePickerProps) {
  const { id, value, change } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const [cache, setCache] = useState('00 : 00 : 05');

  const handleSelect = () => {
    if (inputRef.current === null) return;

    const len = inputRef.current.value.length;

    inputRef.current.setSelectionRange(len - 2, len);
  };

  const handleBlur = () => {
    const values = value.split(':');

    if (values.length > 3) {
      return change(cache);
    }

    let overflow = false;

    const valid = values.every((char) => /\d{2}/.test(char.trim()));

    const [hour, minute, second] = values;

    const _hour = window.parseInt(hour);
    const _minute = window.parseInt(minute);
    const _second = window.parseInt(second);

    if (_hour > 24 || _minute > 60 || _second > 60) {
      overflow = true;
    } else if (_hour === 24 && (_minute > 0 || _second > 0)) {
      overflow = true;
    }

    if (valid && overflow === false) {
      setCache(value);
    } else {
      change(cache);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> &
    React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (inputRef.current === null) return;

    const key = ['ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key);

    if (key === false) return;

    const start = inputRef.current.selectionStart || 0;
    const end = inputRef.current.selectionEnd || 0;

    const offset = [
      [0, 2],
      [5, 7],
      [10, 12]
    ];

    const timerIndex = offset.findIndex(
      ([_start, _end]) => start === _start && _end === end
    );

    if (timerIndex === -1) return;

    let value = [0, 0];

    e.preventDefault();

    if (e.key === 'ArrowLeft') {
      value =
        timerIndex === 0 ? offset[offset.length - 1] : offset[timerIndex - 1];
    } else {
      value =
        timerIndex === offset.length - 1 ? offset[0] : offset[timerIndex + 1];
    }

    inputRef.current.setSelectionRange(value[0], value[1]);
  };

  return (
    <Input
      ref={inputRef}
      id={id}
      value={value}
      change={change}
      focus={handleSelect}
      blur={handleBlur}
      onKeyDown={handleKeyDown}
    ></Input>
  );
}
