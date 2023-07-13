import { StyleSheet } from "react-native";
import DeviceInfo from "react-native-device-info";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const isTabletDevice = DeviceInfo.isTablet();

const scaledLineHeight = (fontSize: number) => {
    const lineHeightScaleFactor = 1.2;
    return fontSize * lineHeightScaleFactor;
};

export const listStyles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#f8f8f8',
        // padding: 10,
        marginHorizontal: moderateScale(10),
        marginVertical: moderateScale(10),
        borderRadius: moderateScale(6),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: moderateScale(2) },
        shadowOpacity: 0.1,
        shadowRadius: moderateScale(4),
        elevation: moderateScale(3),
    },
    itemContainer: {
        flexDirection: 'row',
        // alignItems: 'center',
    },
    itemProperties: {
        color: "#888",
    },
    itemImage: {
        width: moderateScale(150),
        height: moderateScale(150),
        borderRadius: moderateScale(6),
    },
    imageText: {
        position: 'absolute',
        top: moderateScale(0),
        left: moderateScale(0),
        backgroundColor: 'rgba(0,0,0,0.68)',
        borderRadius: moderateScale(4),
        color: 'white',
        padding: moderateScale(4),
        fontSize: moderateScale(12),
        marginTop: moderateScale(10),
        marginLeft: moderateScale(10),
    },
    itemDetails: {
        flex: 1,
        marginLeft: moderateScale(10),
        marginTop: moderateScale(10)
    },
    itemTitle: {
        fontWeight: 'bold',
        fontSize: moderateScale(16),
        marginBottom: moderateScale(2),
        paddingTop: moderateScale(4)
    },
    itemSubtitle: {
        fontSize: moderateScale(14),
        color: '#666',
        marginBottom: moderateScale(2),
    },
    itemLocation: {
        flexDirection: 'row',
    },
    itemLocationText: {
        color: '#888',
        fontSize: moderateScale(12),
        marginRight: moderateScale(10),
    },
    overlayContainer: {
        position: 'absolute',
        top: moderateScale(5),
        left: moderateScale(5),
    },
    overlayText: {
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: moderateScale(1), height: moderateScale(1) },
        textShadowRadius: moderateScale(1),
        marginBottom: moderateScale(4),
        fontSize: moderateScale(12),
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: moderateScale(4),
        paddingHorizontal: moderateScale(8),
        borderRadius: moderateScale(4),
    },
    backgroundContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: moderateScale(2),
        paddingHorizontal: moderateScale(8),
        borderRadius: moderateScale(4),
        marginBottom: moderateScale(4),
    },
})