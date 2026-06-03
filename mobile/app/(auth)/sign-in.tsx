import { AuthForm } from '../../components/AuthForm'
import { AuthScreenLayout } from '../../components/AuthScreenLayout'

export default function SignInScreen() {
  return (
    <AuthScreenLayout>
      <AuthForm initialMode="signin" />
    </AuthScreenLayout>
  )
}
