import { onUnmounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

export default function useBeforeUnload(override = () => false) {
  let isRegistered = false
  const triggerUnload = (event) => {
    if (override() === false) {
      event.preventDefault()
      event.returnValue = true
      return event
    }
  }

  const registerUnloadEvent = () => {
    if (isRegistered) return
    isRegistered = true
    window.addEventListener('beforeunload', triggerUnload)
  }

  onUnmounted(() => {
    window.removeEventListener('beforeunload', triggerUnload)
  })

  onBeforeRouteLeave(() => {
    if (isRegistered && override() === false) {
      const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
      if (!answer) return false
    }
  })

  return { registerUnloadEvent }
}
