/**
 * The visitor's running list of products they want to hear about. Filled
 * from the "Add to Interests" button on each product page, reviewed and
 * submitted in one go from the inquiry sheet. Lives for one visit: cleared
 * after a successful submit and when the kiosk idles back to the attract
 * screen.
 */

/** id → { id, name }, in the order they were added. */
const items = new Map()
const listeners = new Set()

function emit() {
  const list = interests.list()
  for (const fn of listeners) fn(list)
}

export const interests = {
  list() {
    return [...items.values()]
  },

  get count() {
    return items.size
  },

  has(id) {
    return items.has(id)
  },

  add(product) {
    if (items.has(product.id)) return
    items.set(product.id, { id: product.id, name: product.name })
    emit()
  },

  remove(id) {
    if (items.delete(id)) emit()
  },

  /** Returns true when the product ended up in the list. */
  toggle(product) {
    if (items.has(product.id)) {
      interests.remove(product.id)
      return false
    }
    interests.add(product)
    return true
  },

  clear() {
    if (!items.size) return
    items.clear()
    emit()
  },

  /** Call `fn(list)` on every change. Returns an unsubscribe function. */
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
}
