// @flow

const mergeRules = (rulesObject, newRulesObject) => {

  // Filter out the non media queries out of the newRulesObject
  Object.keys(newRulesObject).forEach(newRuleProp => {
    var newRuleValue = newRulesObject[newRuleProp]
    if (typeof newRuleValue == 'object'){
      // Need to merge these in
      if (rulesObject[newRuleProp])
        mergeRules(rulesObject[newRuleProp], newRulesObject[newRuleProp])
      else
        rulesObject[newRuleProp] = newRulesObject[newRuleProp]
    } else {
      rulesObject[newRuleProp] = newRuleValue
    }
  })

}

export function createStyleSheet(
  name: string,
  callback: Object|((theme: Object) => Object),
  options: Object = {},
): ThemeReactorStyleSheet {
  if (!options.insertionPoint) {
    options.insertionPoint = 'jss-theme-reactor';
  }

  const styleSheet = {
    name,
    options,
    createRules,
    addRules,
    removeRules,
  };

  const additionalRules = []

  function addRules(newRules){
    additionalRules.push(newRules)
    return newRules
  };

  function removeRules(rules){
    var index = additionalRules.indexOf(rules)
    if (index != -1)
      return additionalRules.splice(index, 1)[0]
    return newRuleValue
  };

  function createRules(theme: Object = {}): Object {
    const rules = typeof callback === 'function' ? callback(theme) : callback;


    additionalRules.forEach(newRules => mergeRules(rules, newRules))

    if (!theme.overrides || !theme.overrides[name]) {
      return rules;
    }

    const overrides = theme.overrides[name];
    const rulesWithOverrides = { ...rules };

    Object.keys(overrides).forEach((n) => {
      rulesWithOverrides[n] = Object.assign(rulesWithOverrides[n] || {}, overrides[n]);
    });

    return rulesWithOverrides;
  }

  return styleSheet;
}
