
var game = {}

game.bpm = 100
game.fps = 61
game.directions = ['left','down','up','right']

game.arrows = []

game.move_arrows = {}
game.move_arrows.step = 1000/60
game.move_arrows.speed = game.bpm/60

game.new_arrow = {}
game.new_arrow.step = 30000/game.bpm
game.new_arrow.y = 450

game.animate = {}
game.animate.step = 30000/game.bpm

game.ghost = {}
game.ghost.step = 60000/game.bpm

game.func = {}

game.func.Initialize = () => {
  game.start_time = Date.now()
  game.run_time = game.move_arrows.next = game.new_arrow.count = game.new_arrow.next = game.ghost.next = game.score = 0
  game.animate.next = game.animate.step
  game.double = 1
  game.cycle = game.func.Run()
}

game.func.Run = () => {
  game.run_time = Date.now() - game.start_time
  game.run_time >= game.move_arrows.next ? game.func.Move_Arrows() : 0
  game.run_time >= game.animate.next ? game.func.Animate() : 0
  game.run_time >= game.new_arrow.next ? game.func.New_Arrow() : 0
  game.run_time >= game.ghost.next ? game.func.Ghost() : 0
  setTimeout(game.func.Run,1000/game.fps)
}

game.func.Move_Arrows = () => {
  game.move_arrows.next += game.move_arrows.step
  var i = game.arrows.length; while (i--) {
    game.arrows[i].y -= game.move_arrows.speed
    if (game.arrows[i].y < 0) {game.func.White(i)}
    else {$(`#${game.arrows[i].cid}`).css('top',`${game.arrows[i].y}vmin`)}
  }
}

game.func.Animate = () => {
  game.animate.next += game.animate.step
  var i = game.arrows.length; while (i--) {
    game.arrows[i].num++
    game.arrows[i].num > 3 ? game.arrows[i].num = 0 : 0
    $(`#${game.arrows[i].cid}`).attr('src',`img/arrow_${game.arrows[i].num}.svg`)
  }
}

game.func.New_Arrow = () => {
  game.new_arrow.count > 99 ? game.new_arrow.count = 0 : 0
  game.new_arrow.next += game.new_arrow.step

  if (Math.random() < 1/24) {return 0}

  var arrow = {}
  arrow.num = 2
  arrow.cid = game.new_arrow.count
  arrow.y = game.new_arrow.y
  arrow.direction = game.func.Random_Direction()

  var i = game.arrows.length; if (i > 0 && Math.random() > 1/12) {
    while (arrow.direction == game.arrows[i-1].direction) {
      arrow.direction = game.func.Random_Direction()
    }
  }

  arrow.html = `<img src='img/arrow_${arrow.num}.svg' id='${arrow.cid}' style='top:${arrow.y}vmin'>`
  $(`#${arrow.direction}`).append(arrow.html)

  game.arrows.push(arrow)

  // double arrow
  if (Math.random() < 1/12 && game.double == 1) {
    var double = {}
    double.num = 2
    double.cid = game.new_arrow.count + 'a'
    double.y = game.new_arrow.y
    double.direction = game.func.Random_Direction()

    var i = game.arrows.length; while (double.direction == game.arrows[i-1].direction) {
      double.direction = game.func.Random_Direction()
    }

    double.html = `<img src='img/arrow_${double.num}.svg' id='${double.cid}' style='top:${double.y}vmin'>`
    $(`#${double.direction}`).append(double.html)

    game.arrows.push(double); game.double = 0
  } else {game.double = 1}

  game.new_arrow.count++
}

game.func.Random_Direction = () => {
  var r = Math.random() * 4 >> 0; var dir
  for (var j= 0; j < game.directions.length; j++) {r == j ? dir = game.directions[r] : 0}
  return dir
}

game.func.Ghost = () => {
  $('.ghost').css('opacity',0.75).fadeTo(15000/game.bpm,0.35)
  game.ghost.next += game.ghost.step
}

game.func.White = (i) => {
  $(`#${game.arrows[i].cid}`).remove()
  $(`#white_${game.arrows[i].direction}`).css('opacity',1).fadeTo(20000/game.bpm,0)
  game.arrows.splice(i,1)
}

document.addEventListener('keydown',(e) => {e.code == 'Space' ? game.func.Initialize() : 0})
