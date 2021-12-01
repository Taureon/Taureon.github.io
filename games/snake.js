window.onload = async () => {
	var fetchedEmojis = {}
	async function fetchDiscordSVG(emojiName) {
		if (fetchedEmojis[emojiName]) return fetchedEmojis[emojiName]
		return fetchedEmojis[emojiName] = await (await fetch(window.location.origin + "/assets/discordEmojis/" + emojiName + ".svg")).text()
	}

	class Game {
		constructor() {
			this.raw = [
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0]
			]
			this.mode = 0
			this.pos = {
				x: Math.floor(Math.random() * 9),
				y: Math.floor(Math.random() * 9)
			}
			this.length = 1
			this.raw[this.pos.y][this.pos.x] = this.length
			this.tileset = []
			this.apple = {}
			this.spawnapple();
		}
		spawnapple() {
			var selected = {
				x: Math.floor(Math.random() * 9),
				y: Math.floor(Math.random() * 9)
			};
			while (this.raw[selected.y][selected.x]) {
				selected.x = Math.floor(Math.random() * 9)
				selected.y = Math.floor(Math.random() * 9)
			}
			this.raw[selected.y][selected.x] = -1
		}
		move(dir) {
			var offset = { x: 0, y: 0 };
			switch (dir) {
				case 0://left
					offset.x += this.mode === 3 ? 1 : -1
					break;
				case 1://up
					offset.y += this.mode === 3 ? 1 : -1
					break;
				case 2://down
					offset.y += this.mode === 3 ? -1 : 1
					break;
				case 3://right
					offset.x += this.mode === 3 ? -1 : 1
			}
			if (this.raw[(this.pos.y + offset.y + 9) % 9][(this.pos.x + offset.x + 9) % 9] < 1) {
				if (this.raw[(this.pos.y + offset.y + 9) % 9][(this.pos.x + offset.x + 9) % 9] === -1) {
					if (this.mode === 1) this.won = true;
					this.length++
					this.spawnapple()
					this.incrementall(1)
					this.mode = 0;
				}
				this.incrementall(-1)
				this.pos.y += offset.y
				this.pos.x += offset.x
				this.pos.y = (this.pos.y + 9) % 9
				this.pos.x = (this.pos.x + 9) % 9
				this.raw[this.pos.y][this.pos.x] = this.length
				if (this.mode === 2 && !this.wouldBeRunningIntoWall(this.pos, offset)) this.charge(offset);
				if (this.length === 1) this.mode = Math.round(Math.random()*Math.random())*Math.ceil(Math.random()*3)
			} else {
				this.won = true
			}
		}
		charge(offset) {
			while (!this.wouldBeRunningIntoWall(this.pos, offset))
			if (this.raw[this.pos.y + offset.y][this.pos.x + offset.x] > 1) return;
			if (this.raw[this.pos.y + offset.y][this.pos.x + offset.x] === -1) {
				this.length++
				this.spawnapple()
				this.incrementall(1)
			}
			this.incrementall(-1)
			this.pos.y += offset.y
			this.pos.x += offset.x
			this.raw[this.pos.y][this.pos.x] = this.length
		}
		wouldBeRunningIntoWall(position, direction) {
			return position.x + direction.x === -1 || position.y + direction.y === -1 || position.x + direction.x === this.raw.length || position.y + direction.y === this.raw[0].length;
		}
		incrementall(inc) {
			for (var y = 0; y < 9; y++) {
				for (var x = 0; x < 9; x++) {
					if (this.raw[y][x] > 0) this.raw[y][x] += inc
				}
			}
		}
	}
	var game = new Game();
	game.tileset = await Promise.all([[
		"apple",
		"black_large_square",
		"flushed",
		"yellow_square",
		"yellow_circle"
	],[
		"apple",
		"black_large_square",
		"sick",
		"green_square",
		"green_circle"
	],[
		"apple",
		"black_large_square",
		"rage",
		"red_square",
		"red_circle"
	],[
		"apple",
		"black_large_square",
		"smiling_imp",
		"purple_square",
		"purple_circle"
	]].map(async mode => {return await Promise.all(mode.map(emoji => {return fetchDiscordSVG(emoji)}))}));
	var gridDiv = document.getElementById("grid");
}