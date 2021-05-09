import { expect } from 'chai';
import { Item, GildedRose } from '../app/gilded-rose';

const getItemDetail = (item: Item) => `${item.name} ${item.sellIn} ${item.quality}`;

describe('Gilded Rose', function () {
    it(`Item 'sellIn' date and 'quality' lowers by 1 every day till the 'sellIn' date >= 0`, () => {
        const itemName = '+5 Dexterity Vest';
        const sellIn = 10;
        const quality = 20;
        const item = new Item(itemName, sellIn, quality);
        const gildedRose = new GildedRose([ new Item(itemName, sellIn, quality) ]);

        for(let i = sellIn; i > 0; i--) {
            item.sellIn--;
            item.quality--;

            const [gildedItem] = gildedRose.updateQuality();
            expect(getItemDetail(gildedItem)).to.equal(getItemDetail(item));
        }
    });

    it(`Once the sell by date has passed, Quality degrades twice as fast but does not go below 0`, () => {
        const itemName = '+5 Dexterity Vest';
        const sellIn = 0;
        const quality = 10;
        const item = new Item(itemName, sellIn, quality);
        const gildedRose = new GildedRose([ new Item(itemName, sellIn, quality) ]);

        for(let i = 10; i > 0; i--) {
            item.sellIn--;
            item.quality -= 2;

            if(item.quality < 0) {
                item.quality = 0;
            }

            const [updatedItem] = gildedRose.updateQuality();
            expect(getItemDetail(updatedItem)).to.equal(getItemDetail(item));
        }
    });

    it(`'Aged Brie' actually increases in Quality the older it gets and icreases to max 50`, () => {
        const itemName = 'Aged Brie';
        const sellIn = 10;
        const quality = 10;
        const item = new Item(itemName, sellIn, quality);
        const gildedRose = new GildedRose([ new Item(itemName, sellIn, quality) ]);

        for(let i = sellIn; i > -50; i--) {
            item.sellIn--;
            item.quality++;

            if(item.sellIn < 0) {
                item.quality++;
            }

            if(item.quality > 50) {
                item.quality = 50;
            }

            const [updatedItem] = gildedRose.updateQuality();
            expect(getItemDetail(updatedItem)).to.equal(getItemDetail(item));
        }
    });

    it(
      `'Sulfuras, Hand of Ragnaros', being a legendary item, never has to be sold or decreases in Quality`,
      () => {
        const itemName = 'Sulfuras, Hand of Ragnaros';
        const sellIn = 10;
        const quality = 80;
        const item = new Item(itemName, sellIn, quality);
        const gildedRose = new GildedRose([ new Item(itemName, sellIn, quality) ]);

        for(let i = sellIn; i > -50; i--) {
            const [updatedItem] = gildedRose.updateQuality();
            expect(getItemDetail(updatedItem)).to.equal(getItemDetail(item));
        }
    });

    it(
      `'Backstage passes to a TAFKAL80ETC concert' increases in Quality as its SellIn value approaches but does not go above 50`,
      () => {
        const itemName = 'Backstage passes to a TAFKAL80ETC concert';
        const sellIn = 20;
        const quality = 45;
        const item = new Item(itemName, sellIn, quality);
        const gildedRose = new GildedRose([ new Item(itemName, sellIn, quality) ]);

        for(let i = sellIn; i > 10; i--) {
            item.sellIn--;
            item.quality++;

            if(item.quality > 50) {
              item.quality = 50
            }

            const [updatedItem] = gildedRose.updateQuality();
            expect(getItemDetail(updatedItem)).to.equal(getItemDetail(item));
        }
    });

    it(
      `'Backstage passes to a TAFKAL80ETC concert' Quality increases by 2 when there are 10 days or less but does not go above 50`,
      () => {
          const itemName = 'Backstage passes to a TAFKAL80ETC concert';
          const sellIn = 10;
          const quality = 44;
          const item = new Item(itemName, sellIn, quality);
          const gildedRose = new GildedRose([ new Item(itemName, sellIn, quality) ]);

          for(let i = sellIn; i > 5; i--) {
              item.sellIn--;
              item.quality += 2;

              if(item.quality > 50) {
                item.quality = 50
              }

              const [updatedItem] = gildedRose.updateQuality();
              expect(getItemDetail(updatedItem)).to.equal(getItemDetail(item));
          }
      });

    it(
      `'Backstage passes to a TAFKAL80ETC concert' Quality increases by 3 when there are 5 days or less but does not go above 50`,
      () => {
          const itemName = 'Backstage passes to a TAFKAL80ETC concert';
          const sellIn = 5;
          const quality = 44;
          const item = new Item(itemName, sellIn, quality);
          const gildedRose = new GildedRose([ new Item(itemName, sellIn, quality) ]);

          for(let i = sellIn; i > 0; i--) {
              item.sellIn--;
              item.quality += 3;

              if(item.quality > 50) {
                item.quality = 50
              }

              const [updatedItem] = gildedRose.updateQuality();
              expect(getItemDetail(updatedItem)).to.equal(getItemDetail(item));
          }
      });

    it(
      `'Backstage passes to a TAFKAL80ETC concert' Quality drops to 0 when sellIn date < 0`,
      () => {
          const itemName = 'Backstage passes to a TAFKAL80ETC concert';
          const sellIn = 0;
          const quality = 10;
          const item = new Item(itemName, sellIn, quality);
          const gildedRose = new GildedRose([ new Item(itemName, sellIn, quality) ]);

          for(let i = sellIn; i > -10; i--) {
              item.sellIn--;
              item.quality = 0;

              const [updatedItem] = gildedRose.updateQuality();
              expect(getItemDetail(updatedItem)).to.equal(getItemDetail(item));
          }
      });

  it(
    `'Conjured Mana Cake' items degrade in Quality twice as fast as normal items but never goes below 0`,
    () => {
      const itemName = 'Conjured Mana Cake';
      const sellIn = 10;
      const quality = 25;
      const item = new Item(itemName, sellIn, quality);
      const gildedRose = new GildedRose([ new Item(itemName, sellIn, quality) ]);

      for(let i = sellIn; i > -10; i--) {
        item.sellIn--;
        item.quality -= 2;

        if(item.sellIn < 0) {
          item.quality -= 2;
        }

        if(item.quality < 0) {
          item.quality = 0;
        }

        const [updatedItem] = gildedRose.updateQuality();
        expect(getItemDetail(updatedItem)).to.equal(getItemDetail(item));
      }
    });
});
