import React, { useState, useEffect } from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { CountUp } from 'use-count-up';

interface CountUpNumberProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  style?: StyleProp<TextStyle>;
  prefix?: string;
  suffix?: string;
  onComplete?: () => void;
}

export function CountUpNumber({
  end,
  start = 0,
  duration = 1.5,
  delay = 0,
  style,
  prefix = '',
  suffix = '',
  onComplete,
}: CountUpNumberProps) {
  const [isCounting, setIsCounting] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setIsCounting(true);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  return (
    <Text style={style}>
      {prefix}
      <CountUp
        isCounting={isCounting}
        start={start}
        end={end}
        duration={duration}
        easing="easeOutCubic"
        onComplete={onComplete}
      />
      {suffix}
    </Text>
  );
}
