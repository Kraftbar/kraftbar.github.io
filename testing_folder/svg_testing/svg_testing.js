function updateHeatmap(text) {
    let keys = [
        { label: "q", row: 0, col: 0, home: false },
        { label: "w", row: 0, col: 1, home: false },
        { label: "e", row: 0, col: 2, home: false },
        { label: "r", row: 0, col: 3, home: false },
        { label: "t", row: 0, col: 4, home: false },
        { label: "y", row: 0, col: 5, home: false },
        { label: "u", row: 0, col: 6, home: false },
        { label: "i", row: 0, col: 7, home: false },
        { label: "o", row: 0, col: 8, home: false },
        { label: "p", row: 0, col: 9, home: false },
        { label: "a", row: 1, col: 0, home: true },
        { label: "s", row: 1, col: 1, home: true },
        { label: "d", row: 1, col: 2, home: true },
        { label: "f", row: 1, col: 3, home: true },
        { label: "g", row: 1, col: 4, home: false },
        { label: "h", row: 1, col: 5, home: false },
        { label: "j", row: 1, col: 6, home: true },
        { label: "k", row: 1, col: 7, home: true },
        { label: "l", row: 1, col: 8, home: true },
        { label: ";", row: 1, col: 9, home: true },
        { label: "z", row: 2, col: 0, home: false },
        { label: "x", row: 2, col: 1, home: false },
        { label: "c", row: 2, col: 2, home: false },
        { label: "v", row: 2, col: 3, home: false },
        { label: "b", row: 2, col: 4, home: false },
        { label: "n", row: 2, col: 5, home: false },
        { label: "m", row: 2, col: 6, home: false },
        { label: ",", row: 2, col: 7, home: false },
        { label: ".", row: 2, col: 8, home: false },
        { label: "/", row: 2, col: 9, home: false },
    ]
	var charCounts = countChars(text)
    var keyWeights = weighKeys(charCounts, keys)

	let svg = el("svg", { width: 500, height: 200 }, el => {
        let keySize = 40
        
        for (let key of keys) {
            let x = (1 + key.col + key.row / 3) * keySize
            let y = (1 + key.row) * keySize
            let weight = keyWeights.get(key)
            
            el("circle", {
            	cx: x, cy: y,
                r: keySize * weight,
                style: `fill: rgba(255, ${255 * weight}, 0, 0.5)`,
            })
            
            el("text", {
            	x, y,
                "dominant-baseline": "middle",
                "text-anchor": "middle",
                style: `font: ${key.home ? "bold" : "normal"} ${keySize / 2}px serif`,
            }, key.label)
        }
    })
	let container = document.getElementById("heatmap-container")
    container.replaceChild(svg, container.firstChild)
}

function countChars(text) {
	let charCounts = new Map()
    for (let ch of text) {
        ch = ch.toLowerCase()
        let count = charCounts.get(ch) || 0
        charCounts.set(ch, count + 1)
    }
    return charCounts
}

function weighKeys(charCounts, keys) {
    let values = Array.from(charCounts.values())
    let min = Math.min(...values) - 1
    let max = Math.max(...values)
    let keyWeights = new Map()
    for (let key of keys) {
        let ch = key.label
        let weight = 0;
        if (charCounts.has(ch)) {
            let count = charCounts.get(ch)
            weight = (count - min) / (max - min)
        }
        keyWeights.set(key, weight)
    }
    return keyWeights
}

function el(name, attrs, children = null) {
	let thisEl = document.createElementNS ("http://www.w3.org/2000/svg", name)
    
    for (let attrName in attrs) {
    	thisEl.setAttribute(attrName, attrs[attrName])
    }
    
    switch (typeof children) {
    case "null":
        break
    case "function":
    	children((name, attrs, makeChildren = null) => {
        	let childEl = el(name, attrs, makeChildren)
            thisEl.appendChild(childEl)
        })
        break
    default:
    	childEl = document.createTextNode(children)
        thisEl.appendChild(childEl)
    }
    
    return thisEl
}

let sourceTextarea = document.getElementById("source")
sourceTextarea.addEventListener("input", (e) => { updateHeatmap(e.target.value) })
updateHeatmap("svg")