/**
 * @type {import('postcss').PluginCreator}
 */

const convertHSBToHSL = (h, s, b, a = 1) => {
	const lightness = ((2 - s / 100) * b) / 2
	let saturation = s * b
	if (lightness > 0 && lightness <= 50) {
		saturation = saturation / (100 - lightness * 2)
	} else if (lightness > 50) {
		saturation = saturation / (2 * lightness)
	}
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
