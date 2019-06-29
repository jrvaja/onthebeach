const getSequence = () => {
  const inputTextBox = document.getElementById('inputTextBox').value.trim();
  const sequenceManipulation = new SequenceManipulation(inputTextBox)
  const result = sequenceManipulation.make();
  document.getElementById('result').innerHTML = result;
}

class SequenceManipulation {
  formatedData = [];
  constructor(textInput) {
    this.formatedData = this.prepareDataStructure(textInput);
  }

  /**
   * prepare data structure in dictionary form
   * @param {String} textInput 
   */
  prepareDataStructure(textInput) {
    const rec = textInput.match(/[^\r\n]+/g);
    return rec.map(item => {
      let element = item.split('=>');
      
      let key = element[0].trim()
      let value = element.length > 1 && element[1].trim() !== "" ? element[1].trim() : null
      return {
        key,
        value
      }
    });
  }

  /**
   * Prepare sequnce 
   * @returns {String}
   */
  make() {
    const result = [];
    const args = this.formatedData;
    try {
      for (let item of args) {
        if (!result.includes(item.key)) {
          if (item.value === null) {
            result.push(item.key);
          } else {
            console.log(item)
            this.checkDependancy(item, result);
          }
        }
      }
      return result.join('');
    } catch (error) {
      return error;
    }
  }

  /**
   * getItemObjectByKey: Get specific item by key
   * @param {String} key 
   */
  getItemObjectByKey(key) {
    const data = this.formatedData;
    return data.find(item => item.key === key)
  }

  /**
   * validate key & value
   * @param {Object} arg 
   */
  checkValidKeyValueCombination(arg) {
    if (arg.value !== null) {
      const data = this.formatedData;
      // check the item.value is used as key in args {throw}
      if (data.findIndex(item => item.key === arg.value) === -1) {
        throw `Key: ${arg.value} does not exists`;
      }
      // key === value {throw}
      if (arg.key === arg.value) {
        throw "The result should be an error stating that jobs can’t depend on themselves.";
      }
      return true;
    }
    return;
  }

  /**
   * 
   * @param {Object} currentItem 
   * @param {Array} result 
   * @param {Array} runtimeStack 
   */
  checkDependancy(currentItem, result, runtimeStack = []) {
    const isValidDependcany = this.checkValidKeyValueCombination(currentItem);
    if (!result.includes(currentItem.key)) {
      runtimeStack.push(currentItem.key);
    }
    if (isValidDependcany) {
      if (runtimeStack.includes(currentItem.value)) {
        throw "The result should be an error stating that jobs can’t have circular dependencies.";
      }
      this.checkDependancy(this.getItemObjectByKey(currentItem.value), result, runtimeStack);
    } else {
      const appendToResult = runtimeStack.reverse();
      result.push(...appendToResult);
    }
  };
}