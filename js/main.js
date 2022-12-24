


document.addEventListener("DOMContentLoaded", function() {
    let article = new СreatingArticles({
        triggeredOnSave: saveArticle
    });

    
    function saveArticle() {
        const articlesSaved = JSON.parse(localStorage.getItem("articles")) || [];
        let id;

        articlesSaved.length ? id = articlesSaved.length : id = 0;

        const articleItem = document.querySelector(".articles .articles__item");
        articleItem.removeAttribute("data-confirmed");
        const finalArticles = document.querySelector(".final-articles");

        if(articleItem) {
            articlesSaved.push({
                id: id + 1,
                html: articleItem.outerHTML
            });
    
            localStorage.setItem("articles", JSON.stringify(articlesSaved));
    
            const firstArticlePart = articleItem.querySelector(".articles__part");

            articleItem.remove();
            article.disabledButtons();

            finalArticles.innerHTML = "";
            loadArticles();
            openArticle();
        }
    }

    function loadArticles() {
        const articles = JSON.parse(localStorage.getItem("articles")) || [];
        const finalArticles = document.querySelector(".final-articles");

        if(articles.length) {
            articles.forEach(article => {
                let div = document.createElement('div');
                div.innerHTML = article.html;

                const finalArticleItem = div.querySelector(".articles__item");
                const finalArticlePart = finalArticleItem.querySelector(".articles__part");

                finalArticleItem.innerHTML = finalArticlePart.outerHTML;
                finalArticleItem.setAttribute("data-id", article.id);
                finalArticleItem.setAttribute("data-path", "articles-item");

                finalArticles.append(finalArticleItem);
            });
        }
    }

    loadArticles();

    function openArticle() {
        const modal = new Modal();

        const finalArticlesItems = document.querySelectorAll(".final-articles .articles__item");
        
        finalArticlesItems.forEach(item => {
            item.addEventListener("click", function(event) {
                loadArticleData(event.currentTarget.dataset.id);
            });
        });
    }

    openArticle();

    function loadArticleData(id) {
        console.log(id)
        const articles = JSON.parse(localStorage.getItem("articles"));
        const modalContent =  document.querySelector(".modal__container[data-target=articles-item] .modal__content");

        articles.forEach(article => {
            if(article.id == id) {
                modalContent.innerHTML = article.html;
            }
        });
    };
});
