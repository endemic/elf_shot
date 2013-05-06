###
@description Shape for virtual joystick
###
define [
	'vectr'
], (Vectr) ->
	
	class Joystick extends Vectr.Shape
		constructor: (x, y) ->
			super(x, y)
			
			@lineWidth = 5
			@size = 100
		
		customPath: (context) ->
			context.beginPath()
			
			# Triangle inside inner circle
			# context.moveTo(@size / 4 * Math.cos(0), @size / 4 * Math.sin(0))
			# context.lineTo(@size / 4 * Math.cos(120 * Math.PI / 180), @size / 4 * Math.sin(120 * Math.PI / 180))
			# context.lineTo(@size / 4 * Math.cos(240 * Math.PI / 180), @size / 4 * Math.sin(240 * Math.PI / 180))
			# context.lineTo(@size / 4 * Math.cos(0), @size / 4 * Math.sin(0))

			# Two circles
			context.arc(0, 0, @size / 2, 360, false)
			context.arc(0, 0, @size / 4, 360, false)

			context.closePath()

			context.strokeStyle = 'rgba(' + @color.red + ', ' + @color.green + ', ' + @color.blue + ', ' + @color.alpha + ')'
			context.stroke()