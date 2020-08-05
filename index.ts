import traverse from 'traverse';
import * as isSecret from 'is-secret';

export const redactSecrets = function (redacted: string, options = {
  keys: [],
  values: []
}) {
  const { keys = [], values = [] } = options;

  const isRedactable = (key, value) => {
    const isGenericSecret = isSecret.key(key) || isSecret.value(value)
    const isUserSecret = keys.some(regex => regex.test(key)) || values.some(regex => regex.test(value))
    return isGenericSecret || isUserSecret
  };

  const map = <T>(obj: T) => {
    const updated = traverse(obj).map(function (val) {
      if (isRedactable(this.key, val)) {
        this.update(redacted);
      }
    });
    return updated as T;
  };

  const forEach = obj => {
    traverse(obj).forEach(function (val) {
      if (isRedactable(this.key, val)) {
        this.update(redacted);
      }
    });
  }

  return {
    map,
    forEach
  };
};
