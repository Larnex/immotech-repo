import { Text } from "@immotech-component/text";
import { changeLanguage } from "@immotech/util";
import { Stack } from "native-x-stack";
import { Tappable } from "native-x-tappable";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, StyleSheet } from "react-native";
import { useMutation } from "@immotech-feature/api";

export const LanguagePicker = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { i18n } = useTranslation(); //i18n instance

  const changeLanguageMutation = changeLanguage(i18n.language === 'de' ? 'en' : 'de');

  //array with all supported languages 
  const languages = [
    { name: "en", label: "English" },
    { name: "de", label: "Deutsch" },
  ];

  const LanguageItem = ({ name, label }: { name: string; label: string }) => (
    <Tappable
      style={styles.button}
      onTap={() => {
        i18n.changeLanguage(name); //changes the app language
        setModalVisible(!modalVisible);

        // Call the mutation when a language is selected
        changeLanguageMutation.mutate();
      }}
    >
      <Text fontSize={18} style={styles.textStyle}>
        {label}
      </Text>
    </Tappable>
  );

  return (
    <Stack>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <Stack style={styles.centeredView}>
          <Stack style={styles.modalView}>
            {languages.map((lang) => (
              <LanguageItem {...lang} key={lang.name} />
            ))}
          </Stack>
        </Stack>
      </Modal>
      <Tappable
        // style={[styles.button, styles.buttonOpen]}
        onTap={() => setModalVisible(true)}
      >
        <Text fontSize={22} style={styles.textStyle}>
          {i18n.language}
        </Text>
      </Tappable>
    </Stack>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  buttonOpen: {
    backgroundColor: "#f36293fd",
  },

  textStyle: {
    fontWeight: "bold",
    textAlign: "center",
  },
});

