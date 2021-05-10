import {
    ConditionOperators,
    rules,
    conditionFunctions,
    DEFAULT_RULE_IF_NO_MATCH,
    ruleKeys
} from "./gilded-rose-rules";

export type ItemKeys = Omit<Item, "name">;

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

    /**
     * This method does below for each item in items array.
     * 1] Find the rule name matching the item.name. If no rule found then
     *    use "__default" rule.
     * 2] For each rule defined in the rules checks if the condition is defined
     *    for that rule.
     * 3] If condition is defined then check if all the conditions for EACH key are valid.
     * 4] If all the conditions for each key defined in itemRule.condition is valid then
     *    only performs action defined for all the keys else skips the action if any condition
     *    for any key is false.
     * 5] If condition for any rule is not defined then directly EXECUTES the action defined
     *    for all the keys in itemRule.action.
     */
    updateQuality() {
        for(const item of this.items) {
            // Find the correct rule key else default to DEFAULT_RULE_IF_NO_MATCH
            const ruleName = ruleKeys
              .find(ruleKey => item.name.toLowerCase().includes(ruleKey.toLowerCase())) || DEFAULT_RULE_IF_NO_MATCH;
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
