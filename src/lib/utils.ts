type ClassValue = string | number | null | undefined | false | { [k: string]: any } | ClassValue[];

export function cn(...inputs: ClassValue[]) {
  const out: string[] = [];

  const normalize = (val: ClassValue) => {
    if (!val) return;
    if (typeof val === 'string' || typeof val === 'number') {
      out.push(String(val));
      return;
    }
    if (Array.isArray(val)) {
      val.forEach(normalize);
      return;
    }
    if (typeof val === 'object') {
      for (const k in val) {
        if (Object.prototype.hasOwnProperty.call(val, k) && val[k]) {
          out.push(k);
        }
      }
    }
  };

  inputs.forEach(normalize);

  return out.join(' ');
}

export default cn;
