## Author: Abhijit Baldawa
### Gilded Rose Refactoring Kata
Check the requirements in file [GildedRoseRequirements.txt](./GildedRoseRequirements.txt)

### Unit tests
I have added extensive unit tests to test my code at [TypeScript/test/gilded-rose.spec.ts](TypeScript/test/gilded-rose.spec.ts).  

### Output
Check the output of my refactored code in file [TypeScript/output/output.txt](./TypeScript/output/output.txt).  
This output is generated by file [TypeScript/test/golden-master-text-test.ts](TypeScript/test/golden-master-text-test.ts) 
which is also modified by me to highlight the fix and run for 90 days.

### Tech Stack
Node.js (14.x)/Typescript

### Solution
I have created a DSL to define conditions and, if true, its associated actions.
Every rule in the array for each item will be executed one by one.
This helps define complex conditions/scenarios and actions per item.  
  
This DSL makes adding rules, modifying rules and reasoning/understanding
complex rules extremely easy without needing to understand the code.  
  
**NOTE:** All the rules for all items will be applied chronologically as they
appear in the array every day. If no rule match then by default `__default`
rule will be applied. The `updateQuality` function is updated to work with this
DSL configuration.  

Check below how the DSL to define condition and action looks like:
Check [TypeScript/app/gilded-rose-rules.ts](TypeScript/app/gilded-rose-rules.ts)
for more details

```typescript
const LOWEST_ALLOWED_QUALITY = 0;
const MAX_ALLOWED_QUALITY = 50;
const DEFAULT_RULE_IF_NO_MATCH = '__default';

/**
 * An "action" is only executed if all the conditions 
 * in "condition" is true.
 * 
 * If an "action" is defined without "condition" then
 * the action will always be executed
 */
const rules: Rules = {
  "Aged Brie": [
    {
      condition: {
        quality: {$lt: MAX_ALLOWED_QUALITY}
      },
      action: {
        quality: {$incr: 1}
      }
    },
    {
      action: {
        sellIn: {$decr: 1}
      }
    },
    {
      condition: {
        sellIn: {$lt: 0},
        quality: {$lt: MAX_ALLOWED_QUALITY}
      },
      action: {
        quality: {$incr: 1}
      }
    }
  ],
  "Backstage passes": [
    {
      condition: {
        quality: {$lt: MAX_ALLOWED_QUALITY}
      },
      action: {
        quality: {$incr: 1}
      }
    },
    {
      condition: {
        sellIn: {$lt: 11},
        quality: {$lt: MAX_ALLOWED_QUALITY}
      },
      action: {
        quality: {$incr: 1}
      }
    },
    {
      condition: {
        sellIn: {$lt: 6},
        quality: {$lt: MAX_ALLOWED_QUALITY}
      },
      action: {
        quality: {$incr: 1}
      }
    },
    {
      action: {
        sellIn: {$decr: 1}
      }
    },
    {
      condition: {
        sellIn: {$lt: 0}
      },
      action: {
        quality: {$set: LOWEST_ALLOWED_QUALITY}
      }
    }
  ],
  "Sulfuras": [],
  "Conjured": [
    {
      condition: {
        quality: {$gt: LOWEST_ALLOWED_QUALITY}
      },
      action: {
        quality: {$decr: 1}
      }
    },
    {
      condition: {
        quality: {$gt: LOWEST_ALLOWED_QUALITY}
      },
      action: {
        quality: {$decr: 1}
      }
    },
    {
      action: {
        sellIn: {$decr: 1}
      }
    },
    {
      condition: {
        sellIn: {$lt: 0},
        quality: {$gt: LOWEST_ALLOWED_QUALITY}
      },
      action: {
        quality: {$decr: 1}
      }
    },
    {
      condition: {
        sellIn: {$lt: 0},
        quality: {$gt: LOWEST_ALLOWED_QUALITY}
      },
      action: {
        quality: {$decr: 1}
      }
    }
  ],
  [DEFAULT_RULE_IF_NO_MATCH]: [
    {
      condition: {
        quality: {$gt: LOWEST_ALLOWED_QUALITY}
      },
      action: {
        quality: {$decr: 1}
      }
    },
    {
      action: {
        sellIn: {$decr: 1}
      }
    },
    {
      condition: {
        sellIn: {$lt: 0},
        quality: {$gt: LOWEST_ALLOWED_QUALITY}
      },
      action: {
        quality: {$decr: 1}
      }
    }
  ]
};
```