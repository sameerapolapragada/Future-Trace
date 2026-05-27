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
import { ScreenBackground } from './ScreenBackground'
import { colors } from '../theme/colors'
import { type as appType } from '../theme/typography'

const SPRING_SNAPPY = { friction: 7, tension: 72, useNativeDriver: true as const }
const SPRING_BOUNCY = { friction: 6, tension: 88, useNativeDriver: true as const }

type AuthScreenLayoutProps = {
  subtitle: string
  children: ReactNode
  afterCard?: ReactNode
  footer?: ReactNode
}

export function AuthScreenLayout({ subtitle, children, afterCard, footer }: AuthScreenLayoutProps) {
  const headerTranslateY = useRef(new Animated.Value(40)).current
  const cardTranslateY = useRef(new Animated.Value(72)).current
  const cardScale = useRef(new Animated.Value(0.9)).current
  const extraTranslateY = useRef(new Animated.Value(56)).current

  const runContentEntrance = useCallback(() => {
    headerTranslateY.setValue(40)
    cardTranslateY.setValue(72)
    cardScale.setValue(0.9)
    extraTranslateY.setValue(56)

    Animated.stagger(120, [
      Animated.spring(headerTranslateY, { toValue: 0, ...SPRING_SNAPPY }),
      Animated.parallel([
        Animated.spring(cardTranslateY, { toValue: 0, ...SPRING_SNAPPY }),
        Animated.spring(cardScale, { toValue: 1, ...SPRING_BOUNCY }),
      ]),
      Animated.spring(extraTranslateY, { toValue: 0, ...SPRING_SNAPPY }),
    ]).start()
  }, [cardScale, cardTranslateY, extraTranslateY, headerTranslateY])

  useFocusEffect(
    useCallback(() => {
      runContentEntrance()
    }, [runContentEntrance])
  )

  return (
    <ScreenBackground gradientColors={colors.homeGradient}>
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
                  <Text style={styles.subtitle}>{subtitle}</Text>
                </Animated.View>
              </View>

              <Animated.View
                style={{
                  transform: [{ translateY: cardTranslateY }, { scale: cardScale }],
                }}
              >
                <View style={styles.card}>{children}</View>
              </Animated.View>

              <Animated.View style={{ transform: [{ translateY: extraTranslateY }] }}>
                {afterCard ? <View style={styles.afterCard}>{afterCard}</View> : null}
                {footer ? <View style={styles.footer}>{footer}</View> : null}
              </Animated.View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenBackground>
  )
}

const styles = StyleSheet.create({
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
    color: colors.title,
    fontSize: 26,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    ...appType.medium,
    marginTop: 6,
    color: colors.subtitle,
    fontSize: 15,
    textAlign: 'center',
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 22,
  },
  afterCard: {
    marginTop: 28,
  },
  footer: {
    marginTop: 28,
    paddingTop: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
})
