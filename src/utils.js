import { addItem } from './store/marketSlice'

export const statusColor = { Pending: 'warning', Accepted: 'primary', Rejected: 'danger', 'In Progress': 'info', Completed: 'success', Cancelled: 'secondary' }

export function getRating(reviews, providerId) {
  const list = reviews.filter((r) => r.providerId === providerId)
  const total = list.reduce((sum, r) => sum + r.rating, 0)
  return { avg: list.length ? Math.round((total / list.length) * 10) / 10 : 0, count: list.length }
}

export const stars = (n) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n))

export function notify(dispatch, userId, message) {
  dispatch(addItem({ collection: 'notifications', data: { userId, message, date: new Date().toLocaleString() } }))
}
