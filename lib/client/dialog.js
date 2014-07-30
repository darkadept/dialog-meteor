Dialog = {

	showModal: function(template, context, options, renderFunc) {

		if (!template.rendered) {
			template.rendered = function() {
				if (renderFunc) renderFunc.call(this);
				Dialog.renderModal.call(this, options);
			}
		}

		var render;
		if (context) {
			render = UI.renderWithData(template, context);
		} else {
			render = UI.render(template);
		}
		UI.insert(render, $(document.body).get(0));
	},

	renderModal: function(options) {
		options = options || {};

		// TODO we can make this better
//		if (options.onHidden) {
//			console.error('Sorry, we use the onHidden modal method so you can\'t');
//		}

		_(options).extend({
			onHidden: function() {
				$(this).remove();
			}
		});

		this.$('.ui.modal')
			.modal(options)
			.modal('show');
	},

	ask: function(header, content, cb, context) {
		Session.set('_dialogPlugin_YesNo_Header', header);
		Session.set('_dialogPlugin_YesNo_Content', content);
		this.showModal(Template._dialogPlugin_YesNo, context, {
			onApprove: function() {
				cb(true);
			},
			onDeny: function() {
				cb(false);
			}
		});
	}

};

Template._dialogPlugin_YesNo.header = function() {
	return Session.get('_dialogPlugin_YesNo_Header');
};

Template._dialogPlugin_YesNo.content = function() {
	return Session.get('_dialogPlugin_YesNo_Content');
};
