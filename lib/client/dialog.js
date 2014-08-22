Dialog2 = function(opts) {
	var self = this;

	// Defaults
	self.opts = _.extend({
		modalSettings: {}
	}, opts);

	self.rendered = null;
	self.removeTemplate = function() {
		console.log('Remove Template');
		_.delay(function(){
			UI.remove(self.rendered);
			self.rendered = undefined;
		}, 2000);
	};

	if (_(self.opts.modalSettings.onHidden).isFunction()) {
		console.log('onHidden exists, consuming...');
		var hiddenFunc = self.opts.modalSettings.onHidden;
		self.opts.modalSettings.onHidden = function() {
			hiddenFunc.call();
			self.removeTemplate.call();
		}
	} else {
		self.opts.modalSettings.onHidden = self.removeTemplate;
	}
};

Dialog2.prototype.show = function() {
	var self = this;

	if (_(self.opts.template.rendered).isFunction()) {
		console.log('Template.rendered exists, consuming...');
		var bkup = self.opts.template.rendered;

		self.opts.template.rendered = function() {
			console.log('Rendered');
			bkup.call(this);

			// Initialize and show modal
			this.$('.ui.modal')
				.modal(self.opts.modalSettings)
				.modal('show');

			// Reset rendered function
			self.opts.template.rendered = bkup;
		}
	} else {

		self.opts.template.rendered = function() {
			console.log('Rendered');
			this.$('.ui.modal')
				.modal(self.opts.modalSettings)
				.modal('show');

			self.opts.template.rendered = undefined;
		}
	}

	// Render and insert template
	this.rendered = (this.opts.context) ? UI.renderWithData(this.opts.template, this.opts.context) : UI.render(this.opts.template);
	UI.insert(this.rendered, $(document.body).get(0));
};

Dialog = {


//	display: function(template, context, options) {
//
//		var rendered = null;
//
//		if (!_(Dialog.templatesModified).contains(template)) {
//			if (_(template.rendered).isFunction()) {
//
//				var bkup = template.rendered;
//				template.rendered = function() {
//					bkup.call(this);
//					Dialog.modalRender.call(this);
//				};
//
//			} else {
//
//				template.rendered = function() {
//					Dialog.modalRender.call(this);
//				}
//
//			}
//
//			Dialog.templatesModified.push(template);
//		}
//
//
//
//	},
//
//	modalRender: function() {
//		options = options || {};
//		if (_(options.onHidden).isFunction()) {
//		}
//		this.$('.ui.modal')
//			.modal(options || {})
//			.modal('show');
//	},

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
