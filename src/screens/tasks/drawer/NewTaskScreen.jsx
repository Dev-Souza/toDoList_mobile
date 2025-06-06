import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { TextInput, Button, HelperText, Text, Menu } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import ActivityIndicatorComponent from '../../../components/ActivityIndicadorComponent';
import toDoListService from '../../../services/toDoListService';

const STATUS_OPTIONS = ['CONCLUIDA', 'PENDENTE', 'EM_ANDAMENTO', 'CANCELADA'];
const PRIORITY_OPTIONS = ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'];

const validationSchema = Yup.object().shape({
  titleTask: Yup.string().required('Título é obrigatório'),
  descriptionTask: Yup.string().required('Descrição é obrigatória'),
  statusTask: Yup.string().required('Status é obrigatório'),
  priorityTask: Yup.string().required('Prioridade é obrigatória'),
  dateLimit: Yup.string().required('Data limite é obrigatória'),
});

export default function NewTaskScreen() {
  // State the loading
  const [activityIndicator, setActivityIndicator] = useState(false)

  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [priorityMenuVisible, setPriorityMenuVisible] = useState(false);

  const openStatusMenu = () => setStatusMenuVisible(true);
  const closeStatusMenu = () => setStatusMenuVisible(false);
  const openPriorityMenu = () => setPriorityMenuVisible(true);
  const closePriorityMenu = () => setPriorityMenuVisible(false);

  const createTask = async (values) => {
    try {
      const response = await toDoListService.post()
    } catch (error) {

    }
  }

  // Chamando o LOADING
  if (activityIndicator) {
    return <ActivityIndicatorComponent />
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nova Tarefa</Text>
      <Formik
        initialValues={{
          titleTask: '',
          descriptionTask: '',
          statusTask: '',
          priorityTask: '',
          dateLimit: '',
          user: '',
          category: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          createTask(values)
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
          <View>
            <TextInput
              label="Título"
              mode="outlined"
              left={<TextInput.Icon icon={() => <Ionicons name="clipboard-outline" size={20} />} />}
              value={values.titleTask}
              onChangeText={handleChange('titleTask')}
              onBlur={handleBlur('titleTask')}
              error={touched.titleTask && !!errors.titleTask}
              style={styles.input}
            />
            <HelperText type="error" visible={touched.titleTask && !!errors.titleTask}>
              {errors.titleTask}
            </HelperText>

            <TextInput
              label="Descrição"
              mode="outlined"
              multiline
              left={<TextInput.Icon icon={() => <Ionicons name="document-text-outline" size={20} />} />}
              value={values.descriptionTask}
              onChangeText={handleChange('descriptionTask')}
              onBlur={handleBlur('descriptionTask')}
              error={touched.descriptionTask && !!errors.descriptionTask}
              style={styles.input}
            />
            <HelperText type="error" visible={touched.descriptionTask && !!errors.descriptionTask}>
              {errors.descriptionTask}
            </HelperText>

            {/* Select Status */}
            <Menu
              visible={statusMenuVisible}
              onDismiss={closeStatusMenu}
              anchor={
                <TextInput
                  label="Status"
                  mode="outlined"
                  value={values.statusTask}
                  onFocus={openStatusMenu}
                  showSoftInputOnFocus={false}
                  left={<TextInput.Icon icon="flag-outline" />}
                  style={styles.input}
                />
              }
            >
              {STATUS_OPTIONS.map((option) => (
                <Menu.Item
                  key={option}
                  onPress={() => {
                    setFieldValue('statusTask', option);
                    closeStatusMenu();
                  }}
                  title={option}
                />
              ))}
            </Menu>
            <HelperText type="error" visible={touched.statusTask && !!errors.statusTask}>
              {errors.statusTask}
            </HelperText>

            {/* Select Prioridade */}
            <Menu
              visible={priorityMenuVisible}
              onDismiss={closePriorityMenu}
              anchor={
                <TextInput
                  label="Prioridade"
                  mode="outlined"
                  value={values.priorityTask}
                  onFocus={openPriorityMenu}
                  showSoftInputOnFocus={false}
                  left={<TextInput.Icon icon="alert-circle-outline" />}
                  style={styles.input}
                />
              }
            >
              {PRIORITY_OPTIONS.map((option) => (
                <Menu.Item
                  key={option}
                  onPress={() => {
                    setFieldValue('priorityTask', option);
                    closePriorityMenu();
                  }}
                  title={option}
                />
              ))}
            </Menu>
            <HelperText type="error" visible={touched.priorityTask && !!errors.priorityTask}>
              {errors.priorityTask}
            </HelperText>

            <TextInput
              label="Data Limite (YYYY-MM-DD)"
              mode="outlined"
              left={<TextInput.Icon icon="calendar-outline" />}
              value={values.dateLimit}
              onChangeText={handleChange('dateLimit')}
              onBlur={handleBlur('dateLimit')}
              error={touched.dateLimit && !!errors.dateLimit}
              style={styles.input}
            />
            <HelperText type="error" visible={touched.dateLimit && !!errors.dateLimit}>
              {errors.dateLimit}
            </HelperText>

            {/* Hidden fields */}
            <TextInput value={String(values.user)} style={{ display: 'none' }} />
            <TextInput value={String(values.category)} style={{ display: 'none' }} />

            <Button mode="contained" onPress={handleSubmit} style={styles.button}>
              Criar Tarefa
            </Button>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 20,
  },
});