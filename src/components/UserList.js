import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { api } from './api'; 

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users'); 
        setUsers(response.data); 
      } catch (err) {
        setError('Erro ao buscar usuários');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()} 
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text> {}
          </View>
        )}
      />
    </View>
  );
};

export default UserList;
