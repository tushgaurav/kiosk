import { el, icon } from './ui.js'

/**
 * On-screen keyboard for the inquiry form. The kiosk is touch-only and runs
 * full-screen, where the operating system's keyboard is unreliable at best,
 * so the form brings its own. Inputs opt out of the OS keyboard with
 * `inputmode="none"` and pick a layout with `data-kbd`:
 *
 *   text  – QWERTY with a number row; a `?#` layer for symbols. Fields with
 *           `autocapitalize="words"` get Shift armed at the start of a word.
 *   email – as text, with `@` and `.com` on the bottom row and no auto-caps.
 *   tel   – a number pad with `+`, `-` and space.
 *
 * The label of the Enter key comes from the input's `data-enter` (default
 * "Next"); pressing it calls `onEnter(input)` so the form can decide what
 * comes next. Keys act on `pointerdown` — no waiting for a click — and
 * cancel the event so the field keeps focus and its caret.
 */

const REPEAT_DELAY = 420
const REPEAT_EVERY = 55
/** Two Shift taps this close together lock caps. */
const DOUBLE_TAP_MS = 380

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

/** A key that types `text`; `w` is its width in grid units (default 2 of 20). */
const key = (text, w) => ({ text, label: esc(text), w })
/** A letter key: rendered upper or lower case as Shift dictates. */
const letter = (c, offset = false) => ({ text: c, label: c, letter: true, offset })
/** A key that does something other than type. */
const action = (name, label, w, extra = '') => ({ action: name, label, w, extra })

function textRows({ layer, kind, enterLabel }) {
  const backspace = action('backspace', icon('backspace'), 3, 'aria-label="Backspace"')
  const rows = [[...'1234567890'].map((c) => key(c))]

  if (layer === 'symbols') {
    rows.push([...'@#$%&*-+=_'].map((c) => key(c)))
    rows.push([...'()[]/\\:;\'"'].map((c) => key(c)))
    rows.push([action('layer', 'ABC', 3, 'aria-label="Letters"'), ...[...'!?,.<>|'].map((c) => key(c)), backspace])
  } else {
    rows.push([...'qwertyuiop'].map((c) => letter(c)))
    rows.push([...'asdfghjkl'].map((c, i) => letter(c, i === 0)))
    rows.push([action('shift', icon('shift'), 3, 'aria-label="Shift" aria-pressed="false"'), ...[...'zxcvbnm'].map((c) => letter(c)), backspace])
  }

  const bottom = [action('layer', layer === 'symbols' ? 'ABC' : '?#', 3, layer === 'symbols' ? 'aria-label="Letters"' : 'aria-label="Symbols"')]
  if (kind === 'email') bottom.push(key('@'), action('space', '', 7, 'aria-label="Space"'), key('.'), key('.com', 3))
  else bottom.push(key(','), action('space', '', 10, 'aria-label="Space"'), key('.'))
  bottom.push(action('enter', esc(enterLabel), 3))
  rows.push(bottom)
  return rows
}

function telRows({ enterLabel }) {
  return [
    [...'123'].map((c) => key(c)),
    [...'456'].map((c) => key(c)),
    [...'789'].map((c) => key(c)),
    [key('+'), key('0'), action('backspace', icon('backspace'), 2, 'aria-label="Backspace"')],
    [key('-'), action('space', '', 2, 'aria-label="Space"'), action('enter', esc(enterLabel), 2)],
  ]
}

function keyHtml(k) {
  const cls = ['key', k.action && `key--${k.action}`, k.letter && 'key--letter', k.offset && 'key--offset'].filter(Boolean).join(' ')
  const data = k.action ? `data-action="${k.action}"` : `data-text="${esc(k.text)}"`
  const width = k.w ? `style="--w:${k.w}"` : ''
  return `<button class="${cls}" type="button" tabindex="-1" ${data} ${width} ${k.extra ?? ''}>${k.label}</button>`
}

export function keyboard({ onEnter }) {
  const root = el(`<div class="kbd" role="group" aria-label="On-screen keyboard"></div>`)

  /** The input keys type into. */
  let input = null
  /** What the current DOM was built for, so we only rebuild when it changes. */
  let built = ''
  let layer = 'letters'
  /** 0 off · 1 next letter only · 2 caps lock */
  let shift = 0
  let lastShiftTap = 0
  let repeatTimer = 0

  const kind = () => input?.dataset.kbd || 'text'
  const capsWords = () => kind() === 'text' && input?.getAttribute('autocapitalize') === 'words'

  function build() {
    const enterLabel = input?.dataset.enter || 'Next'
    const signature = `${kind()}|${layer}|${enterLabel}`
    if (signature === built) return
    built = signature
    root.classList.toggle('kbd--tel', kind() === 'tel')
    const rows = kind() === 'tel' ? telRows({ enterLabel }) : textRows({ layer, kind: kind(), enterLabel })
    root.innerHTML = rows.map((r) => `<div class="kbd__row">${r.map(keyHtml).join('')}</div>`).join('')
    applyShift()
  }

  /** Reflect `shift` on the letter keys and the Shift key itself, in place. */
  function applyShift() {
    const upper = shift > 0
    for (const k of root.querySelectorAll('.key--letter')) {
      const c = upper ? k.dataset.text.toUpperCase() : k.dataset.text.toLowerCase()
      k.dataset.text = c
      k.textContent = c
    }
    const sk = root.querySelector('.key--shift')
    if (sk) {
      sk.classList.toggle('is-on', shift === 1)
      sk.classList.toggle('is-lock', shift === 2)
      sk.setAttribute('aria-pressed', String(shift > 0))
    }
  }

  /** Arm Shift at the start of a word in name-like fields. */
  function autoShift() {
    if (shift === 2 || !capsWords()) return
    const pos = input.selectionStart ?? input.value.length
    const next = pos === 0 || input.value[pos - 1] === ' ' ? 1 : 0
    if (next !== shift) {
      shift = next
      applyShift()
    }
  }

  function fire(inputType, data = null) {
    input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType, data }))
  }

  /** Bring focus back to the field if a tap elsewhere took it. */
  function refocus() {
    if (document.activeElement !== input) input.focus({ preventScroll: true })
  }

  function insert(text) {
    if (!input) return
    refocus()
    const start = input.selectionStart ?? input.value.length
    const end = input.selectionEnd ?? start
    if (input.maxLength > 0 && input.value.length - (end - start) + text.length > input.maxLength) return
    input.setRangeText(text, start, end, 'end')
    fire('insertText', text)
  }

  function backspace() {
    if (!input) return
    refocus()
    const start = input.selectionStart ?? input.value.length
    const end = input.selectionEnd ?? start
    if (start === end && start === 0) return
    input.setRangeText('', start === end ? start - 1 : start, end, 'end')
    fire('deleteContentBackward')
  }

  function press(btn) {
    const { action: act, text } = btn.dataset
    if (text != null) {
      // Shift-once is spent by the character it capitalised.
      const spent = shift === 1
      if (spent) shift = 0
      insert(text)
      if (spent) applyShift()
      return
    }
    switch (act) {
      case 'space':
        insert(' ')
        break
      case 'backspace':
        backspace()
        break
      case 'shift': {
        const now = performance.now()
        if (shift === 2) shift = 0
        else if (now - lastShiftTap < DOUBLE_TAP_MS) shift = 2
        else shift = shift === 1 ? 0 : 1
        lastShiftTap = now
        applyShift()
        break
      }
      case 'layer':
        layer = layer === 'symbols' ? 'letters' : 'symbols'
        build()
        break
      case 'enter':
        if (input) onEnter?.(input)
        break
    }
  }

  function stopRepeat() {
    clearTimeout(repeatTimer)
    clearInterval(repeatTimer)
    repeatTimer = 0
  }

  root.addEventListener('pointerdown', (e) => {
    // Never let a tap on the keyboard move focus away from the field.
    e.preventDefault()
    const btn = e.target.closest('.key')
    if (!btn) return
    btn.classList.add('is-down')
    press(btn)

    if (btn.dataset.action === 'backspace') {
      stopRepeat()
      repeatTimer = setTimeout(() => {
        repeatTimer = setInterval(backspace, REPEAT_EVERY)
      }, REPEAT_DELAY)
    }

    const release = () => {
      btn.classList.remove('is-down')
      stopRepeat()
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
    }
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
  })

  // Anything that changes the value — our keys or a hardware keyboard while
  // testing on a laptop — may move the caret to the start of a word.
  const onInput = () => autoShift()

  return {
    el: root,

    /** Make `next` the field the keys type into. */
    attach(next) {
      if (input === next) return
      input?.removeEventListener('input', onInput)
      input = next
      input.addEventListener('input', onInput)
      layer = 'letters'
      shift = 0
      build()
      autoShift()
      applyShift()
    },

    get input() {
      return input
    },
  }
}
