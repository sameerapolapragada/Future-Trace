import { useFocusEffect } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useCallback, useRef, type ReactNode } from 'react'
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from './AppText'
import { AuthLogoEntrance } from './AuthLogoEntrance'
import { horizon } from '../theme/colors'
import { type as appType } from '../theme/typography'

const SPRING_SNAPPY = { friction: 7, tension: 72, useNativeDriver: true as const }

type AuthScreenLayoutProps = {
  children: ReactNode
  subtitle?: string
  footer?: ReactNode
}

export function AuthScreenLayout({ children, subtitle, footer }: AuthScreenLayoutProps) {
  const headerTranslateY = useRef(new Animated.Value(40)).current
  const contentTranslateY = useRef(new Animated.Value(56)).current

  const runContentEntrance = useCallback(() => {
    headerTranslateY.setValue(40)
    contentTranslateY.setValue(56)

    Animated.stagger(120, [
      Animated.spring(headerTranslateY, { toValue: 0, ...SPRING_SNAPPY }),
      Animated.spring(contentTranslateY, { toValue: 0, ...SPRING_SNAPPY }),
    ]).start()
  }, [contentTranslateY, headerTranslateY])

  useFocusEffect(
    useCallback(() => {
      runContentEntrance()
    }, [runContentEntrance])
  )

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView
            bounces
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.page}>
              <View style={styles.brandBlock}>
                <AuthLogoEntrance />
                <Animated.View style={{ transform: [{ translateY: headerTranslateY }] }}>
                  <Text style={styles.title}>Future Trace</Text>
                  {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
                </Animated.View>
              </View>

              <Animated.View style={{ transform: [{ translateY: contentTranslateY }] }}>
                {children}
                {footer ? <View style={styles.footer}>{footer}</View> : null}
              </Animated.View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: horizon.background,
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  page: {
    width: '100%',
    maxWidth: 380,
    alignSelf: 'center',
  },
  brandBlock: {
    alignItems: 'center',
    marginBottom: 28,
    paddingTop: 8,
    overflow: 'visible',
  },
  title: {
    ...appType.bold,
    color: horizon.textPrimary,
    fontSize: 24,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    ...appType.medium,
    marginTop: 6,
    color: horizon.textSecondary,
    fontSize: 15,
    textAlign: 'center',
  },
  footer: {
    marginTop: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
})
