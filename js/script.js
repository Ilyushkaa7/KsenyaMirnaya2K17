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
    const emojis = ['👿', '😈'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    const fallingDiv = document.createElement('div');
    fallingDiv.className = 'falling-emoji';
    fallingDiv.textContent = emoji;
    
    const startX = Math.random() * window.innerWidth;
    const duration = 3 + Math.random() * 5;
    const size = 25 + Math.random() * 30;
    
    fallingDiv.style.left = startX + 'px';
    fallingDiv.style.top = '-50px';
    fallingDiv.style.fontSize = size + 'px';
    fallingDiv.style.animationDuration = duration + 's';
    
    fallingContainer.appendChild(fallingDiv);
    
    setTimeout(() => {
      if (fallingDiv && fallingDiv.remove) {
        fallingDiv.remove();
      }
    }, duration * 1000);
  }
  
  // Запускаем падающие эмодзи
  let fallingInterval;
  
  function startFallingEmojis() {
    if (fallingInterval) clearInterval(fallingInterval);
    fallingInterval = setInterval(() => {
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
  
  startFallingEmojis();
  
  // Функция создания конфетти
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
      
      setTimeout(() => {
        album.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    };
  }
  
  // ========== УЛУЧШЕННАЯ ЗАГРУЗКА ВИДЕО ПРЕВЬЮ ==========
  document.querySelectorAll('.card[data-type="video"]').forEach(card => {
    const src = card.dataset.src;
    if(src && src !== '') {
      // Проверяем существование файла
      const videoPreview = document.createElement('video');
      videoPreview.className = 'preview';
      videoPreview.muted = true;
      videoPreview.preload = 'metadata';
      videoPreview.playsInline = true;
      videoPreview.loop = false;
      
      // Добавляем обработчик ошибки
      videoPreview.onerror = function() {
        console.warn('Видео не найдено:', src);
        // Если видео не найдено, показываем заглушку
        const placeholder = document.createElement('div');
        placeholder.className = 'preview';
        placeholder.style.cssText = 'width:100%; height:280px; background: #331111; display:flex; align-items:center; justify-content:center; font-size:48px;';
        placeholder.innerHTML = '🎬❌';
        if(card.querySelector('.preview')) {
          card.querySelector('.preview').remove();
        }
        card.prepend(placeholder);
      };
      
      videoPreview.src = src;
      
      videoPreview.addEventListener('loadeddata', () => {
        try {
          videoPreview.currentTime = 0.3;
        } catch(e) {}
      });
      
      // Вставляем превью
      const p = card.querySelector('p');
      if(p) {
        card.insertBefore(videoPreview, p);
      } else {
        card.prepend(videoPreview);
      }
    }
  });
  
  // ========== УЛУЧШЕННОЕ ОТКРЫТИЕ ВИДЕО ==========
  document.querySelectorAll('.card').forEach(card => {
    card.onclick = (e) => {
      e.stopPropagation();
      
      const type = card.dataset.type;
      let src = card.dataset.src;
      const text = card.dataset.text || '😈 Злодейская история! 😈';
      
      content.innerHTML = '';
      
      if(type === 'image' && src) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Веселая фотка';
        img.onerror = function() {
          this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23331111"/%3E%3Ctext x="50" y="55" text-anchor="middle" fill="%23ff8888" font-size="40"%3E❌%3C/text%3E%3C/svg%3E';
        };
        content.appendChild(img);
      }
      
      if(type === 'video' && src) {
        const video = document.createElement('video');
        // Пробуем разные варианты расширений если файл не найден
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.style.maxWidth = '90vw';
        video.style.maxHeight = '75vh';
        video.style.backgroundColor = '#000';
        
        // Обработчик ошибки для видео
        video.onerror = function() {
          console.error('Видео не загрузилось:', src);
          // Показываем сообщение об ошибке
          const errorDiv = document.createElement('div');
          errorDiv.style.cssText = 'color:#ff8888; text-align:center; padding:40px; background:#2a1a1a; border-radius:20px;';
          errorDiv.innerHTML = '🎬 Видео не найдено 🎬<br><small style="font-size:14px">Файл: ' + src.split('/').pop() + '</small>';
          content.innerHTML = '';
          content.appendChild(errorDiv);
          
          // Добавляем текст под ошибкой
          const p = document.createElement('p');
          p.innerText = text + ' 😈';
          content.appendChild(p);
          return;
        };
        
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
  
  // Добавляем эмодзи в углы карточек
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
  
  // Летающие смайлы при наведении
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
  
  // Выводим список всех видео для отладки
  console.log('=== ПРОВЕРКА ВИДЕО ФАЙЛОВ ===');
  const videos = document.querySelectorAll('.card[data-type="video"]');
  videos.forEach((card, i) => {
    console.log(`Видео ${i+1}: ${card.dataset.src}`);
  });
  
  console.log('👿 Падающие эмодзи 👿 и 😈 активны!');
});