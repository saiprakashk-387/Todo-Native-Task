import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import IonIcon from 'react-native-vector-icons'
import Toast from "../components/Toast";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [toastVisible, setToastVisible] = useState(false);
    const navigation = useNavigation()

    const handleSubmit = () => {
        let userData = {
            email: "test@test.com",
            password: "123456"
        }
        if (userData.email == email && userData.password == password) {
            navigation.navigate("Home")
        } else {
            setToastVisible(true)
        }

    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Get Started</Text>

            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Password</Text>

                <View style={styles.passwordRow}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Enter Password"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <Toast
                visible={toastVisible}
                message="Invalid Credentials"
                onHide={() => setToastVisible(false)}
                icon="info-outline"
                color="red"
            />
        </View>
    );
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 30,
    },
    inputWrapper: {
        marginBottom: 18,
    },
    label: {
        fontSize: 14,
        marginBottom: 6,
        color: "#000",
    },
    input: {
        height: 45,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 15,
        backgroundColor: "#fff",
    },
    passwordRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    eyeButton: {
        paddingHorizontal: 10,
    },
    eyeText: {
        color: "#007AFF",
        fontSize: 14,
        fontWeight: "600",
    },
    button: {
        backgroundColor: "#007AFF",
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "600",
        fontSize: 16,
    },
});
