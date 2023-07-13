import React from "react";
import Spinner from "react-native-loading-spinner-overlay/lib";


export const LoadingBackUpSpinner = React.memo(function LoadingBackUpSpinner({ isLoading }: { isLoading: boolean }) {
    return <Spinner visible={isLoading} />;
});