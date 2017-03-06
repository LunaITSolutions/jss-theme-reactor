// @flow

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
  };

  const additionalRules = []

  function addRules(newRules){
    additionalRules.push(newRules)
  };

  function createRules(theme: Object = {}): Object {
    const rules = typeof callback === 'function' ? callback(theme) : callback;

    additionalRules.forEach(newRules => {
      Object.keys(newRules).forEach(ruleName => {
        if (rules[ruleName])
          Object.assign(rules[ruleName], newRules[ruleName])
        else
          rules[ruleName] = newRules[ruleName]
      })
    })

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
