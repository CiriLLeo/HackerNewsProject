document.addEventListener('DOMContentLoaded', () => {
  const loadBestNewsBtn = document.getElementById('best');
  const loadTopNewsBtn = document.getElementById('top');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const newsContainer = document.getElementById('news-container');
  let currentNewsType = ''; 
  let minNews = 0;
  const maxNews = 10;

  function callFetch(url) {
    return fetch(url)
      .then(response => response.json())
  }

  function getNews(ids) {
    const promises = ids.slice(minNews, minNews + maxNews)
      .map(id => callFetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`))
    
    Promise.all(promises)
      .then(news => {
        getNewsOnScreen(news)
      })
      .catch(error => console.error('Error fetching news:', error))
  }

  function getNewsOnScreen(newsArray) {
    newsArray.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('card', 'border-success', 'mb-3');
      card.style.maxWidth = '18rem';

      const cardHeader = document.createElement('div');
      cardHeader.classList.add('card-header');
      cardHeader.textContent = 'Header'; 

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body', 'text-success');

      const cardTitle = document.createElement('h5');
      cardTitle.classList.add('card-title');
      cardTitle.textContent = item.title; 

      const cardText = document.createElement('p');
      cardText.classList.add('card-text');
      cardText.textContent = `Date: ${new Date(item.time * 1000).toLocaleString()}`; 

      const anchor = document.createElement('a');
      anchor.setAttribute('href', item.url);
      anchor.setAttribute('target', '_blank');
      anchor.textContent = 'Click here to read';

      cardBody.appendChild(cardTitle);
      cardBody.appendChild(anchor);
      cardBody.appendChild(cardText);

      card.appendChild(cardHeader);
      card.appendChild(cardBody);

      newsContainer.appendChild(card);
    });
  }

  function loadNewStories() {
    callFetch('https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty')
      .then(newsIds => {
        currentNewsType = 'new'; 
        newsContainer.innerHTML = ''; 
        getNews(newsIds);
        minNews += maxNews;
      })
      .catch(error => console.error('Error fetching new news IDs:', error));
  }

  // Carica le nuove storie quando la pagina è pronta
  loadNewStories();

  loadBestNewsBtn.addEventListener('click', () => {
    callFetch('https://hacker-news.firebaseio.com/v0/beststories.json?print=pretty')
      .then(newsIds => {
        currentNewsType = 'best';
        newsContainer.innerHTML = ''; 
        getNews(newsIds);
        minNews += maxNews;
      })
      .catch(error => console.error('Error fetching best news IDs:', error));
  });

  loadTopNewsBtn.addEventListener('click', () => {
    callFetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty')
      .then(newsIds => {
        currentNewsType = 'top';
        newsContainer.innerHTML = ''; 
        getNews(newsIds);
        minNews += maxNews;
      })
      .catch(error => console.error('Error fetching top news IDs:', error));
  });

  loadMoreBtn.addEventListener('click', () => {
    const fetchUrl = currentNewsType === 'best' ? 'https://hacker-news.firebaseio.com/v0/beststories.json' : 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty';

    callFetch(fetchUrl)
      .then(newsIds => {
        getNews(newsIds);
        minNews += maxNews;
      })
      .catch(error => console.error('Error fetching news IDs:', error));
  });
});
