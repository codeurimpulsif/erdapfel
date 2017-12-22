const panels = new Map()

/**
 * Panel is a simple display component
 */
function Panel(panel, view, parentId = null) {
    this.panel = panel
    this.view = view
    this.root = false
    this.cid = parentId || panels.size
    if(parentId !== null) {
      this.node = document.getElementById(this.cid)
      this.root = true
    } else {
      this.node = document.createElement('div')
      this.node.setAttribute('data-cid', this.cid)
    }
    panel.render = this.render.bind(this)
    panel.animate = this.animate.bind(this)
    panels.set(this.cid, this.node)
}

Panel.prototype.render = function () {
  this.node.innerHTML = this.view.call(this.panel)
  if(this.root === false) {
    return this.node.outerHTML
  }
}

Panel.prototype.update = function () {
  let transitionNode = document.querySelector(`[data-cid="${this.cid}"]`)
  return new Promise((resolve) => {
    transitionNode.innerHTML = this.view.call(this.panel)
    requestAnimationFrame(()=>{
      resolve(this)
    })
  })
}

Panel.prototype.animate = function (t, selector, style = {}) {
  let transitionNode = document.querySelector(`[data-cid="${this.cid}"]`)
  if(selector) {
    transitionNode = transitionNode.querySelector(selector)
  }
  Object.keys(style).forEach((styleKey) => {
    transitionNode.style[styleKey] = style[styleKey]
  })
  transitionNode.style.transition = t+'s'
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(this)
    }, t*1000)
  })
}

export default Panel