document.addEventListener('DOMContentLoaded', () => {
  // 作品輪播區載入 assets.json
  fetch('assets.json')
    .then(response => response.json())
    .then(data => {
      const slider = document.querySelector('.slider');

      // 針對每個類別處理
      Object.keys(data).forEach(category => {
        data[category].forEach(item => {
          // 建立 slide 容器
          const slide = document.createElement('div');
          slide.classList.add('slide');

          // 建立作品資訊區塊 (僅顯示 category 與 title)
          const workInfo = document.createElement('div');
          workInfo.classList.add('work-info');

          const catP = document.createElement('p');
          catP.classList.add('work-category');
          catP.textContent = item.category;

          const titleP = document.createElement('p');
          titleP.classList.add('work-title');
          titleP.textContent = item.title;

          workInfo.appendChild(catP);
          workInfo.appendChild(titleP);
          slide.appendChild(workInfo);

          // 建立圖片容器，僅讀取第一張圖片
          if (item.images && item.images.length > 0) {
            const imagesContainer = document.createElement('div');
            imagesContainer.classList.add('images-container');

            const img = document.createElement('img');
            // 將圖片路徑改為 "images/" 資料夾下的檔案
            img.src = 'images/' + item.images[0];
            img.alt = item.title;
            img.setAttribute('loading', 'lazy');
            imagesContainer.appendChild(img);
            slide.appendChild(imagesContainer);
          }

          slider.appendChild(slide);
        });
      });
    })
    .catch(error => console.error('Error loading assets:', error));

  // 另外，若頁面上有其他圖片，也可自動設定 lazy-loading 屬性：
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });

  /* --------------------
      展開內容區域 (讓頁面從底部展開，並更新網址)
  -------------------- */
  const links = document.querySelectorAll('.header-center a');
  const overlay = document.getElementById('overlay-content');
  const contents = document.querySelectorAll('.content');

  // 顯示對應的展開內容
  function showContent(targetId, updateUrl = true) {
    overlay.classList.add('active');

    // 隱藏所有內容，僅顯示點擊的內容
    contents.forEach(content => {
      content.classList.remove('active');
      if (content.id === targetId) {
        content.classList.add('active');
      }
    });

    // 更新網址（但不刷新頁面）
    if (updateUrl) {
      history.pushState(null, null, `#${targetId}`);
    }
  }

  // 監聽選單點擊，展開對應內容並更新網址
  links.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const targetId = this.getAttribute('data-target');
      showContent(targetId);
    });
  });

  // 監聽滾動事件，當滾動超過 100px 時才讓 overlay 蓋住 header
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      overlay.classList.add('scroll-active');
    } else {
      overlay.classList.remove('scroll-active');
    }
  });

  // 監聽網址變化，使用者按「上一頁/下一頁」時正確顯示內容
  window.addEventListener('popstate', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      showContent(hash, false);
    } else {
      overlay.classList.remove('active');
    }
  });

  // 頁面載入時，檢查網址的 hash，若有則展開對應內容
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash) {
    showContent(initialHash, false);
  }
});
