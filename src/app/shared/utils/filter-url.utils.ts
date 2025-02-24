
export interface FiltersMap {
    [key: string]: string[]; 
    // e.g. { 
    //   "pokolenie-protsessora-intel": ["13-oe-raptor-lake"],
    //   "processor": ["intel_core_i5","intel_core_i7"]
    // }
  }
  
  /**
   * Parse a filter string of form:
   *   "key1=val1,val2;key2=val3;key3=val4,val5"
   * into a FiltersMap object.
   */
  export function parseFiltersString(filterStr: string): FiltersMap {
    const result: FiltersMap = {};
  
    if (!filterStr) return result;
  
    // Split by semicolon -> each piece is "key=value,value2"
    const segments = filterStr.split(';');
    for (const segment of segments) {
      if (!segment.includes('=')) {
        // Malformed or empty segment
        continue;
      }
      const [rawKey, rawValues] = segment.split('=');
      const key = rawKey.trim();
      const values = rawValues.split(',').map(v => v.trim()).filter(Boolean);
  
      if (key) {
        result[key] = values;
      }
    }
    return result;
  }
  
  /**
   * Build a filter string from a FiltersMap object.
   * e.g. { "processor": ["i5","i7"], "producer": ["lenovo","dell"] }
   * -> "processor=i5,i7;producer=lenovo,dell"
   */
  export function buildFiltersString(filters: FiltersMap): string {
    const segments: string[] = [];
    for (const key of Object.keys(filters)) {
      const values = filters[key];
      if (values && values.length > 0) {
        segments.push(`${key}=${values.join(',')}`);
      }
    }
    return segments.join(';');
  }
  