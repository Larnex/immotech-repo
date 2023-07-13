import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    TouchableOpacity,
    TouchableOpacityProps,
    Text,
    StyleSheet,
} from 'react-native';

interface AnimatedButtonProps extends TouchableOpacityProps {
    label: string;
    delay?: number;
    isClosing?: boolean;
    style?: any;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    label,
    delay = 0,
    style,
    isClosing,
    ...props
}) => {
    const scale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.timing(scale, {
            toValue: isClosing ? 1 : 0,
            duration: 350,
            easing: Easing.out(Easing.cubic),
            delay,
            useNativeDriver: true,
        });

        animation.start();


        return () => {
            animation.stop();
        };
    }, [scale, delay, isClosing]);


    const animatedStyle = {
        transform: [{ scale }],
    };


    return (
        <Animated.View style={[styles.buttonContainer, animatedStyle]}>
            <TouchableOpacity style={[styles.button, style]} {...props}>
                <Text style={styles.buttonText}>{label}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        overflow: 'hidden',
        marginBottom: 10,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 5, backgroundColor: '#007AFF',
    },
    buttonText: {
        color: 'white', fontSize: 16,
    },
});
