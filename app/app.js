const MOBILE_CLASSNAME = 'mobile'
const DESKTOP_CLASSNAME = 'desktop'
const TIPPING_POINT = 960
const shouldWindowBeMobile = () => window.innerWidth <= TIPPING_POINT

class Observable {
  constructor() {
    this.data
    this.observers = []
  }

  subscribe(f) {
    this.observers.push(f)
  }

  unsubscribe(f) {
    this.observers = this.observers.filter((subscriber) => subscriber !== f)
  }

  notify(data) {
    this.data = data
    this.observers.forEach((observer) => observer(data))
  }
}

let observable = new Observable()
observable.subscribe((shouldRenderMobile) => {
  let image = document.getElementById('image')
  if (!image) {
    throw new Error(`Element with id "image" doesn't exist`)
  }

  let elements = [document.body, image]

  if (shouldRenderMobile) {
    elements.forEach((e) => (e.className = MOBILE_CLASSNAME))
  } else {
    elements.forEach((e) => (e.className = DESKTOP_CLASSNAME))
  }
})

window.onload = () => {
  observable.notify(shouldWindowBeMobile())
}

window.onresize = () => {
  if (shouldWindowBeMobile() && observable.data === false) {
    observable.notify(true)
  } else if (!shouldWindowBeMobile() && observable.data === true) {
    observable.notify(false)
  }
}
