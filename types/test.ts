import {defineComponent, h} from 'vue'
import {render, fireEvent, screen, waitFor} from '@testing-library/vue'

declare const elem: Element

const SomeComponent = defineComponent({
  name: 'SomeComponent',
  props: {
    foo: {type: Number, default: 0},
    bar: {type: String, default: '0'},
  },
})

export async function testRender() {
  const page = render({template: '<div />'})

  // single queries
  page.getByText('foo')
  page.queryByText('foo')
  await page.findByText('foo')

  // multiple queries
  page.getAllByText('bar')
  page.queryAllByText('bar')
  await page.findAllByText('bar')

  // helpers
  const {container, unmount, debug, rerender} = page

  debug(container)

  await rerender({a: 1})

  debug(elem) // $ExpectType void
  debug([elem, elem], 100, {highlight: false}) // $ExpectType void

  unmount() // $ExpectType void
}

export function testRenderOptions() {
  const container = document.createElement('div')
  const baseElement = document.createElement('div')
  const options = {container, baseElement}
  render({template: 'div'}, options)
}

export async function testFireEvent() {
  const {container} = render({template: 'button'})
  await fireEvent.click(container)
}

export function testDebug() {
  const {debug, getAllByTestId} = render({
    render() {
      return h('div', [
        h('h1', {attrs: {'data-testid': 'testid'}}, 'hello world'),
        h('h2', {attrs: {'data-testid': 'testid'}}, 'hello world'),
      ])
    },
  })

  debug(getAllByTestId('testid'))
}

export async function testScreen() {
  render({template: 'button'})

  await screen.findByRole('button')
}

export async function testWaitFor() {
  const {container} = render({template: 'button'})
  await fireEvent.click(container)
  await waitFor(() => {})
}

export function testOptions() {
  render(SomeComponent, {
    attrs: {a: 1},
    props: {c: 1}, // ideally it would fail because `c` is not an existing prop…
    data: () => ({b: 2}),
    slots: {
      default: '<div />',
      footer: '<div />',
    },
    global: {
      config: {isCustomElement: _ => true},
    },
    store: {
      state: {count: 3},
      strict: true,
    },
    baseElement: document.createElement('div'),
    container: document.createElement('div'),
  })
}

/*
eslint
  testing-library/prefer-explicit-assert: "off",
  testing-library/no-wait-for-empty-callback: "off",
  testing-library/no-debug: "off",
  testing-library/prefer-screen-queries: "off",
  @typescript-eslint/unbound-method: "off",
*/