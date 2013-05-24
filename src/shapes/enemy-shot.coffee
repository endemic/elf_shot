###
@description Enemy bullets. "Type" property corresponds to the enemy that shoots it.
shooter -> reflect
tracker -> homing
###
define [
	'vectr'
], (Vectr) ->
	class EnemyShot extends Vectr.Shape
		constructor: (x, y, type, target) ->
			if not type? then throw new Error('EnemyShot requires a type argument.')

			super(x, y)

			@target = target
			@type = type
			@lineWidth = 5
			@size = 4
			@speed = 400

		# customPath: (context) ->
		# 	switch @type
		# 		when 'shooter'
		# 			# Draw a line behind the shot
		# 			context.beginPath()
		# 			context.lineTo(-@velocity.x * @speed, -@velocity.y * @speed)
		# 			context.closePath()
		# 			context.stroke()
		# 		when 'tracker'
		# 			# Draw an ellipse
		# 			cx = 1
		# 			cy = 1
		# 			rx = 2
		# 			ry = 2

		# 			context.save()

		# 			context.beginPath()
		# 			context.translate(cx - rx, cy - ry)
		# 			context.scale(rx, ry)
		# 			context.arc(1, 1, 1, 0, 2 * Math.PI, false)
		# 			context.closePath()
		# 			context.stroke()

		# 			context.restore()

		update: (delta) ->
			super(delta)

			switch @type
				when 'shooter'
					# Bounce off edges of screen
					if @position.x + @size / 2 > Vectr.WIDTH or @position.x - @size / 2 < 0 then @velocity.x *= -1
					if @position.y + @size / 2 > Vectr.HEIGHT or @position.y - @size / 2 < 0 then @velocity.y *= -1
				when 'tracker'
					# Slowly chage velocity towards target
					angle = Math.atan2(@target.position.y - @position.y, @target.position.x - @position.x)
					@velocity.x = Math.cos(angle)
					@velocity.y = Math.sin(angle)