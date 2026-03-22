// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
  
  // Элементы
  const btn = document.getElementById('start-btn');
  const start = document.getElementById('start-screen');
  const album = document.getElementById('album');
  const title = document.getElementById('big-title');
  const overlay = document.getElementById('overlay');
  const content = document.getElementById('overlay-content');
  const close = document.getElementById('close');
  const fallingContainer = document.getElementById('falling-emojis-container');
  
  // ========== ФУНКЦИЯ СОЗДАНИЯ ПАДАЮЩИХ ЭМОДЗИ 👿😈 ==========
  function createFallingEmoji() {
    const emojis = ['👿', '😈']; // ТОЛЬКО ЭТИ ДВА!
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    const fallingDiv = document.createElement('div');
    fallingDiv.className = 'falling-emoji';
    fallingDiv.textContent = emoji;
    
    // Случайная позиция по горизонтали (от 0 до ширины экрана)
    const startX = Math.random() * window.innerWidth;
    // Случайная скорость падения (от 3 до 8 секунд)
    const duration = 3 + Math.random() * 5;
    // Случайный размер (от 25px до 50px)
    const size = 25 + Math.random() * 30;
    
    fallingDiv.style.left = startX + 'px';
    fallingDiv.style.top = '-50px';
    fallingDiv.style.fontSize = size + 'px';
    fallingDiv.style.animationDuration = duration + 's';
    
    fallingContainer.appendChild(fallingDiv);
    
    // Удаляем элемент после завершения анимации
    setTimeout(() => {
      if (fallingDiv && fallingDiv.remove) {
        fallingDiv.remove();
      }
    }, duration * 1000);
  }
  
  // ========== ЗАПУСКАЕМ ПАДАЮЩИЕ ЭМОДЗИ ==========
  // Создаем эмодзи каждые 0.5 секунд
  let fallingInterval;
  
  function startFallingEmojis() {
    if (fallingInterval) clearInterval(fallingInterval);
    fallingInterval = setInterval(() => {
      // Создаем от 1 до 3 эмодзи за раз
      const count = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < count; i++) {
        createFallingEmoji();
      }
    }, 400);
  }
  
  function stopFallingEmojis() {
    if (fallingInterval) {
      clearInterval(fallingInterval);
      fallingInterval = null;
    }
  }
  
  // Запускаем падающие эмодзи сразу после загрузки страницы
  startFallingEmojis();
  
  // Функция создания конфетти эффекта при старте (злодейское конфетти)
  function createConfetti() {
    const villainEmojis = ['👿', '😈', '👿', '😈', '👿', '😈'];
    for(let i = 0; i < 60; i++) {
      const conf = document.createElement('div');
      conf.innerHTML = villainEmojis[Math.floor(Math.random() * villainEmojis.length)];
      conf.style.position = 'fixed';
      conf.style.left = Math.random() * window.innerWidth + 'px';
      conf.style.top = window.innerHeight / 2 + 'px';
      conf.style.fontSize = (20 + Math.random() * 35) + 'px';
      conf.style.pointerEvents = 'none';
      conf.style.zIndex = '9999';
      conf.style.animation = 'floatUp 1.5s ease-out forwards';
      document.body.appendChild(conf);
      setTimeout(() => conf.remove(), 1500);
    }
  }
  
  // Кнопка старта
  if(btn) {
    btn.onclick = () => {
      start.style.display = 'none';
      title.style.display = 'block';
      album.style.display = 'block';
      createConfetti();
      
      // Прокрутка к началу альбома
      setTimeout(() => {
        album.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    };
  }
  
  // Автопревью для видео
  document.querySelectorAll('.card[data-type="video"]').forEach(card => {
    const src = card.dataset.src;
    if(src && src !== '') {
      const videoPreview = document.createElement('video');
      videoPreview.src = src;
      videoPreview.className = 'preview';
      videoPreview.muted = true;
      videoPreview.preload = 'metadata';
      videoPreview.playsInline = true;
      videoPreview.loop = false;
      
      videoPreview.addEventListener('loadeddata', () => {
        try {
          videoPreview.currentTime = 0.3;
        } catch(e) {}
      });
      
      // Вставляем превью перед параграфом
      const p = card.querySelector('p');
      if(p) {
        card.insertBefore(videoPreview, p);
      } else {
        card.prepend(videoPreview);
      }
    }
  });
  
  // Открытие карточки (фото/видео по центру)
  document.querySelectorAll('.card').forEach(card => {
    card.onclick = (e) => {
      e.stopPropagation();
      
      const type = card.dataset.type;
      const src = card.dataset.src;
      const text = card.dataset.text || '😈 Злодейская история! 😈';
      
      content.innerHTML = '';
      
      if(type === 'image' && src) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Веселая фотка';
        content.appendChild(img);
      }
      
      if(type === 'video' && src) {
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.style.maxWidth = '90vw';
        video.style.maxHeight = '75vh';
        content.appendChild(video);
      }
      
      const p = document.createElement('p');
      const villainEndings = ['👿', '😈', '👿', '😈', '👿', '😈', '💀', '🔥'];
      p.innerText = text + ' ' + villainEndings[Math.floor(Math.random() * villainEndings.length)];
      content.appendChild(p);
      
      overlay.classList.add('show');
    };
  });
  
  // Закрытие оверлея
  if(close) {
    close.onclick = () => {
      overlay.classList.remove('show');
      // Останавливаем видео, если оно играло
      const video = content.querySelector('video');
      if(video) {
        video.pause();
        video.currentTime = 0;
      }
      setTimeout(() => {
        content.innerHTML = '';
      }, 300);
    };
  }
  
  // Закрытие по клику на фон
  overlay.addEventListener('click', (e) => {
    if(e.target === overlay) {
      overlay.classList.remove('show');
      const video = content.querySelector('video');
      if(video) video.pause();
      setTimeout(() => content.innerHTML = '', 300);
    }
  });
  
  // Добавляем злодейские эмодзи в углы карточек (только 👿😈)
  const villainEmojisCorner = ['👿', '😈', '👿', '😈', '👿', '😈', '👿', '😈'];
  document.querySelectorAll('.card').forEach((card, idx) => {
    const badge = document.createElement('div');
    badge.style.position = 'absolute';
    badge.style.bottom = '10px';
    badge.style.right = '15px';
    badge.style.fontSize = '28px';
    badge.style.opacity = '0.6';
    badge.style.pointerEvents = 'none';
    badge.innerText = villainEmojisCorner[idx % villainEmojisCorner.length];
    card.style.position = 'relative';
    card.appendChild(badge);
  });
  
  // Добавляем летающие злодейские смайлы при наведении на карточки (только 👿😈)
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', function(e) {
      const villainFly = ['👿', '😈'];
      const emoji = villainFly[Math.floor(Math.random() * villainFly.length)];
      const flyer = document.createElement('div');
      flyer.innerText = emoji;
      flyer.style.position = 'fixed';
      flyer.style.left = e.clientX + 'px';
      flyer.style.top = e.clientY + 'px';
      flyer.style.fontSize = '35px';
      flyer.style.pointerEvents = 'none';
      flyer.style.zIndex = '9999';
      flyer.style.animation = 'floatUp 0.8s ease-out forwards';
      document.body.appendChild(flyer);
      setTimeout(() => flyer.remove(), 800);
    });
  });
  
  console.log('👿 Падающие эмодзи 👿 и 😈 активны! Злодейское веселье началось!');
});