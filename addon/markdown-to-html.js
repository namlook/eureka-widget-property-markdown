import Ember from 'ember';
import Showdown from './showdown';

export default Ember.Component.extend({
  afterInit: Ember.on('init', function() {
    this.converter = new Showdown.converter();
  }),

  html: Ember.computed('markdown', function() {
    var source = this.get('markdown') || '';
    return new Ember.Handlebars.SafeString(this.converter.makeHtml(source));
  })
});