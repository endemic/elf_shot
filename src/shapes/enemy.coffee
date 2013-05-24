###
@description Shape for enemy object. Behavior/display is dependent on the 'type' property.
Types:
	drone
	factory
	mine
	shooter
	tank
	tracker
###
define [
	'vectr'
], (Vectr) ->
	class Enemy extends Vectr.Shape
		constructor: (x, y, type) ->
			super(x, y)

			@shape = 'square'
			@type = if type? then type else 'drone'
			
			switch @type
				when 'drone'
					@color = 
						red: 255
						green: 0
						blue: 50
						alpha: 1
					@size = 35
					@speed = 75
					@solid = true
					@lineWidth = 3
				when 'shooter'
					@color = 
						red: 50
						green: 255
						blue: 50
						alpha: 1
					@size = 30
					@speed = 100
					@solid = true
					@lineWidth = 3

			@rotation = 270 * 180 / Math.PI
			@counter = 0
			@cycle = 1
			@shooting = false

		update: (delta) ->
			super(delta)

			switch @type
				when 'drone'
					# Color cycle
					@color.blue += @cycle;
					if @color.blue > 255 or @color.blue < 50 then @cycle *= -1

					# Increase speed over time; cap at 145 (player speed is 150)
					@counter += delta # seconds
					if @counter > 3 and @speed < 145 then @speed += 1

					# Find angle to target and move towards it
					if @target?
						@rotation = Math.atan2(@target.position.y - @position.y, @target.position.x - @position.x)
						@velocity.x = Math.cos(@rotation)
						@velocity.y = Math.sin(@rotation)
				when 'shooter'
					# Set a "shooting" flag based on logic here
					@counter += delta
					if @counter > 2
						@shooting = true
						@counter = 0

					# Find angle to target and move towards it
					if @target?
						@rotation = Math.atan2(@target.position.y - @position.y, @target.position.x - @position.x)
						@velocity.x = Math.cos(@rotation)
						@velocity.y = Math.sin(@rotation)

			# Enforce position w/in screen bounds
			if @position.x + @size / 2 > Vectr.WIDTH then @position.x = Vectr.WIDTH - @size / 2
			if @position.x - @size / 2 < 0 then @position.x = @size / 2
			if @position.y + @size / 2 > Vectr.HEIGHT then @position.y = Vectr.HEIGHT - @size / 2
			if @position.y - @size / 2 < 0 then @position.y = @size / 2

		reset: ->
			@color = 
				red: 255
				green: 0
				blue: 50
				alpha: 1

			@counter = 0
			@shooting = false
			@speed = 75