import { AuthForm } from '../../components/AuthForm'
import { AuthScreenLayout } from '../../components/AuthScreenLayout'

export default function SignUpScreen() {
  return (
    <AuthScreenLayout>
      <AuthForm initialMode="signup" />
    </AuthScreenLayout>
  )
}
