import Ember from 'ember';
import WidgetProperty from 'ember-eureka/widget-property';
import Showdown from './showdown';

export default WidgetProperty.extend({
    tagName: 'span',

    pathPrefix: Ember.computed.alias('fieldMeta.widgetConfig.filePath.prefix'),
    isFilePath: Ember.computed.alias('fieldMeta.widgetConfig.filePath'),

    filesEndpoint: Ember.computed('appConfig', function() {
        let apiEndpoint = this.get('appConfig.apiEndpoint');
        let uploadEndpoint = this.get('appConfig.fileUploadEndpoint');
        return `${apiEndpoint}${uploadEndpoint}`;
    }),

    fileUrl: Ember.computed('filesEndpoint', 'pathPrefix', 'field.value', function() {
        let endpoint = this.get('filesEndpoint');
        let pathPrefix = this.get('pathPrefix') || '';
        let filename = this.get('field.value');
        if (pathPrefix && pathPrefix[0] !== '/') {
            pathPrefix = `/${pathPrefix}`;
        }
        if (filename[0] !== '/') {
            filename = `/${filename}`;
        }
        return `${endpoint}${pathPrefix}${filename}`;
    }),

    markdown: Ember.computed('field.value', 'isFilePath', 'fileUrl', function() {
        let value = this.get('field.value');
        let converter = new Showdown.converter();

        if (this.get('isFilePath')) {
            let url = this.get('fileUrl');

            let promise = new Ember.RSVP.Promise((resolve, reject) => {
                Ember.$.ajax({
                    url: url,
                    success: function(source){
                        let md = converter.makeHtml(source);
                        resolve(md);
                    },
                    error: function(jqXHR, textStatus, errorThrown ) {
                        console.error('errror>', jqXHR, textStatus, errorThrown);
                        reject(jqXHR.responseJSON);
                    }
                });
            });

            return Ember.ObjectProxy.extend(Ember.PromiseProxyMixin).create({
                promise: promise
            });

        } else {
            return Ember.Object.create({
                content: converter.makeHtml(value)
            });
        }
    })
});
