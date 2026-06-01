(function () {
  const canvas = document.getElementById('gameCanvas');
  const game = new Game(canvas);
  const music = new MusicGenerator();
  game.music = music;

  window.addEventListener('keydown', (e) => {
    if (e.key === 'm' || e.key === 'M') {
      music.toggle();
    }
  });

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x > 740 && x < 800 && y < 30) {
      music.toggle();
      e.stopPropagation();
    }
  });

  function menuLoop(time) {
    if (game.state === 'menu') {
      game.renderer.drawBackground(time);
      game.renderer.drawMusicIcon(music.isPlaying);
      requestAnimationFrame(menuLoop);
    }
  }
  game.renderer.drawBackground(performance.now());
  game.renderer.drawMusicIcon(music.isPlaying);
  requestAnimationFrame(menuLoop);
})();
