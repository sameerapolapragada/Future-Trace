import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

type Props = { children: ReactNode }
type State = { error: Error | null }

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('AppErrorBoundary', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.screen}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message}>{this.state.error.message}</Text>
          </ScrollView>
        </View>
      )
    }
    return this.props.children
  }
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' },
  content: { padding: 24, paddingTop: 48 },
  title: { color: '#F8FAFC', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  message: { color: '#94A3B8', fontSize: 14, lineHeight: 20 },
})
