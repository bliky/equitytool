const communicateStore = function (mod, initialState = {}) {
  if (!mod) {
    throw new Error('Module is required.')
  }

  this.states = {
      tabData:[
        {
          nav:'当前沟通'
        },
        {
          nav:'历史沟通'
        }
      ]
  }

  for (let prop in initialState) {
    if (initialState.hasOwnProperty(prop) && this.states.hasOwnProperty(prop)) {
      this.states[prop] = initialState[prop];
    }
  }
}

communicateStore.prototype.save = function () {

}

export default communicateStore
