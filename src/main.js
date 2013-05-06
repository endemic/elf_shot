require({
	paths: {
		cs: '../coffeescript/cs',
		'coffee-script': '../coffeescript/coffee-script',
		vectr: '../lib/vectr.min',
		buzz: '../lib/buzz'
	},
  shim: {
  		'vectr': {
  			exports: 'Vectr'
  		},
      'buzz': {
        exports: 'buzz'
      }
    }
}, ['cs!app']);
