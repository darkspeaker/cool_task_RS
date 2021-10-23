class Calculator{
  constructor(prevTextElement, currentTextElement){
    this.prevTextElement = prevTextElement;
    this.currentTextElement = currentTextElement;
    this.readyToReset = false;
    this.clear()
  }
  clear(){
    this.current = ""
    this.prevent = ""
    this.option = undefined
    this.supItem = 1
    this.test = false
    this.readyToReset = false
    this.negativeChecker = false
    this.powRes = ""
    this.setNumber = false
  } 
  delete(){
    this.current = this.current.toString().slice(0, -1)
  }
  appendNumber(number){
    if(number === '.' && this.current.includes('.')) return
    else{
      this.current += number + ""
      this.setNumber = true
    }
    if(this.test === true){
      this.supItem = number
    }
  }
  negativeNumber(minus){
    this.current += minus 
    this.negativeChecker = true
  }
  optionMethod(opt){
    if(this.current === "") return
    if(this.prevent !== "" && this.current !== ''){
      this.compute()
    }
    this.option = opt
    this.prevent = this.current
    if(opt !== "√" && opt !== "pow(x)y"){  
      this.current = ""
    }
    else{
      if(opt === "√"){
        if (this.current.toString().includes('-') || this.current === "Значение недопустимо") {
          this.current = "Значение недопустимо"
        }
        else{
          let curr = +this.current
          this.current = Math.sqrt(+curr, 2)
        }
      }
      else{
        this.test = true
        this.setNumber = false
        this.current = ""
      }
    }
  }
  compute(){  
    let result
    let prev = +this.prevent
    let curr = +this.current
    if (isNaN(prev) || isNaN(curr)) return;
    switch(this.option){
      case '+':
        result = prev + curr 
        if(!Number.isInteger(result)){
          let res = this.current.split('.')[1]
          result = (prev + curr).toFixed(res.length)
          if(result[result.length - 1] === "0"){
            result = result.slice(0, -1)
          }
        }
        break;
      case '-':
        result = prev - curr
        if(!Number.isInteger(result)){
          let res = this.current.split('.')[1]
          result = (prev - curr).toFixed(res.length)
          if(result[result.length - 1] === "0"){
            result = result.slice(0, -1)
          }
        }
        break;
      case '*':
        result = prev * curr
        if(!Number.isInteger(result)){
          let res = this.current.split('.')[1]
          result = (prev * curr).toFixed(res.length + 1)
          if(result[result.length - 1] === "0"){
            result = result.slice(0, -1)
          }
        }
        break;
      case '÷':
        result = prev / curr
        if(!Number.isInteger(result)){
          let res = this.current.split('.')[1]
          result = (prev / curr).toFixed(res.length)
          if(result[result.length - 1] === "0"){
            result = result.slice(0, -1)
          }
        }
        break
      default:
        return
    }
    this.readyToReset = true;
    this.current = result
    this.prevent = ""
    this.option = null
  }
  getDisplayNumber(number) {
    if(number !== '-'){
      const stringNumber = number.toString()
      const integerDigits = parseFloat(stringNumber.split('.')[0])
      const decimalDigits = stringNumber.split('.')[1]
      let integerDisplay
      if (isNaN(integerDigits)) {
        integerDisplay = ''
      } 
      else {
        integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
      }
      if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`
      } 
      else {
        return integerDisplay
      }
    }
    else{
      return number
    }
  }
  pow(){
    let upper = `pow(${this.prevent}, ${this.supItem})`
    let pow
    equalsButton.addEventListener('click', ()=>{
      if(this.test === true){
        pow = Math.pow(+this.prevent, +this.supItem)
        this.current = ""
        this.powRes = pow
        this.prevent = upper
        this.test = false
      }
    })
  }
  updateData(){
    this.currentTextElement.innerText = this.getDisplayNumber(this.current)
    if(this.option != null){
      if(this.option === '√'){
        this.prevTextElement.innerText = `${this.option} ${this.prevent}` 
        this.currentTextElement.innerText = this.current.toString()
      }
      else if(this.option === 'pow(x)y'){
        this.prevTextElement.innerText = `pow(${this.prevent}, ${this.supItem})` 
        this.currentTextElement.innerText = ""
        equalsButton.addEventListener('click', ()=>{
          if(this.test === true){
            this.currentTextElement.innerText = Math.pow(+this.prevent, +this.supItem).toString()
            if(this.test === true){
              let powRes = Math.pow(+this.prevent, +this.supItem)
              this.current = powRes
              this.test = false 
            }
          }
          else{
            this.currentTextElement.innerText = this.current.toString()
            this.compute()
          }
        })
      }
      else{
        this.prevTextElement.innerText = `${this.prevent} ${this.option}` 
      }
    }
    else{
      this.prevTextElement.innerText = ""
    }
  }
}
const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const plusMinusButton = document.querySelector('[data-plus-minus]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const supItemPow = document.querySelector('sup-item')
const itemPow = document.querySelector('item')
const minus = document.querySelector('.minus')
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button =>{
  button.addEventListener('click', ()=>{
    if(calculator.prevent === "" && calculator.current !== "" && calculator.readyToReset) {
      calculator.current = "";
      calculator.readyToReset = false;
    }
    calculator.appendNumber(button.innerText)
    calculator.updateData()
  })
})

operationButtons.forEach(button =>{
  button.addEventListener('click', ()=>{
    calculator.optionMethod(button.innerText)
    calculator.updateData()
  })
})

plusMinusButton.addEventListener('click', ()=>{
  calculator.negativeNumber(minus.innerText)
  calculator.updateData()
})

allClearButton.addEventListener('click', ()=>{
  calculator.clear()
  calculator.updateData()
})

deleteButton.addEventListener('click', ()=>{
  calculator.delete()
  calculator.updateData()
})

equalsButton.addEventListener('click', ()=>{
  calculator.compute()
  calculator.updateData()
})