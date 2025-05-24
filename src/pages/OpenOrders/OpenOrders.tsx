import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { api } from '../../service/api';

interface Order {
  id: string;
  table: number;
  items: any[];
}

const OpenOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTable, setNewTable] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (err) {
      setError('Erro ao buscar pedidos.');
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (order_id: string, table: number) => {
    if (!table) return;

    try {
      await api.put('/order/update', { order_id, table });
      setEditingId(null);
      fetchOrders();
    } catch (err) {
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
              </>
            ) : (
              <>
                <Text style={styles.orderText}>Mesa: {item.table}</Text>
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
  },
  orderText: {
    color: '#FFF',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#1d1d2e',
    borderColor: '#3fffa3',
    borderWidth: 1,
    borderRadius: 5,
    color: '#FFF',
    padding: 8,
    marginTop: 8,
  },
  editButton: {
    marginTop: 10,
    backgroundColor: '#3fffa3',
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
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
  },
  saveText: {
    color: '#FFF',
    fontWeight: 'bold',
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
});

export default OpenOrders;
