###
@description Game scene
###
define [
	'vectr'
	'buzz'
	'cs!shapes/player'
	'cs!shapes/joystick'
], (Vectr, Buzz, Player, Joystick) ->
	
	class Game extends Vectr.Scene
		constructor: ->
			super()
			
			@clearColor = 'rgba(0, 0, 0, 0.2)'

			# Set up player
			@player = new Player(Vectr.WIDTH / 2, Vectr.HEIGHT / 2)
			@add(@player)

			# Set up player projectiles
			@playerBullets = new Vectr.Pool()
			@add(@playerBullets)

			i = 20;
			while (i -= 1)
				b = new Vectr.Shape(0, 0, "circle", 5)
				b.solid = true
				b.speed = 600
				b.active = false
				@playerBullets.add b

			# Set up virtual joysticks
			@leftStick = new Joystick(0, 0)
			@leftStick.active = false
			@add(@leftStick)
			
			@rightStick = new Joystick(0, 0)
			@rightStick.active = false
			@add(@rightStick)

			@leftTouchIndex = null	# Index of the touch that's on the left side of the screen
			@rightTouchIndex = null 	# Index of the touch that's on the right side of the screen

		update: (delta) ->
			super(delta)

			# Handle shooting
			@player.timeout += delta
			if (@player.shooting.x != 0 or @player.shooting.y != 0) and @player.timeout > @player.shootRate
				@player.timeout = 0
				b = @playerBullets.activate()

				if b?
					Vectr.playSfx('shoot')
					b.velocity.x = Math.cos(@player.rotation * Math.PI / 180)
					b.velocity.y = Math.sin(@player.rotation * Math.PI / 180)
					b.position.x = @player.position.x + b.velocity.x * @player.size / 2
					b.position.y = @player.position.y + b.velocity.y * @player.size / 2


			# Update bullets
			i = @playerBullets.length
			while (i--) 
				b = @playerBullets.at(i)

				if b? and (b.position.y > Vectr.HEIGHT or b.position.y < 0 or b.position.x > Vectr.WIDTH or b.position.x < 0)
					@playerBullets.deactivate(i)

				# TODO: collision detection vs. enemies

		onKeyDown: (key) ->
			switch key
				when 'w' then @player.velocity.y -= 1
				when 's' then @player.velocity.y += 1
				when 'a' then @player.velocity.x -= 1
				when 'd' then @player.velocity.x += 1
				when 'left' then @player.shooting.x -= 1
				when 'right' then @player.shooting.x += 1
				when 'up' then @player.shooting.y -= 1
				when 'down' then @player.shooting.y += 1

		onKeyUp: (key) ->
			switch key
				when 'w' then @player.velocity.y += 1
				when 's' then @player.velocity.y -= 1
				when 'a' then @player.velocity.x += 1
				when 'd' then @player.velocity.x -= 1
				when 'left' then @player.shooting.x += 1
				when 'right' then @player.shooting.x -= 1
				when 'up' then @player.shooting.y += 1
				when 'down' then @player.shooting.y -= 1

		onPointStart: (points) ->
			# Try to get the left/right point indices
			for point, index in points
				if @leftTouchIndex is null and 0 < point.x < Vectr.WIDTH / 2 then @leftTouchIndex = index
				if @rightTouchIndex is null and Vectr.WIDTH / 2 < point.x < Vectr.WIDTH then @rightTouchIndex = index

			if @leftStick.active == false and @leftTouchIndex != null
				@leftStick.active = true
				@leftStick.position.x = points[@leftTouchIndex].x
				@leftStick.position.y = points[@leftTouchIndex].y

			if @rightStick.active == false and @rightTouchIndex != null
				@rightStick.active = true
				@rightStick.position.x = points[@rightTouchIndex].x
				@rightStick.position.y = points[@rightTouchIndex].y

		onPointMove: (points) ->
			# Figure out angle from left/right touches to the location of the joysticks

			if @leftTouchIndex != null
				angle = Math.atan2(points[@leftTouchIndex].y - @leftStick.position.y, points[@leftTouchIndex].x - @leftStick.position.x)
				@leftStick.rotation = angle * 180 / Math.PI + 180
				@player.velocity.x = Math.cos(angle)
				@player.velocity.y = Math.sin(angle)

			if @rightTouchIndex != null
				angle = Math.atan2(points[@rightTouchIndex].y - @rightStick.position.y, points[@rightTouchIndex].x - @rightStick.position.x)
				@rightStick.rotation = angle * 180 / Math.PI + 180
				@player.shooting.x = Math.cos(angle)
				@player.shooting.y = Math.sin(angle)

		onPointEnd: (points) ->
			# TODO: This deactivates both sticks when one touch ends, needs to determine which touch(es) are still valid for a joystick
			@player.velocity.x = @player.velocity.y = 0
			@player.shooting.x = @player.shooting.y = 0

			@leftStick.active = false
			@leftTouchIndex = null

			@rightStick.active = false
			@rightTouchIndex = null