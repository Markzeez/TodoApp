import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TasksProvider } from './src/context/TaskContext';
import { ThemeProvider, useThemeContext } from './src/context/ThemeContext';
import TaskListScreen from './src/screens/TaskListScreen';
import AddTaskScreen from './src/screens/AddTaskScreen';

export type RootStackParamList = {
  TaskList: undefined;
  AddTask: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNav() {
  const { theme } = useThemeContext();
  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="TaskList"
          component={TaskListScreen}
          options={{ title: 'To-Do' }}
        />
        <Stack.Screen
          name="AddTask"
          component={AddTaskScreen}
          options={{ title: 'Add Task' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TasksProvider>
        <AppNav />
      </TasksProvider>
    </ThemeProvider>
  );
}
