import { computedFillDataWithAutoFillData } from '@/utils/computedWithAutoFillData';
import React from 'react';
export function useInitProps(props) {
  var _props$enableSnap;

  const {
    defaultIndex = 0,
    data: rawData = [],
    loop = true,
    enabled = true,
    autoPlayInterval: _autoPlayInterval = 1000,
    scrollAnimationDuration = 500,
    style = {},
    panGestureHandlerProps = {},
    pagingEnabled = true,
    autoFillData = true,
    snapEnabled = (_props$enableSnap = props.enableSnap) !== null && _props$enableSnap !== void 0 ? _props$enableSnap : true,
    width: _width,
    height: _height
  } = props;
  const width = Math.round(_width || 0);
  const height = Math.round(_height || 0);
  const autoPlayInterval = Math.max(_autoPlayInterval, 0);
  const data = React.useMemo(() => computedFillDataWithAutoFillData({
    loop,
    autoFillData,
    data: rawData,
    dataLength: rawData.length
  }), [rawData, loop, autoFillData]);

  if (props.mode === 'vertical-stack' || props.mode === 'horizontal-stack') {
    var _props$modeConfig$sho, _props$modeConfig;

    if (!props.modeConfig) {
      props.modeConfig = {};
    }

    props.modeConfig.showLength = (_props$modeConfig$sho = (_props$modeConfig = props.modeConfig) === null || _props$modeConfig === void 0 ? void 0 : _props$modeConfig.showLength) !== null && _props$modeConfig$sho !== void 0 ? _props$modeConfig$sho : data.length - 1;
  }

  return { ...props,
    defaultIndex,
    autoFillData,
    data,
    rawData,
    loop,
    enabled,
    autoPlayInterval,
    scrollAnimationDuration,
    style,
    panGestureHandlerProps,
    pagingEnabled,
    snapEnabled,
    width,
    height
  };
}
//# sourceMappingURL=useInitProps.js.map