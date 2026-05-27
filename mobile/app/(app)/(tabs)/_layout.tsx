import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { type ColorValue } from 'react-native'
import { colors } from '../../../theme/colors'
import { type as appType } from '../../../theme/typography'

function ScoreTabIcon({ focused, color, size }: { focused: boolean; color: ColorValue; size: number }) {
  return (
    <Ionicons
      name={focused ? 'disc' : 'disc-outline'}
      size={size}
      color={focused ? colors.title : color}
    />
  )
}

function HomeTabIcon({ focused, color, size }: { focused: boolean; color: ColorValue; size: number }) {
  return (
    <Ionicons
      name={focused ? 'home' : 'home-outline'}
      size={size}
      color={focused ? colors.title : color}
    />
  )
}

function TimelineTabIcon({ focused, color, size }: { focused: boolean; color: ColorValue; size: number }) {
  return (
    <Ionicons
      name={focused ? 'time' : 'time-outline'}
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
          title: 'Timeline',
          tabBarIcon: ({ focused, color, size }) => (
            <TimelineTabIcon focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="score"
        options={{
          title: 'Score',
          tabBarIcon: ({ focused, color, size }) => (
            <ScoreTabIcon focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
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
