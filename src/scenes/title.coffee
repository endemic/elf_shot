###
@description Title scene
###
define [
	'vectr'
	'buzz'
	'cs!scenes/game'
], (Vectr, Buzz, Game) ->
	
	class Title extends Vectr.Scene
		constructor: ->
			super()
			
			@clearColor = 'rgba(0, 0, 0, 0.25)'
			@add(new Vectr.Label("YAJ↓RUSH↑", "40px monospace", "rgba(255, 255, 255, 0.8)", Vectr.WIDTH / 2, Vectr.HEIGHT / 2))

		onKeyDown: (key) ->
			Vectr.changeScene Game

		onPointStart: (points) ->
			Vectr.changeScene Game