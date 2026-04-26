import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Todos</h1>
      <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem' }}>
        {todos?.map((todo) => (
          <li key={todo.id} style={{ marginBottom: '0.5rem' }}>{todo.name}</li>
        ))}
      </ul>
      {!todos?.length && <p>No todos found. Add some in your Supabase dashboard!</p>}
    </div>
  )
}
