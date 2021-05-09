import {
    ConditionOperators,
    rules,
    conditionFunctions
} from "./gilded-rose-rules";

export type ItemKeys = Omit<Item, "name">;

/**
 * Get all keys except "__default"
 */
const ruleKeys = Object.keys(rules)
  .filter(ruleKey => ruleKey !== "__default");

export class Item {
    name: string;
    sellIn: number;
    quality: number;

    constructor(name: string, sellIn: number, quality: number) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }
}

export class GildedRose {
    items: Array<Item>;

    constructor(items = [] as Array<Item>) {
        this.items = items;
    }

    updateQuality() {
        for(const item of this.items) {
            // Find the correct rule key else default to __default
            const ruleName = ruleKeys
              .find(ruleKey => item.name.toLowerCase().includes(ruleKey.toLowerCase())) || "__default";
            const itemRules = rules[ruleName];

            for(const itemRule of itemRules) {
                let isRuleConditionSatisfied = true;

                if(itemRule.condition) {
                    for(const [conditionKey, conditionObj] of Object.entries(itemRule.condition)) {
                        if(!conditionObj) {
                            continue;
                        }

                        isRuleConditionSatisfied = Object.entries(conditionObj)
                            .reduce<boolean>(
                              (
                                isConditionValid,
                                [conditionOperator, conditionValue]
                              ) => isConditionValid && conditionFunctions[conditionOperator as ConditionOperators](
                                item[conditionKey as keyof ItemKeys],
                                conditionValue!
                              ),
                              true
                            );

                        if(!isRuleConditionSatisfied) {
                            break;
                        }
                    }
                }

                if(isRuleConditionSatisfied) {
                    for(const [actionKey, actionObj] of Object.entries(itemRule.action)) {
                        if(!actionObj) {
                            continue;
                        }

                        if(typeof actionObj.$decr === "number") {
                            item[actionKey as keyof ItemKeys] -= actionObj.$decr;
                        } else if(typeof actionObj.$incr === "number") {
                            item[actionKey as keyof ItemKeys] += actionObj.$incr;
                        } else if(typeof actionObj.$set === "number") {
                            item[actionKey as keyof ItemKeys] = actionObj.$set;
                        }
                    }
                }
            }
        }
        return this.items;
    }
}
