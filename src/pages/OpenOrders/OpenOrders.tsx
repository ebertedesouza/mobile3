import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { api } from '../../service/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Item {
  id: string;
  product_id: string;
  amount: number;
  product: {
    name: string;
  };
}

interface Order {
  id: string;
  table: number;
  items: Item[];
}

const OpenOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTable, setNewTable] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem('@santanapizzaria');
      const user = userData ? JSON.parse(userData) : null;

      if (!user?.token) return;

      const response = await api.get('/orders', {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setOrders(response.data);
      setError(null);
    } catch {
      setError('Erro ao buscar pedidos.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetail = async (order_id: string) => {
    try {
      const userData = await AsyncStorage.getItem('@santanapizzaria');
      const user = userData ? JSON.parse(userData) : null;

      if (!user?.token) return;

      const response = await api.get('/order/detail', {
        headers: { Authorization: `Bearer ${user.token}` },
        params: { order_id },
      });

      setSelectedOrder(response.data);
      setModalVisible(true);
    } catch {
      setError('Erro ao buscar detalhes do pedido.');
    }
  };

  const updateOrder = async (order_id: string, table: number) => {
    if (!table) return;
    try {
      const userData = await AsyncStorage.getItem('@santanapizzaria');
      const user = userData ? JSON.parse(userData) : null;

      if (!user?.token) return;

      await api.put(
        '/order/update',
        { order_id, table },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setEditingId(null);
      fetchOrders();
    } catch {
      setError('Erro ao atualizar mesa.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3fffa3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedidos em Aberto</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            {editingId === item.id ? (
              <>
                <TextInput
                  value={newTable}
                  onChangeText={setNewTable}
                  keyboardType="numeric"
                  placeholder="Novo número"
                  placeholderTextColor="#CCC"
                  style={styles.input}
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => updateOrder(item.id, Number(newTable))}
                >
                  <Text style={styles.saveText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setEditingId(null)}
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.tableButton}
                  onPress={() => fetchOrderDetail(item.id)}
                >
                  <Text style={styles.orderText}>Mesa: {item.table}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    setEditingId(item.id);
                    setNewTable(String(item.table));
                  }}
                >
                  <Text style={styles.editText}>Editar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Itens do Pedido - Mesa {selectedOrder?.table}</Text>
            <ScrollView>
              {selectedOrder?.items.length ? (
                selectedOrder.items.map((item) => (
                  <View key={item.id} style={styles.itemContainer}>
                    <Text style={styles.itemText}>
                      {item.product.name} - Quantidade: {item.amount}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noItemsText}>Nenhum item neste pedido.</Text>
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1d1d2e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  orderItem: {
    backgroundColor: '#101026',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderText: {
    color: '#FFF',
    fontSize: 16,
  },
  tableButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#3fffa3',
    borderRadius: 4,
  },
  input: {
    backgroundColor: '#1d1d2e',
    borderColor: '#3fffa3',
    borderWidth: 1,
    borderRadius: 5,
    color: '#FFF',
    padding: 8,
    marginTop: 8,
    flex: 1,
  },
  editButton: {
    marginLeft: 10,
    backgroundColor: '#3fffa3',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  editText: {
    color: '#101026',
    fontWeight: 'bold',
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: '#32cd32',
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
    flex: 1,
  },
  saveText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 10,
    marginLeft: 10,
    backgroundColor: '#ff3333',
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
    flex: 1,
  },
  cancelText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1d1d2e',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1d1d2e',
  },
  errorText: {
    color: 'red',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#101026',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
  },
  itemContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  itemText: {
    color: '#FFF',
    fontSize: 16,
  },
  noItemsText: {
    color: '#AAA',
    fontStyle: 'italic',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#3fffa3',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeText: {
    color: '#101026',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OpenOrders;
