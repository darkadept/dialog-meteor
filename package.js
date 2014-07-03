Package.describe({
  summary: 'Modal Dialog using Semantic-UI'
});

Package.on_use(function (api) {
  api.use('jquery', 'client');
	api.use('semantic-ui-less', 'client');

  // for helpers
	api.use('templating', 'client');

	api.add_files('lib/client/dialog.html', 'client');
	api.add_files('lib/client/dialog.js', 'client');

	api.export('Dialog', 'client');
});
