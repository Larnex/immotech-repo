import { EmptyMessage } from "@immotech-component/data-view";
import { ThreeDModels } from "@immotech-feature/property-api";
import { COLOR_X } from "@immotech-feature/theme";
import { FilterIcon } from "native-x-icon";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import React, { useEffect } from "react";
import { WebView } from "react-native-webview";
import { Dimensions } from "react-native";

const height = Dimensions.get('screen').height;
interface Props {
  data: ThreeDModels[];
  onFilterIconTap?: () => void;
  type?: "outdoor" | "outdoorthermo" | "technical" | "indoor";
  timestamp?: number;
}

const ThreeDView = ({ data, onFilterIconTap, type, timestamp }: Props) => {
  const filterMethods = [
    (item: ThreeDModels) => (type ? item.type === type : item),
    (item: ThreeDModels) => (timestamp ? item.timestamp === timestamp : item),
  ];

  const [filteredData, setFilteredData] = React.useState<ThreeDModels[]>(data);
  useEffect(() => {
    const filteredArray = (data ?? []).reduce(
      (accumulator: ThreeDModels[], currentItem: ThreeDModels) => {
        for (let i = 0; i < filterMethods.length; i++) {
          if (!filterMethods[i](currentItem)) {
            return accumulator;
          }
        }
        return [...accumulator, currentItem];
      },
      []
    );

    setFilteredData(filteredArray);
  }, [type, timestamp]);

  const renderHeader = React.useCallback(() => {
    return <Header onFilter={onFilterIconTap} />;
  }, [onFilterIconTap]);

  function Header({ onFilter }: { onFilter?: () => void }) {
    return (
      <Stack padding="normal" fillHorizontal alignRight>
        <>
          <Tappable onTap={onFilter}>
            <FilterIcon color={COLOR_X.SECONDARY} />
          </Tappable>
        </>
      </Stack>
    );
  }



  return (
    <>
      {renderHeader()}
      {filteredData.length !== 0 ? (
        <WebView
          source={{
            uri: filteredData[0].url ? filteredData[0].url : data[0].url,
          }}
          style={{ minWidth: "100%", minHeight: height - 300 }}
        />
      ) : (
        <EmptyMessage title="No 3D Models">No 3d Models</EmptyMessage>
      )}
    </>
  );
};

export default ThreeDView;
