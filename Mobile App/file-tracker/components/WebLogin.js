import React, { useState, useEffect } from "react";
import { IconButton, Subheading, Button } from "react-native-paper";
import { View, ImageBackground, StatusBar, StyleSheet } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import config from "../config";

export default function WebLogin(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    let url = config.ip + "/webapp/login/scan?qr=" + data;
    fetch(url, { method: "GET" })
      .then((response) => response.json())
      .then(({ success }) => {
        if (success) alert("Logged in!");
        else alert("Error! Please try again.");
      })
      .catch(() => alert("Error! Please try again."));
  };

  return (
    <ImageBackground
      style={{ flex: 1, resizeMode: "cover" }}
      source={require("../assets/white_bg.png")}
      resizeMode={"cover"}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
          paddingTop: "5%",
        }}
      >
        <IconButton
          icon="menu"
          color="black"
          size={30}
          style={{
            position: "absolute",
            top: 1 * StatusBar.currentHeight,
            left: 4,
          }}
          onPress={props.navigation.openDrawer}
        />

        {!hasPermission && (
          <Subheading style={{ color: "rgb(176, 1, 1)" }}>
            Camera permission not granted!
          </Subheading>
        )}
        {hasPermission && (
          <>
            {!scanned && <Subheading>Scan the QR code to login</Subheading>}
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={{
                width: "80%",
                height: "60%",
              }}
            />
            {scanned && (
              <Button
                icon="replay"
                style={{
                  width: "50%",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "4%",
                  paddingVertical: "1%",
                }}
                mode="contained"
                color="black"
                onPress={() => setScanned(false)}
              >
                Scan again
              </Button>
            )}
          </>
        )}
      </View>
    </ImageBackground>
  );
}
