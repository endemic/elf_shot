###
@description App controller; handles instantiating scenes, music, sfx
###
define [
	'vectr'
	'buzz'
	'cs!manifest'
	'cs!scenes/title'
	'cs!scenes/game'
], (Vectr, Buzz, Manifest, Title, Game) ->

	# Load sounds
	for key, sound of Manifest.sounds
		if Vectr.env.cordova is true
			Vectr.sounds[key] = new Media("#{sound.src}.#{sound.formats[0]}")
		else
			Vectr.sounds[key] = new Buzz.sound sound.src,
				formats: sound.formats
				preload: true

	# Load music
	for key, music of Manifest.music
		if Vectr.env.cordova is true
			Vectr.music[key] = new Media("#{music.src}.#{music.formats[0]}")
		else
			Vectr.music[key] = new Buzz.sound music.src,
				formats: music.formats
				preload: true
				loop: true

	# Load the app; wait until "deviceready" event is fired, if necessary (Cordova only)
	if Vectr.env.cordova is true
		document.addEventListener "deviceready", ->
			window.yajirushi = new Vectr.Game 1024, 768, Title
		, false
	else
		window.yajirushi = new Vectr.Game 1024, 768, Game