###
@description Asset manifeset
###
define () ->
	Manifest = 
		sounds: 
			explosion: 
				src: 'assets/sounds/explosion'
				formats: [ 'mp3', 'ogg' ]
			shoot: 
				src: 'assets/sounds/shoot'
				formats: [ 'mp3', 'ogg' ]
		music: {}
		images: {}