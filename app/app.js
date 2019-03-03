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

observable.subscribe((isMobile) => {
  let footer = document.getElementById('footer')
  let mobileImage = document.getElementById('mobileImage')
  let sidebar = document.getElementById('sidebar')

  if (!footer) {
    throw new Error(`Element with id "footer" doesn't exist`)
  }
  if (!mobileImage) {
    throw new Error(`Element with id "mobileImage" doesn't exist`)
  }
  if (!sidebar) {
    throw new Error(`Element with id "sidebar" doesn't exist`)
  }

  let elements = [document.body, footer]

  if (isMobile) {
    elements.forEach((e) => (e.className = MOBILE_CLASSNAME))
    sidebar.hidden = true
    mobileImage.hidden = false
  } else {
    elements.forEach((e) => (e.className = DESKTOP_CLASSNAME))
    sidebar.hidden = false
    mobileImage.hidden = true
  }
})

window.onload = () => {
  observable.notify(shouldWindowBeMobile())
}

window.onresize = () => {
  if (shouldWindowBeMobile() && observable.data === false) {
    observable.notify(true)
  }
  if (!shouldWindowBeMobile() && observable.data === true) {
    observable.notify(false)
  }
}
