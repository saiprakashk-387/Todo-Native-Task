import React, { useEffect } from "react";
import { Animated, Text, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const Toast = ({ visible, message, onHide, color = "#333", icon = "check-circle" }) => {
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => onHide());
            }, 2000);
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.toast, { opacity: fadeAnim, backgroundColor: color }]}>
            {/* Toast Row */}
            <View style={styles.row}>
                <Icon name={icon} size={22} color="#fff" style={{ marginRight: 10 }} />
                <Text style={styles.toastText}>{message}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    toast: {
        position: "absolute",
        bottom: 50,
        left: "10%",
        right: "10%",
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    toastText: {
        color: "#fff",
        fontSize: 15,
        flexShrink: 1,
    },
});

export default Toast;
