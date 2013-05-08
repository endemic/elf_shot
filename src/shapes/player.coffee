###
@description Shape for player avatar
###
define [
	'vectr'
], (Vectr) ->
	class Player extends Vectr.Shape
		constructor: (x, y) ->
			super(x, y)

			@shape = 'triangle'
			@size = 40
			@speed = 150
			@lineWidth = 3
			@rotation = 270 * 180 / Math.PI

			@shootRate = 0.15
			@timeout = 0
			@shooting = 
				x: 0
				y: 0

		customPath: (context) ->
			context.beginPath()

			# Circle
			context.arc(1, 0, @size / 2, 360, false)

			# Inner triangle
			context.moveTo(@size / 2 * Math.cos(0), @size / 2 * Math.sin(0))
			context.lineTo(@size / 2 * Math.cos(120 * Math.PI / 180), @size / 2 * Math.sin(120 * Math.PI / 180))
			context.lineTo(-@size / 10, 0)
			context.lineTo(@size / 2 * Math.cos(240 * Math.PI / 180), @size / 2 * Math.sin(240 * Math.PI / 180))
			context.lineTo(@size / 2 * Math.cos(0), @size / 2 * Math.sin(0))

			context.closePath()

			context.strokeStyle = 'rgba(' + @color.red + ', ' + @color.green + ', ' + @color.blue + ', ' + @color.alpha + ')'
			context.stroke()

		update: (delta) ->
			super(delta)

			# Update player rotation
			if @velocity.x != 0 or @velocity.y != 0
				@rotation = Math.atan2(@velocity.y, @velocity.x)

			# If shooting buttons are pressed, those take precedence over directional buttons
			if @shooting.x != 0 or @shooting.y != 0
				@rotation = Math.atan2(@shooting.y, @shooting.x)

			# Enforce position w/in screen bounds
			if @position.x + @size / 2 > Vectr.WIDTH then @position.x = Vectr.WIDTH - @size / 2
			if @position.x - @size / 2 < 0 then @position.x = @size / 2
			if @position.y + @size / 2 > Vectr.HEIGHT then @position.y = Vectr.HEIGHT - @size / 2
			if @position.y - @size / 2 < 0 then @position.y = @size / 2