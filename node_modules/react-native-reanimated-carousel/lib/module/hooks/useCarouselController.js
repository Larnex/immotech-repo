import React, { useRef } from 'react';
import { Easing } from '../constants';
import { runOnJS, useAnimatedReaction, useSharedValue } from 'react-native-reanimated';
import { dealWithAnimation } from '@/utils/dealWithAnimation';
import { convertToSharedIndex } from '@/utils/computedWithAutoFillData';
import { round } from '@/utils/log';
export function useCarouselController(options) {
  const {
    size,
    data,
    loop,
    handlerOffsetX,
    withAnimation,
    defaultIndex = 0,
    duration,
    autoFillData
  } = options;
  const dataInfo = React.useMemo(() => ({
    length: data.length,
    disable: !data.length,
    originalLength: data.length
  }), [data]);
  const index = useSharedValue(defaultIndex); // The Index displayed to the user

  const sharedIndex = useRef(defaultIndex);
  const sharedPreIndex = useRef(defaultIndex);
  const currentFixedPage = React.useCallback(() => {
    if (loop) {
      return -Math.round(handlerOffsetX.value / size);
    }

    const fixed = handlerOffsetX.value / size % dataInfo.length;
    return Math.round(handlerOffsetX.value <= 0 ? Math.abs(fixed) : Math.abs(fixed > 0 ? dataInfo.length - fixed : 0));
  }, [handlerOffsetX, dataInfo, size, loop]);

  function setSharedIndex(newSharedIndex) {
    sharedIndex.current = newSharedIndex;
  }

  useAnimatedReaction(() => {
    const handlerOffsetXValue = handlerOffsetX.value;
    const toInt = round(handlerOffsetXValue / size) % dataInfo.length;
    const isPositive = handlerOffsetXValue <= 0;
    const i = isPositive ? Math.abs(toInt) : Math.abs(toInt > 0 ? dataInfo.length - toInt : 0);
    const newSharedIndexValue = convertToSharedIndex({
      loop,
      rawDataLength: dataInfo.originalLength,
      autoFillData: autoFillData,
      index: i
    });
    return {
      i,
      newSharedIndexValue
    };
  }, _ref => {
    let {
      i,
      newSharedIndexValue
    } = _ref;
    index.value = i;
    runOnJS(setSharedIndex)(newSharedIndexValue);
  }, [sharedPreIndex, sharedIndex, size, dataInfo, index, loop, autoFillData, handlerOffsetX]);
  const getCurrentIndex = React.useCallback(() => {
    return index.value;
  }, [index]);
  const canSliding = React.useCallback(() => {
    return !dataInfo.disable;
  }, [dataInfo]);
  const onScrollEnd = React.useCallback(() => {
    var _options$onScrollEnd;

    (_options$onScrollEnd = options.onScrollEnd) === null || _options$onScrollEnd === void 0 ? void 0 : _options$onScrollEnd.call(options);
  }, [options]);
  const onScrollBegin = React.useCallback(() => {
    var _options$onScrollBegi;

    (_options$onScrollBegi = options.onScrollBegin) === null || _options$onScrollBegi === void 0 ? void 0 : _options$onScrollBegi.call(options);
  }, [options]);
  const scrollWithTiming = React.useCallback((toValue, onFinished) => {
    'worklet';

    const callback = isFinished => {
      'worklet';

      if (isFinished) {
        runOnJS(onScrollEnd)();
        onFinished && runOnJS(onFinished)();
      }
    };

    const defaultWithAnimation = {
      type: 'timing',
      config: {
        duration,
        easing: Easing.easeOutQuart
      }
    };
    return dealWithAnimation(withAnimation !== null && withAnimation !== void 0 ? withAnimation : defaultWithAnimation)(toValue, callback);
  }, [duration, withAnimation, onScrollEnd]);
  const next = React.useCallback(function () {
    'worklet';

    let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const {
      count = 1,
      animated = true,
      onFinished
    } = opts;
    if (!canSliding() || !loop && index.value >= dataInfo.length - 1) return;
    onScrollBegin === null || onScrollBegin === void 0 ? void 0 : onScrollBegin();
    const nextPage = currentFixedPage() + count;
    index.value = nextPage;

    if (animated) {
      handlerOffsetX.value = scrollWithTiming(-nextPage * size, onFinished);
    } else {
      handlerOffsetX.value = -nextPage * size;
      onFinished === null || onFinished === void 0 ? void 0 : onFinished();
    }
  }, [canSliding, loop, index, dataInfo, onScrollBegin, handlerOffsetX, size, scrollWithTiming, currentFixedPage]);
  const prev = React.useCallback(function () {
    let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const {
      count = 1,
      animated = true,
      onFinished
    } = opts;
    if (!canSliding() || !loop && index.value <= 0) return;
    onScrollBegin === null || onScrollBegin === void 0 ? void 0 : onScrollBegin();
    const prevPage = currentFixedPage() - count;
    index.value = prevPage;

    if (animated) {
      handlerOffsetX.value = scrollWithTiming(-prevPage * size, onFinished);
    } else {
      handlerOffsetX.value = -prevPage * size;
      onFinished === null || onFinished === void 0 ? void 0 : onFinished();
    }
  }, [canSliding, loop, index, onScrollBegin, handlerOffsetX, size, scrollWithTiming, currentFixedPage]);
  const to = React.useCallback(opts => {
    const {
      i,
      animated = false,
      onFinished
    } = opts;
    if (i === index.value) return;
    if (!canSliding()) return;
    onScrollBegin === null || onScrollBegin === void 0 ? void 0 : onScrollBegin();
    const offset = handlerOffsetX.value + (index.value - i) * size;

    if (animated) {
      index.value = i;
      handlerOffsetX.value = scrollWithTiming(offset, onFinished);
    } else {
      handlerOffsetX.value = offset;
      index.value = i;
      onFinished === null || onFinished === void 0 ? void 0 : onFinished();
    }
  }, [index, canSliding, onScrollBegin, handlerOffsetX, size, scrollWithTiming]);
  const scrollTo = React.useCallback(function () {
    let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const {
      index: i,
      count,
      animated = false,
      onFinished
    } = opts;

    if (typeof i === 'number' && i > -1) {
      to({
        i,
        animated,
        onFinished
      });
      return;
    }

    if (!count) {
      return;
    }

    const n = Math.round(count);

    if (n < 0) {
      prev({
        count: Math.abs(n),
        animated,
        onFinished
      });
    } else {
      next({
        count: n,
        animated,
        onFinished
      });
    }
  }, [prev, next, to]);
  return {
    next,
    prev,
    scrollTo,
    getCurrentIndex,
    getSharedIndex: () => sharedIndex.current
  };
}
//# sourceMappingURL=useCarouselController.js.map