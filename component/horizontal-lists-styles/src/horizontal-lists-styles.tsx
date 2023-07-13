import DeviceInfo from "react-native-device-info";
import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const isTabletDevice = DeviceInfo.isTablet();

const scaledLineHeight = (fontSize: number) => {
    const lineHeightScaleFactor = 1.2;
    return fontSize * lineHeightScaleFactor;
};

export const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 5
    },
    header: {
        flexDirection: 'row',
        // justifyContent: 'flex-end',
    },
    seeAllButton: {
        paddingVertical: moderateScale(10),
    },
    seeAllText: {
        color: '#6C63FF',
        fontWeight: 'bold',
        fontSize: moderateScale(14),
        lineHeight: scaledLineHeight(moderateScale(14))
    },
    sideText: {
        fontSize: moderateScale(12),
        lineHeight: scaledLineHeight(moderateScale(14))
    },
    item: {
        backgroundColor: "#fff",
        borderRadius: 8,
        // padding: 16,
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 5,
        width: isTabletDevice ? wp('40%') : wp('60%'),
        height: "auto",
        marginRight: isTabletDevice ? wp('2%') : wp('4%'),
        // marginRight: 16,
    },
    imageTextContainer: {
        position: 'absolute',
        top: moderateScale(8),
        left: moderateScale(8),
        backgroundColor: 'transparent',
        // borderRadius: 4,
        borderRadius: moderateScale(4),
    },
    imageText: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        padding: moderateScale(6),
        fontSize: moderateScale(14),
        lineHeight: scaledLineHeight(moderateScale(14))
    },
    imageTextUnits: {
        fontSize: moderateScale(14),
        lineHeight: scaledLineHeight(moderateScale(14)),
        color: "#444"
    },
    imageTextContainerUnits: {
        marginTop: moderateScale(8),
        borderRadius: moderateScale(4),
        backgroundColor: '#E0E0E0',
        paddingHorizontal: moderateScale(8),
        paddingVertical: moderateScale(4),
        marginBottom: moderateScale(8),
    },
    itemImageContainer: {
        position: 'relative',
        width: isTabletDevice ? wp('40%') : wp('60%'),
        height: isTabletDevice ? hp('15%') : hp('25%'),
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        backgroundColor: '#ddd',
        overflow: 'hidden',
    },
    itemImage: {
        width: "100%",
        height: "100%",
        backgroundColor: "#aaa",
    },
    itemDetails: {
        // flex: 1,
        // maxHeight: hp('10%'),
        padding: moderateScale(10),
        width: "100%",
        height: "auto"
    },
    titleBackground: {
        borderRadius: moderateScale(4),
        padding: moderateScale(8),
        marginBottom: moderateScale(8),
        alignItem: "center",
        justifyContent: "center"
    },
    itemTitle: {
        // fontSize: 18,
        marginBottom: moderateScale(8),
        fontSize: moderateScale(16),
        lineHeight: scaledLineHeight(moderateScale(16))
    },
    todoItemTitle: {
        fontSize: moderateScale(16),
        lineHeight: scaledLineHeight(moderateScale(16))
    },
    itemSubtitle: {
        fontSize: moderateScale(14),
        fontWeight: "400",
        color: "#666",
        marginBottom: moderateScale(8),
        lineHeight: scaledLineHeight(moderateScale(14))
    },
    itemParentInfo: {
        fontSize: moderateScale(14),
        fontWeight: "bold",
        marginBottom: moderateScale(4),
        lineHeight: scaledLineHeight(moderateScale(14))
    },
    itemDescription: {
        color: "#888",
        marginBottom: moderateScale(8),
        fontSize: moderateScale(12),
        lineHeight: scaledLineHeight(moderateScale(14))
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
        padding: moderateScale(2),
        paddingHorizontal: moderateScale(8),
        borderRadius: moderateScale(4),
    },




});