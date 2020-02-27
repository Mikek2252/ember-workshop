import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Component | new-comment', function(hooks) {
  setupTest(hooks);

  test('showRatingValidation', function(assert) {
    const component = this.owner.factoryFor('component:new-comment').create();
    assert.strictEqual(component.showRatingValidation, undefined, 'showRatingValidation is false');

    component.set('showValidations', true);

    assert.strictEqual(component.showRatingValidation, true, 'showRatingValidation is true');
  });

  test('showMessgaeValidation', function(assert) {
    const component = this.owner.factoryFor('component:new-comment').create();
    assert.strictEqual(component.showMessageValidation, undefined, 'showMessageValidation is false');

    component.set('showValidations', true);

    assert.strictEqual(component.showMessageValidation, true, 'showMessageValidation is true');
  });
});
