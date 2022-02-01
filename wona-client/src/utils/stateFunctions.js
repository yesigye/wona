export function isObjectDifferent(object1, object2) {
  let changed = typeof object1 !== typeof object2;

  if (typeof object1 === "object" && typeof object2 === "object") {
    // Check for changes in error object properties
    for (const i in { ...object1, ...object2 }) {
      const propAdded = !object1.hasOwnProperty(i);
      const propRemoved = !object2.hasOwnProperty(i);
      const propValueChanged =
        object1.hasOwnProperty(i) && object1[i] !== object2[i];

      if (propValueChanged || propAdded || propRemoved) {
        changed = true;
      }
    }
  }

  return changed;
}
