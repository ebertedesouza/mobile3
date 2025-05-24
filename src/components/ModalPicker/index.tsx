import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native';

import { CategoryProps } from '../../pages/Order';

interface ModalPickerProps {
  options: CategoryProps[]; // Certifique-se de que esta seja uma lista de objetos
  handleCloseModal: () => void;
  selectedItem: (item: CategoryProps) => void;
}

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

export function ModalPicker({ options, handleCloseModal, selectedItem }: ModalPickerProps) {

  function onPressItem(item: CategoryProps) {
    selectedItem(item);
    handleCloseModal();
  }

  // Verifique se 'options' é um array antes de usar o .map
  if (!Array.isArray(options)) {
    console.error('Options não é um array:', options);
    return null; // Retorna null se 'options' não for um array válido
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handleCloseModal}>
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {options.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={() => onPressItem(item)}
            >
              <Text style={styles.item}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)', // Tela semi-transparente
  },
  content: {
    width: WIDTH - 40,
    height: HEIGHT / 2,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#8a8a8a',
    borderRadius: 4,
  },
  option: {
    borderBottomWidth: 0.8,
    borderBottomColor: '#8a8a8a',
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  item: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#101026',
  },
});
