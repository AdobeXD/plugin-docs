require([
    'gitbook'
], function(gitbook) {
    gitbook.events.on('start', function(e, config) {
        $('.fancybox').fancybox($.extend({
                'loop': false,
            	'afterLoad' : function() {
					this.title = (this.index + 1) + '/' + this.group.length + (this.title ? ' - ' + this.title : '');
				}
        },config.fancybox));
    });
});