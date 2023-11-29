/**
 * @type {import('postcss').PluginCreator}
 */

const convertHSBToHSL = (h, s, b, a = 1) => {
	let lightness = ((2 - s / 100) * b) / 2
	let saturation

	if (lightness === 0 || lightness === 100) {
		// Hue and saturation don't matter when lightness is 0% or 100%
		saturation = 0
	} else if (lightness > 0 && lightness <= 50) {
		saturation = (s * b) / (100 - lightness * 2)
	} else {
		saturation = (s * b) / (2 * lightness)
	}

	// Clamp and round values to avoid exceeding limits and precision issues
	saturation = Math.min(100, Math.max(0, Math.round(saturation * 100) / 100))
	lightness = Math.round(lightness * 100) / 100

	return `hsla(${h}, ${saturation}%, ${lightness}%, ${a})`
}

module.exports = () => {
	return {
		postcssPlugin: 'postcss-hsb-to-hsl',
		Once(root) {
			root.walkDecls((decl) => {
				const hsbRegex =
					/hsb(a)?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(,\s*(\d+(\.\d+)?)%?\s*)?\)/g
				const hsbValues = decl.value.match(hsbRegex)

				if (hsbValues) {
					hsbValues.forEach((hsbValue) => {
						const matches = hsbValue.match(
							/hsb(a)?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(,\s*(\d+(\.\d+)?)%?\s*)?\)/
						)
						const h = parseInt(matches[2], 10)
						const s = parseInt(matches[3], 10)
						const b = parseInt(matches[4], 10)
						const a = matches[6] ? parseFloat(matches[6]) : 1
						const hslValue = convertHSBToHSL(h, s, b, a)
						decl.value = decl.value.replace(hsbValue, hslValue)
					})
				}
			})
		},
	}
}

module.exports.postcss = true
