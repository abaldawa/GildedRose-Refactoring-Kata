import type { ItemKeys } from './gilded-rose';

type ConditionOperators = "$lt" | "$gt";
type ActionOperators = "$incr" | "$decr" | "$set";
type ConditionFunctions = {
  [conditionOperator in ConditionOperators]: (a: number, b: number) => boolean;
};

interface Rule {
  condition?: {
    [conditionKey in keyof ItemKeys]?: {
      [conditionOperator in ConditionOperators]?: number;
    };
  };
  action: {
    [conditionKey in keyof ItemKeys]?: {
      [actionOperator in ActionOperators]?: number;
    };
  };
}

interface Rules {
  [key: string]: Rule[];
  __default: Rule[];
}

const conditionFunctions: ConditionFunctions = {
  $lt: (itemValue: number, $ltValue: number) => itemValue < $ltValue,
  $gt: (itemValue: number, $gtValue: number) => itemValue > $gtValue
};

const LOWEST_ALLOWED_QUALITY = 0;
const MAX_ALLOWED_QUALITY = 50;

/**
 * This is a DSL to define conditions and, if true, its associated actions.
 * Every rule in the array for each item will be executed one by one.
 * This helps define complex conditions/scenarios and actions per item.
 *
 * This DSL makes adding rules, modifying rules and reasoning/understanding
 * complex rules extremely easy without needing to understand the code.
 *
 * NOTE: All the rules for all items will be applied chronologically as they
 * appear in the array every day. If no rule match then by default __default
 * rule will be applied
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
  __default: [
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

export {
  ItemKeys,
  ConditionOperators,
  ActionOperators,
  rules,
  conditionFunctions,
}