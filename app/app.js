const TIPPING_POINT = 960
const shouldWindowBeMobile = () => window.innerWidth <= TIPPING_POINT

class Observable {
  constructor() {
    this.observers = []
    this.data
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
  if (shouldRenderMobile) {
    console.log('mobile rendered')
  } else {
    console.log('desktop rendered')
  }
})

observable.notify(shouldWindowBeMobile())

window.onresize = () => {
  if (shouldWindowBeMobile() && observable.data === false) {
    observable.notify(true)
  } else if (!shouldWindowBeMobile() && observable.data === true) {
    observable.notify(false)
  }
}
