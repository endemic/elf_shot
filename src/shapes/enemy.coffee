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
	distance = (point1, point2) ->
		return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));

	class Enemy extends Vectr.Shape
		constructor: (x, y, type) ->
			super(x, y)

			@shape = 'square'
			@type = if type? then type else 'drone'
			
			switch @type
				when 'drone'
					@color = @originalColor =
						red: 255
						green: 0
						blue: 50
						alpha: 1
					@size = 35
					@speed = @originalSpeed = 75
					@solid = true
					@lineWidth = 3
				when 'shooter'
					@color = @originalColor = 
						red: 50
						green: 255
						blue: 50
						alpha: 1
					@size = 30
					@speed = @originalSpeed = 100
					@solid = true
					@lineWidth = 3
				when 'mine'
					@shape = 'circle'
					@color = @originalColor = 
						red: 0
						green: 255
						blue: 0
						alpha: 0.5
					@size = 20
					@speed = @originalSpeed = 0
					@solid = true
					@lineWidth = 3
				when 'factory'
					@shape = 'circle'
					@color = @originalColor = 
						red: 0
						green: 255
						blue: 255
						alpha: 1
					@size = 20
					@speed = @originalSpeed = 90
					@solid = true
					@lineWidth = 3
				when 'tank'
					@shape = 'circle'
					@color = @originalColor = 
						red: 255
						green: 255
						blue: 0
						alpha: 1
					@size = 50
					@speed = @originalSpeed = 50
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

					# Move away from player if the player gets too close
					if @target?
						@rotation = Math.atan2(@target.position.y - @position.y, @target.position.x - @position.x)
						
						if distance(@target.position, @position) < 300
							@velocity.x = -Math.cos(@rotation)
							@velocity.y = -Math.sin(@rotation)
						else
							@velocity.x = 0
							@velocity.y = 0

				when 'mine'
					@color.alpha -= @cycle / 255;
					if @color.alpha >= 0.5 or @color.alpha < 0.1 then @cycle *= -1

				when 'factory'
					# Set a "shooting" flag based on logic here
					@counter += delta
					if @counter > 5
						@shooting = true
						@counter = 0

					# TODO: wander logic

				when 'tank'
					# Choose a random destination to move to
					# TODO: weight the directions closer to the player
					if @destination == undefined or distance(@position, @destination) < 1
						@destination = 
							x: @position.x
							y: @position.y
						
						axis = Math.random()
						direction = Math.random()
						
						# move along x-axis
						if axis > 0.5
							@destination.x += if direction > 0.5 then @size else -@size
						# move along y-axis
						else
							@destination.y += if direction > 0.5 then @size else -@size

						# TODO: Try to consolidate this
						while @destination.x < 0 or @destination.x > Vectr.WIDTH or @destination.y < 0 or @destination.y > Vectr.HEIGHT
							axis = Math.random()
							direction = Math.random()
							
							# move along x-axis
							if axis > 0.5
								@destination.x += if direction > 0.5 then @size else -@size
							# move along y-axis
							else
								@destination.y += if direction > 0.5 then @size else -@size

						@rotation = Math.atan2(@destination.y - @position.y, @destination.x - @position.x)
						
						@velocity =
							x: Math.cos(@rotation)
							y: Math.sin(@rotation)

			# Enforce position w/in screen bounds
			if @position.x + @size / 2 > Vectr.WIDTH then @position.x = Vectr.WIDTH - @size / 2
			if @position.x - @size / 2 < 0 then @position.x = @size / 2
			if @position.y + @size / 2 > Vectr.HEIGHT then @position.y = Vectr.HEIGHT - @size / 2
			if @position.y - @size / 2 < 0 then @position.y = @size / 2

		reset: ->
			@color = @originalColor
			@speed = @originalSpeed
			@counter = 0
			@shooting = false