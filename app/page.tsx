import { getServerSession } from "next-auth"
import { SignIn, SignOut } from "./components/AuthButtons/AuthButtons"
import Form from "./components/Form/Form"

export default async function Home() {
  // DONT ADD authOption INTO THE getServerSession OPTIONS
  const session = await getServerSession()
  if (!session) console.log('no user')
  return (
    <main>
      <pre>{JSON.stringify(session)}</pre>
      <SignIn />
      <SignOut />
      <Form method="PATCH"/>
    </main>
  )
}
