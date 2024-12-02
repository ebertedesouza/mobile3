import React, { useContext } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

import AppRoutes from "./app.routes";
import AuthRoutes from "./auth.routes";

import { AuthContext } from "../contexts/AuthContext";

function Routes() {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size={90} color="#F5f7fb" />
            </View>
        );
    }

    return isAuthenticated ? <AppRoutes /> : <AuthRoutes />;
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: '#1D1D2E',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Routes;
