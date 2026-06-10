import { type FormEvent, useEffect, useState } from 'react'
import { Trash2, UserPlus } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { usersApi, type AdminUser, type UserRole } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export function UsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'viewer' as UserRole,
  })

  async function load() {
    const res = await usersApi.list()
    setUsers(res.data)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    await usersApi.create(form)
    setShowForm(false)
    setForm({ name: '', email: '', password: '', role: 'viewer' })
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this user?')) return
    await usersApi.remove(id)
    load()
  }

  const canManage = currentUser?.role === 'admin' || currentUser?.role === 'manager'

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Users"
        description="Admin panel access — app end-users will sync here later"
        action={
          canManage ? (
            <button type="button" className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
              <UserPlus className="h-4 w-4" />
              Add User
            </button>
          ) : undefined
        }
      />

      {showForm && (
        <form onSubmit={handleCreate} className="card grid gap-4 md:grid-cols-2">
          <input
            className="input"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <select
            className="input"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="viewer">Viewer</option>
          </select>
          <button type="submit" className="btn btn-primary md:col-span-2">
            Create User
          </button>
        </form>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="table-head">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Role</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="table-row">
                <td className="py-3 font-medium text-text">{user.name}</td>
                <td className="py-3 text-muted">{user.email}</td>
                <td className="py-3 capitalize text-muted">{user.role}</td>
                <td className="py-3">
                  <span className={`badge ${user.active ? 'badge-green' : 'badge-red'}`}>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3">
                  {currentUser?.role === 'admin' && user.id !== currentUser.id && (
                    <button
                      type="button"
                      className="btn btn-danger px-3 py-1.5"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
