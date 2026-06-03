import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { type ColorValue } from 'react-native'
import { colors } from '../../../theme/colors'
import { horizon } from '../../../theme/colors'
import { type as appType } from '../../../theme/typography'

function HomeTabIcon({ focused, color, size }: { focused: boolean; color: ColorValue; size: number }) {
  return (
    <Ionicons
      name={focused ? 'home' : 'home-outline'}
      size={size}
      color={focused ? colors.title : color}
    />
  )
}

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0B0E14',
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.title,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          ...appType.semibold,
          fontSize: 11,
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            <HomeTabIcon focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="score"
        options={{
          title: 'Shield',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'shield' : 'shield-outline'}
              size={size}
              color={focused ? horizon.accent : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
