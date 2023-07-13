import { Text } from "@immotech-component/text";
import { COLOR_X } from "@immotech-feature/theme";
import NetInfo from "@react-native-community/netinfo";
import { Spacer } from 'native-x-spacer';
import { Spinner } from 'native-x-spinner';
import { Stack } from 'native-x-stack';
import { COLOR } from 'native-x-theme';
import React from 'react';

export const OfflineHeader = () => {
    const [isConnected, setIsConnected] = React.useState(true);

    React.useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsConnected(state.isConnected as boolean);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return !isConnected ? (
     
            <Stack backgroundColor={isConnected ? COLOR.SUCCESS : COLOR.ERROR} alignCenter alignMiddle horizontal padding={["vertical:small"]}>
                <Text textColor={COLOR_X.BLACK} alignCenter>You're currently offline</Text>
                <Spacer size="x-small"/>
                <Spinner color={COLOR.PRIMARY}/>
            </Stack>
           
            ) : null;
};
