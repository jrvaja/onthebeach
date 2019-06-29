const getSequence = () => {
  const inputTextBox = document.getElementById('inputTextBox').value.trim();
  const sequenceManipulation = new SequenceManipulation(inputTextBox)
  sequenceManipulation.make();
}

class SequenceManipulation {
  formatedData = [];
  constructor(textInput) {
    this.formatedData = this.prepareDataStructure(textInput);
  }

  prepareDataStructure(textInput) {
    const rec = textInput.match(/[^\r\n]+/g);
    return rec.map(item => {
      let element = item.split('=>');
      let key = element[0].trim()
      let value = element[1].trim() !== "" ? element[1].trim() : null
      return {
        key,
        value
      }
    });
  }

  make() {
    const res = this.prepareSequence();
    console.log(res);
  }

  prepareSequence() {
    const result = [];
    const args = this.formatedData;
    try {
      for (let item of args) {
        if (item.value === null && !result.includes(item.key)) {
          result.push(item.key);
        } else {
          this.checkDependancy(item, result);
        }
      }
      return result.join('');
    } catch (error) {
      return error;
    }
  }

  getItemObjectByKey(key) {
    const data = this.formatedData;
    return data.find(item => item.key === key)
  }

  checkValidKeyValueCombination(arg) {
    const data = this.formatedData;
    // check the item.value is used as key in args {throw}
    if (data.findIndex(item => item.key === arg.value) === -1) {
      throw `Key: ${arg.value} does not exists`;
    }
    // key === value {throw}
    if (arg.key === arg.value) {
      throw "The result should be an error stating that jobs can’t depend on themselves.";
    }
  }

  checkDependancy(currentItem, result, runtimeStack = []) {
    if (currentItem.value !== null) {
      this.checkValidKeyValueCombination(currentItem);
    }
    if (!result.includes(currentItem.key)) {
      runtimeStack.push(currentItem.key);
    }
    if (currentItem.value !== null) {
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