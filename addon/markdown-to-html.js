import Ember from 'ember';
import Showdown from './showdown';

export default Ember.Component.extend({
  afterInit: function() {
    this.converter = new Showdown.converter();
  }.on('init'),

  html: function() {
    var source = this.get('markdown') || '';
    return new Ember.Handlebars.SafeString(this.converter.makeHtml(source));
  }.property('markdown')
});