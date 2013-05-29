###
@description Game scene
###
define [
	'vectr'
	'buzz'
	'cs!shapes/player'
	'cs!shapes/joystick'
	'cs!shapes/enemy'
	'cs!shapes/enemy-shot'
], (Vectr, Buzz, Player, Joystick, Enemy, EnemyShot) ->
	
	class Game extends Vectr.Scene
		constructor: ->
			super()
			
			@clearColor = 'rgba(0, 0, 0, 0.15)'

			@level = 1

			# Set up player
			@player = new Player(Vectr.WIDTH / 2, Vectr.HEIGHT / 2)
			@add(@player)

			# Set up player projectiles
			@playerBullets = new Vectr.Pool()
			@add(@playerBullets)

			i = 20;
			while i -= 1
				b = new Vectr.Shape(0, 0, "circle", 5)
				b.solid = true
				b.speed = 650
				b.active = false
				@playerBullets.add(b)

			# Set up enemy projectiles
			@enemyBullets = new Vectr.Pool()
			@add(@enemyBullets)

			i = 20;
			while i -= 1
				b = new EnemyShot(0, 0, "shooter", @player)
				b.active = false
				@enemyBullets.add(b)

			# Set up basic enemies
			@enemies = new Vectr.Pool()
			@add(@enemies)

			i = 50
			while i -= 1
				e = new Enemy(0, 0, 'drone')
				e.target = @player
				e.active = false
				@enemies.add(e)

			# particle emitters
			@particles = new Vectr.Pool()
			@add(@particles)

			i = 5;
			while i--
				e = new Vectr.Emitter(30, 0.5, 'circle', 4, 'rgba(255, 0, 0, 1)')
				@particles.add(e)

			# Set up virtual joysticks
			@leftStick = new Joystick(0, 0)
			@leftStick.active = false
			@add(@leftStick)
			
			@rightStick = new Joystick(0, 0)
			@rightStick.active = false
			@add(@rightStick)

			@leftTouchIndex = null	# Index of the touch that's on the left side of the screen
			@rightTouchIndex = null 	# Index of the touch that's on the right side of the screen

			@setup()

		###
		@description Initialize a new level by spawning a number of enemies, moving the player character to the center, etc.
		###
		setup: ->
			@player.position.x = Vectr.WIDTH / 2
			@player.position.y = Vectr.HEIGHT / 2

			@playerBullets.deactivateAll()
			@enemyBullets.deactivateAll()
			@enemies.deactivateAll()

			# number of enemies
			i = Math.round(@level * 1.5)

			while i -= 1
				e = @enemies.activate()

				if e != null
					e.reset()
					e.position.x = Math.random() * Vectr.WIDTH
					e.position.y = Math.random() * Vectr.HEIGHT

					# Don't allow enemies to be spawned within a 200 px square of the player
					while e.collidesWith({ position: { x: Vectr.WIDTH / 2, y: Vectr.HEIGHT / 2 }, size: 200 })
						e.position.x = Math.random() * Vectr.WIDTH
						e.position.y = Math.random() * Vectr.HEIGHT

					e.active = true

		update: (delta) ->
			super(delta)

			# Handle player shooting
			@player.timeout += delta
			if (@player.shooting.x != 0 or @player.shooting.y != 0) and @player.timeout > @player.shootRate
				@player.timeout = 0
				b = @playerBullets.activate()

				if b != null
					Vectr.playSfx('shoot')
					b.velocity.x = Math.cos(@player.rotation)
					b.velocity.y = Math.sin(@player.rotation)
					b.position.x = @player.position.x + b.velocity.x * @player.size / 2
					b.position.y = @player.position.y + b.velocity.y * @player.size / 2

			# Update player bullets
			i = @playerBullets.length
			while i--
				b = @playerBullets.at(i)

				if b is null then continue

				if b.position.y > Vectr.HEIGHT or b.position.y < 0 or b.position.x > Vectr.WIDTH or b.position.x < 0
					@playerBullets.deactivate(i)
					continue

				# Collision detection (player shots vs. enemies)
				j = @enemies.length
				while j--
					e = @enemies.at(j)

					if e is null then continue

					if e.collidesWith(b)
						particles = this.particles.activate();
						if particles != null
							particles.color.red = e.color.red
							particles.color.green = e.color.green
							particles.color.blue = e.color.blue
							particles.start(b.position.x, b.position.y)
						
						Vectr.playSfx('explosion')

						@enemies.deactivate(j)
						@playerBullets.deactivate(i)
						break

			# Update enemies
			j = @enemies.length
			while j--
				e = @enemies.at(j)

				if e is null then continue

				# Handle enemy shooting
				if e.shooting
					b = @enemyBullets.activate()

					if b != null
						e.shooting = false
						b.type = e.type
						b.velocity.x = Math.cos(e.rotation)
						b.velocity.y = Math.sin(e.rotation)
						b.position.x = e.position.x + b.velocity.x * e.size / 2
						b.position.y = e.position.y + b.velocity.y * e.size / 2

				# Collision detection (enemies vs. player)
				if e.collidesWith(@player)
					@setup()

			# Update enemy bullets
			i = @enemyBullets.length
			while i--
				b = @enemyBullets.at(i)

				if b is null then continue

				if b.position.y > Vectr.HEIGHT or b.position.y < 0 or b.position.x > Vectr.WIDTH or b.position.x < 0 or b.lifetime > 2
					@enemyBullets.deactivate(i)
					continue

				# Collision detection w/ player
				if b.collidesWith(@player)
					@setup()

			# TEMP: Level complete condition
			if @enemies.length is 0
				@level += 1
				@setup()

		onKeyDown: (key) ->
			switch key
				when 'w' then @player.angle.y -= 1
				when 's' then @player.angle.y += 1
				when 'a' then @player.angle.x -= 1
				when 'd' then @player.angle.x += 1

				when 'left' then @player.shooting.x -= 1
				when 'right' then @player.shooting.x += 1
				when 'up' then @player.shooting.y -= 1
				when 'down' then @player.shooting.y += 1

			# If "angle" var is set, determine velocity vector
			if @player.angle.x != 0 or @player.angle.y != 0
				angle = Math.atan2(@player.angle.y, @player.angle.x)
				@player.velocity.x = Math.cos(angle)
				@player.velocity.y = Math.sin(angle)
			else
				@player.velocity.x = @player.velocity.y = 0

		onKeyUp: (key) ->
			switch key
				when 'w' then @player.angle.y += 1
				when 's' then @player.angle.y -= 1
				when 'a' then @player.angle.x += 1
				when 'd' then @player.angle.x -= 1

				when 'left' then @player.shooting.x += 1
				when 'right' then @player.shooting.x -= 1
				when 'up' then @player.shooting.y += 1
				when 'down' then @player.shooting.y -= 1

			# If "angle" var is set, determine velocity vector
			if @player.angle.x != 0 or @player.angle.y != 0
				angle = Math.atan2(@player.angle.y, @player.angle.x)
				@player.velocity.x = Math.cos(angle)
				@player.velocity.y = Math.sin(angle)
			else
				@player.velocity.x = @player.velocity.y = 0

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
				@leftStick.rotation = angle
				@player.angle.x = Math.cos(angle)
				@player.angle.y = Math.sin(angle)

			if @rightTouchIndex != null
				angle = Math.atan2(points[@rightTouchIndex].y - @rightStick.position.y, points[@rightTouchIndex].x - @rightStick.position.x)
				@rightStick.rotation = angle
				@player.shooting.x = Math.cos(angle)
				@player.shooting.y = Math.sin(angle)

		onPointEnd: (points) ->
			# TODO: This deactivates both sticks when one touch ends, needs to determine which touch(es) are still valid for a joystick
			@player.angle.x = @player.angle.y = 0
			@player.shooting.x = @player.shooting.y = 0

			@leftStick.active = false
			@leftTouchIndex = null

			@rightStick.active = false
			@rightTouchIndex = null