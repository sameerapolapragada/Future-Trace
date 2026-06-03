import { Redirect } from 'expo-router'

/** Opens the marketing explore experience (drawer + web-aligned sections). */
export default function Index() {
  return <Redirect href="/(explore)/" />
}
