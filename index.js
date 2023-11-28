/**
 * @type {import('postcss').PluginCreator}
 */

const convertHSBToHSL = (h, s, b, a = 1) => {
	const l = ((2 - s) * b) / 2
	return `hsla(${h}, ${s}%, ${l}%, ${a})`
}

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
module.exports = (opts = {}) => {
	return {
		postcssPlugin: 'postcss-hsb-to-hsl',
		Once(root) {
			root.walkDecls((decl) => {
				const hsbRegex = /hsb\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(,\s*(\d+(\.\d+)?)%?\s*)?\)/g
				const hsbValues = decl.value.match(hsbRegex)

				if (hsbValues) {
					hsbValues.forEach((hsbValue) => {
						const matches = hsbValue.match(
							/hsb\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(,\s*(\d+(\.\d+)?)%?\s*)?\)/
						)
						const h = parseInt(matches[1], 10)
						const s = parseInt(matches[2], 10)
						const b = parseInt(matches[3], 10)
						const a = parseFloat(matches[5]) || 1
						const hslValue = convertHSBToHSL(h, s, b, a)
						decl.value = decl.value.replace(hsbValue, hslValue)
					})
				}
			})
		},
	}
}

module.exports.postcss = true
