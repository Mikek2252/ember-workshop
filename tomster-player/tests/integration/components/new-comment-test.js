import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, triggerKeyEvent, click, blur, focus } from '@ember/test-helpers';
import Pretender from 'pretender';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | new-comment', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.server = new Pretender(function() {
      this.post('/api/comments', () => {
        return [201, { 'Content-Type': 'application/json' }, JSON.stringify({
          data: {
            id: '3',
            type: 'comment',
            attributes: {
              rating: 5,
              text: 'I love this!',
              'created-at': new Date()
            },
            relationships: {
              album: {
                data: { type: 'album', id: '1' }
              }
            }
          }
        })];
      });
    });
  });

  hooks.afterEach(function() {
    this.server.shutdown();
  });

  test('it renders a comment form', async function(assert) {
    await render(hbs`<NewComment />`);

    assert.dom('form').exists();
    assert.dom('[data-test-new-comment-rating-input]').exists();
    assert.dom('[data-test-new-comment-text-input]').exists();
    assert.dom('[data-test-new-comment-submit]').exists();
  });

  test('it resets fields once the comment has been saved', async function(assert) {
    await render(hbs`<NewComment />`);
    await fillIn('[data-test-new-comment-rating-input]', 3);
    await fillIn('[data-test-new-comment-text-input]', 'yeah, ok…');
    await triggerKeyEvent('[data-test-new-comment-text-input]', 'keyup', '…');
    await click('[data-test-new-comment-submit]');

    assert.dom('[data-test-new-comment-rating-input]').hasValue('');
    assert.dom('[data-test-new-comment-text-input]').hasValue('');
  });

  test('validations do not show without submiting form', async function(assert) {
    await render(hbs`<NewComment />`);

    assert.dom('[data-test="new-comment__rating-validation"]').doesNotExist();
    assert.dom('[data-test="new-comment__message-validation"]').doesNotExist();

    await click('[data-test-new-comment-submit]');

    assert.dom('[data-test="new-comment__rating-validation"]').hasText(`This field can't be blank`);
    assert.dom('[data-test="new-comment__message-validation"]').hasText(`This field can't be blank`);
  })

  test('validations show on blur of inputs', async function(assert) {
    await render(hbs`<NewComment />`);

    assert.dom('[data-test="new-comment__rating-validation"]').doesNotExist();
    assert.dom('[data-test="new-comment__message-validation"]').doesNotExist();

    await focus('[data-test-new-comment-text-input]');
    await blur('[data-test-new-comment-text-input]');

    assert.dom('[data-test="new-comment__rating-validation"]').doesNotExist();
    assert.dom('[data-test="new-comment__message-validation"]').hasText(`This field can't be blank`);
  })
});
